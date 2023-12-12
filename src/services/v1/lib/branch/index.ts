import { FastifyInstance, FastifyReply } from "fastify";
import DB_BRANCH from "#services/v1/database/branch/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { BranchesModel } from "#plugins/database/mysql/tables/types";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { EditBranch, ListBranch, SaveBranch, SwitchBranch } from "#types/payloads";
import UTILS from "#services/utils/index.js";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";

type List = {
	rows: BranchesModel[];
	totalPages: number;
	currentPage: number
}

class LIB_BRANCH {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async list(token: AUTH_Token, payload: ListBranch): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BRANCH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)

				try {
					await util.isAdminAndManager(token);
					const DB_result = await DB.getAll(token.BusinessId, payload);

					resolve(DB_result);
				} catch (error) {
					const DB_result = await DB.get(token.BusinessId, token.BranchId);

					resolve(DB_result);
				}
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async save(token: AUTH_Token, payload: SaveBranch): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BRANCH(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_S = new DB_SUBSCRIPTION(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)
				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_S.canAddBranch(token);

				await util.isAdmin(token);

				const data = {
					Name: payload.Name,
					Address: payload.Address,
					businessId: token.BusinessId,
					branchId: token.BranchId,
				}

				const DB_result = await DB.save(data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async edit(token: AUTH_Token, payload: EditBranch): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BRANCH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)

				await DB.exist(payload.Id);

				await util.isAdmin(token);

				const data = {
					Name: payload.Name,
					Address: payload.Address,
					businessId: token.BusinessId,
					branchId: token.BranchId
				}

				const DB_result = await DB.edit(payload.Id, data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async switch(token: AUTH_Token, payload: SwitchBranch): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BRANCH(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)

				const DB_A_result = await DB_A.getUser(token.Id);
				await DB.exist(payload.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await util.isAdminAndManager(token);

				await DB.switch(token, payload.Id)

				resolve(true);

			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_BRANCH;
