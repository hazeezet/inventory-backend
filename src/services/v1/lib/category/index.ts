import { FastifyInstance, FastifyReply } from "fastify";
import DB_CATEGORY from "#services/v1/database/category/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { CategoryModel } from "#db/mysql/types";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { ListCategory } from "#types/payloads";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";


type List = {
	rows: CategoryModel[];
	totalPages: number;
	currentPage: number
}

class LIB_CATEGORY {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async list(token: AUTH_Token, payload: ListCategory): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_CATEGORY(this.#fastify, this.#reply);
				const DB_result = await DB.get(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async save(token: AUTH_Token, name: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_CATEGORY(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_S = new DB_SUBSCRIPTION(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_S.canAddCategory(token);

				const data = {
					categoryName: name,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}

				const DB_result = await DB.save(data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async edit(token: AUTH_Token, { id, name }: { id: string, name: string }): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_CATEGORY(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);
				await DB.exist(id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				const data = {
					categoryName: name,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}

				const DB_result = await DB.edit(id, data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async delete(token: AUTH_Token, { id }: { id: string }): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_CATEGORY(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);
				await DB.exist(id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB.canDelete(id);
				await DB.delete(id);

				resolve(true);
			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_CATEGORY;
