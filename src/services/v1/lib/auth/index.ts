import { FastifyInstance, FastifyReply } from "fastify";
import DB_AUTH from "#services/v1/database/auth/index.js";
import UTILS from "#services/utils/index.js";
import { Login, Register, VerificationCode, ChangePassword } from "#types/payloads";
import { AUTH_PRE_Token, AUTH_Token, Role } from "#types/global/tokens";
import { AdminsModel, UsersModel } from "#plugins/database/mysql/tables/types";


class LIB_AUTH {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async login(req_payload: Login, rest: AUTH_Token): Promise<{ raw_token: AUTH_Token, verified: boolean }> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);

				const DB_result = await DB.findUser(req_payload.Email) as UsersModel;

				if (DB_result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Invalid email or password";
					return reject(this.#reply.DefaultResponse);
				}

				if (DB_result.status == "DISABLED") {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Invalid email or password";
					return reject(this.#reply.DefaultResponse);
				}

				await util.validatePassword(DB_result.password, req_payload.Password);

				const data = {
					...rest,
					Id: DB_result.id,
					Role: DB_result.role as Role,
					BusinessId: DB_result.businessId,
					BranchId: DB_result.branchId
				}
				resolve({ raw_token: data, verified: DB_result.verified as boolean });
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async saveCookie(req_payload: AUTH_PRE_Token): Promise<AUTH_Token> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_AUTH(this.#fastify, this.#reply);

				const DB_result = await DB.findUser(req_payload.Email);

				if (DB_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "unauthorized";
					return reject(this.#reply.DefaultResponse);
				}

				const data = {
					LoginId: req_payload.LoginId,
					Id: DB_result.id,
					Role: DB_result.role as Role,
					BusinessId: DB_result.businessId,
					BranchId: DB_result.branchId
				}
				resolve(data);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async register(req_payload: Register, userId: string, businessId: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);

				const DB_result = await DB.findUser(req_payload.Email);

				if (DB_result !== null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "User already exist";
					return reject(this.#reply.DefaultResponse);
				}

				const hash = await util.hashPassword(req_payload.Password);

				await DB.storeUser(req_payload, userId, businessId, hash)

				resolve(true);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async changePassword(token: AUTH_Token, req_payload: ChangePassword): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);

				const DB_result = await DB.getUser(token.Id);

				if (DB_result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "User does not exist";
					return reject(this.#reply.DefaultResponse);
				}
				const isOldPasswordValid = await util.validatePassword(DB_result.password, req_payload.OldPassword);

				if (!isOldPasswordValid) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Incorrect oldpassword";
					return reject(this.#reply.DefaultResponse);
				}
				const hash = await util.hashPassword(req_payload.NewPassword);

				const data = {
					hashPassword: hash,
					businessId: token.BusinessId,
					branchId: token.BranchId,

				}
				await DB.storePassword(token, data)

				resolve(true);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async verifyCode(payload: VerificationCode): Promise<UsersModel | AdminsModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);

				const user = await DB_A.findUser(payload.Email) as UsersModel;

				if (user === null) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "The user does not exist";
					return reject(this.#reply.DefaultResponse);
				}

				if (payload.Type !== "DELETE_ITEM") {
					if ((user.verified === true) && (user.status == "ACTIVE")) {
						this.#reply.DefaultResponse.statusCode = 400;
						this.#reply.DefaultResponse.data = {
							type: payload.Type
						}
						this.#reply.DefaultResponse.error = "This user is active already";
						return reject(this.#reply.DefaultResponse);
					}
				}


				if (payload.Type == "VERIFICATION") {

					const mins = util.getMinDiff(payload.Date);

					if (mins > 10) {
						this.#reply.DefaultResponse.statusCode = 400;
						this.#reply.DefaultResponse.data = {
							type: payload.Type
						}
						this.#reply.DefaultResponse.error = "Verification code has expired";
						return reject(this.#reply.DefaultResponse);
					}

					const data = {
						id: user.id,
						branchId: user.branchId,
						businessId: user.businessId
					}

					await DB_A.verified(data)
				}
				else {

					const days = util.getDayDiff(payload.Date);
					const len = payload.Type == "DELETE_ITEM" ? 1 : 2;

					if (days > len) {
						this.#reply.DefaultResponse.data = {
							type: payload.Type
						}
						this.#reply.DefaultResponse.statusCode = 400;
						this.#reply.DefaultResponse.error = "Verification code has expired";
						return reject(this.#reply.DefaultResponse);
					}
				}
				resolve(user);
			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_AUTH;
