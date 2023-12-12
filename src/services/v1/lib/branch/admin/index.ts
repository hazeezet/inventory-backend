import UTILS from "#services/utils/index.js";
import { FastifyInstance, FastifyReply } from "fastify";
import DB_USER from "#services/v1/database/branch/admin/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { UsersModel } from "#db/mysql/types";
import { ListBranchUser, ResendInvite, SaveBranchAdmin } from "#types/payloads";
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
	async listBranch(token: AUTH_Token, payload: ListBranchUser): Promise<List | []> {
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

	async saveUser(token: AUTH_Token, payload: SaveBranchAdmin): Promise<boolean> {
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
				await util.isAnyAdmin(token);

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
}

export default LIB_USER;
