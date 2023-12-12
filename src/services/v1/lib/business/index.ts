import { FastifyInstance, FastifyReply } from "fastify";
import DB_BUSINESS from "#services/v1/database/business/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { BusinessModel } from "#db/mysql/types";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { ChangeCurrency, EditBusiness, ListBusiness, SaveBusiness, SwitchBusiness } from "#types/payloads";
import UTILS from "#services/utils/index.js";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";

type List = {
	rows: BusinessModel[];
	totalPages: number;
	currentPage: number
}

class LIB_BUSINESS {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async list(token: AUTH_Token, payload: ListBusiness): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BUSINESS(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)

				try {
					await util.isAdmin(token);
					const account = await DB_A.adminInfo(token.BusinessId);
					const DB_result = await DB.getAll(account.admin.id, payload);

					resolve(DB_result);
				} catch (error) {
					const DB_result = await DB.get(token.BusinessId);

					resolve(DB_result);
				}
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async save(token: AUTH_Token, payload: SaveBusiness): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BUSINESS(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_S = new DB_SUBSCRIPTION(this.#fastify, this.#reply);
				const UTIL = new UTILS(this.#fastify, this.#reply);

				await DB_S.canAddBusiness(token);
				await DB_S.canAddBranch(token);
				await UTIL.isAdmin(token);

				const account = await DB_A.adminInfo(token.BusinessId);

				const data = {
					name: payload.Name,
					currency: account.admin.currency,
					businessId: token.BusinessId,
					country: account.admin.country,
					adminId: account.admin.id
				}

				const DB_result = await DB.save(data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async edit(token: AUTH_Token, payload: EditBusiness): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BUSINESS(this.#fastify, this.#reply);
				const UTIL = new UTILS(this.#fastify, this.#reply);

				await DB.exist(payload.Id);
				await UTIL.isAdmin(token);

				const data = {
					name: payload.Name,
					businessId: token.BusinessId
				}

				const DB_result = await DB.edit(payload.Id, data);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async switch(token: AUTH_Token, payload: SwitchBusiness): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_BUSINESS(this.#fastify, this.#reply);
				const util = new UTILS(this.#fastify, this.#reply)

				await DB.exist(payload.Id);

				await util.isAdmin(token);

				const branchId = await DB.switch(token, payload.Id)

				resolve(branchId);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async changeCurrency(token: AUTH_Token, payload: ChangeCurrency): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const data = {
					...payload,
					businessId: token.BusinessId,
					branchId: token.BranchId,
				}

				const DB = new DB_BUSINESS(this.#fastify, this.#reply);
				const DB_result = await DB.changeCurrency(data);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_BUSINESS;
