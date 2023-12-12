import UTILS from "#services/utils/index.js";
import { FastifyInstance, FastifyReply } from "fastify";
import DB_USER from "#services/v1/database/user/index.js";
import { AUTH_Token, VERIFICATION_Token } from "#types/global/tokens";
import { AdminsModel, SessionModel, UsersModel } from "#db/mysql/types";
import { ChangeUserRole, DeactivateUser, DeleteSession, ListBranchUser, ResendInvite, ResetPassword, SaveUser, SetPassword } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";


type List = {
	rows: UsersModel[];
	totalPages: number;
	currentPage: number
}

class LIB_USER {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	/**list users of a particular branch */
	async list(token: AUTH_Token, payload: ListBranchUser): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_result = await DB.get(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async saveUser(token: AUTH_Token, payload: SaveUser): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);
				const DB_S = new DB_SUBSCRIPTION(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_S.canAddUser(token);

				await util.isAdmin(token);

				const newuser = await DB_A.findUser(payload.Email);

				if (newuser !== null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User already exist";
					return reject(this.#reply.DefaultResponse);
				}

				const data = {
					...payload,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}

				const DB_result = await DB.saveuser(data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async changeRole(token: AUTH_Token, payload: ChangeUserRole): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const data = {
					...payload,
					businessId: token.BusinessId,
					branchId: token.BranchId,
				}

				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_result = await DB.changeRole(data);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async deactivateUser(token: AUTH_Token, payload: DeactivateUser): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const data = {
					...payload,
					businessId: token.BusinessId,
					branchId: token.BranchId,
				}

				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const user = await DB_A.getUser(payload.Id);

				if (user === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User you are trying to deactivate does not exist";
					return reject(this.#reply.DefaultResponse);
				}

				if (user.role === "SUPER_ADMIN") {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "You can not deactivate account owner";
					return reject(this.#reply.DefaultResponse);
				}

				const DB_result = await DB.deactivate(data);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async listSession(token: AUTH_Token): Promise<SessionModel[] | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_result = await DB.getSession(token.Id);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async deleteSession(token: AUTH_Token, payload: DeleteSession): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_USER(this.#fastify, this.#reply);
				const DB_result = await DB.deleteSession(token.Id, payload.Id);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async resendInvite(token: AUTH_Token, payload: ResendInvite): Promise<{ email: string; name: string }> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const user = await DB_A.getUser(payload.Id) as UsersModel;

				if (user === null) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "The user does not exist";
					return reject(this.#reply.DefaultResponse);
				}

				if ((user.verified === true) && (user.status == "ACTIVE")) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "This user is active already";
					return reject(this.#reply.DefaultResponse);
				}

				resolve({
					email: user.email,
					name: user.name
				});
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async resendVerificationMail(token: VERIFICATION_Token): Promise<{ email: string; name: string }> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const user = await DB_A.getUser(token.Id) as AdminsModel;

				if (user === null) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "The user does not exist";
					return reject(this.#reply.DefaultResponse);
				}

				if (user.verified === true) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "This user is active already";
					return reject(this.#reply.DefaultResponse);
				}

				resolve({
					email: user.email,
					name: user.name
				});
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async resetPassword(payload: ResetPassword): Promise<{ email: string; name: string }> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const user = await DB_A.findUser(payload.Email) as UsersModel;

				if (user === null) {
					//this is used to fake user
					this.#reply.DefaultResponse.statusCode = 200;
					this.#reply.DefaultResponse.error = "Password reset link has been sent";
					return reject(this.#reply.DefaultResponse);
				}

				resolve({
					email: user.email,
					name: user.name
				});
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async setPassword(token: VERIFICATION_Token, payload: SetPassword): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_U = new DB_USER(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply);

				const hash = await util.hashPassword(payload.Password)
				const user = await DB_A.getUser(token.Id) as UsersModel;

				if (user === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Your account maybe invalid, we could not set your password";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_U.setPassword(token, hash, user.verified as boolean);

				resolve(true);
			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_USER;
