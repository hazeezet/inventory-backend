import UTILS from "#services/utils/index.js";
import { FastifyInstance, FastifyReply } from "fastify";
import DB_ITEM from "#services/v1/database/item/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { ItemModel, ItemHistoryModel } from "#db/mysql/types";
import { Adjust, ListAdjustHistory, ListBranchItem, ListInventory, ListItem, ListRestockHistory, Restock, Transfer,ListTransferHistory } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { AddItem, EditItem } from "#types/payloads"
import DB_CATEGORY from "#services/v1/database/category/index.js";
import DB_ITEM_HISTORY from "#services/v1/database/itemHistory/index.js";
import DB_BRANCH from "#services/v1/database/branch/index.js";
import { randomBytes } from "crypto";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";


type List = {
	rows: ItemModel[];
	totalPages: number;
	currentPage: number
}
type inventoryList = {
	rows: ItemHistoryModel[];
	totalPages: number;
	currentPage: number
}

class LIB_ITEM {
	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async list(token: AUTH_Token, payload: ListItem): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.get(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async listBranch(token: AUTH_Token, payload: ListBranchItem): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);

				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.get(token.BusinessId, payload.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async listInventory(token: AUTH_Token, payload: ListInventory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.getInventory(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}
	
	async listTransferHistory(token: AUTH_Token, payload: ListTransferHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.getTransferHistory(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async listAdjustHistory(token: AUTH_Token, payload: ListAdjustHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);
				
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.getAdjustHistory(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async listRestockHistory(token: AUTH_Token, payload: ListRestockHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);
				await util.isAdmin(token);
				
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_result = await DB.getRestockHistory(token.BusinessId, token.BranchId, payload);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async save(item: AddItem, token: AUTH_Token): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_C = new DB_CATEGORY(this.#fastify, this.#reply)
				const DB_S = new DB_SUBSCRIPTION(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_S.canAddUser(token);

				const data = {
					name: item.Name,
					category: item.Category,
					code: item.Code,
					available: item.Available,
					price: item.Price,
					minimum: item.Minimum,
					batch: item.Batch,
					measurementValue: item.MeasurementValue,
					measurementUnit: item.MeasurementUnit,
					measurementName: item.MeasurementName,
					manufacturerName: item.ManufacturerName,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}
				await DB_C.exist(item.Category)
				const DB_result = await DB.save(data);

				resolve(DB_result);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async edit(token: AUTH_Token, item: EditItem): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_C = new DB_CATEGORY(this.#fastify, this.#reply)

				const DB_A_result = await DB_A.getUser(token.Id);
				const item_r = await DB.exist(item.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				const data = {
					id: item.Id,
					name: item.Name,
					category: item.Category,
					code: item.Code,
					price: item.Price,
					minimum: item.Minimum,
					previousQuantity: 0, //not needed
					batch: item.Batch,
					measurementValue: item.MeasurementValue,
					measurementUnit: item.MeasurementUnit,
					measurementName: item.MeasurementName,
					manufacturerName: item.ManufacturerName,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}
				await DB_C.exist(item.Category)
				const DB_result = await DB.edit(item.Id, data, item_r?.category);

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
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);
				await DB.exist(id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Item could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				resolve(true);
			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async restock(token: AUTH_Token, payload: Restock): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				const item = await DB.getById(token.BusinessId, token.BranchId, payload.Id);

				if (payload.Batch && (item.batchNumber?.toLocaleLowerCase() !== payload.Batch.toLocaleLowerCase())) {
					await DB.save({
						...item.toJSON(),
						batch: payload.Batch,
						available: payload.Available,
						price: payload.Price as number ?? item.pricing?.amount,
						businessId: token.BusinessId,
						branchId: token.BranchId,
						createdBy: DB_A_result.name
					})
					return resolve(true);
				}

				const data = {
					...item.toJSON(),
					available: payload.Available,
					previousQuantity: item.available,
					price: payload.Price ?? undefined,
					batch: item.batchNumber as string,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}

				const DB_result = await DB.edit(payload.Id, data, undefined, true);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async adjust(token: AUTH_Token, payload: Adjust): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);

				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				const item = await DB.getById(token.BusinessId, token.BranchId, payload.Id);

				if (payload.Quantity > item.available) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Number of available item is too low";
					return reject(this.#reply.DefaultResponse);
				}

				const data = {
					...item.toJSON(),
					quantity: payload.Quantity,
					priceId: item.pricing?.id,
					amount: item.pricing?.amount,
					previousQuantity: item.available,
					businessId: token.BusinessId,
					branchId: token.BranchId,
					createdBy: DB_A_result.name
				}

				const DB_result = await DB.adjust(payload.Id, data, true);

				resolve(DB_result);

			}
			catch (error) {
				return reject(error)
			}
		});
	}

	async transfer(token: AUTH_Token, payload: Transfer): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB = new DB_ITEM(this.#fastify, this.#reply);
				const UTIL = new UTILS(this.#fastify, this.#reply);
				const DB_A = new DB_AUTH(this.#fastify, this.#reply);
				const DB_B = new DB_BRANCH(this.#fastify, this.#reply);
				const DB_C = new DB_CATEGORY(this.#fastify, this.#reply);
				const DB_H = new DB_ITEM_HISTORY(this.#fastify, this.#reply);

				await UTIL.isAnyAdmin(token);
				const DB_A_result = await DB_A.getUser(token.Id);

				if (DB_A_result === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "User could not be found";
					return reject(this.#reply.DefaultResponse);
				}

				await DB_B.exist(payload.Branch);
				if (token.BranchId == payload.Branch) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "You cannot transfer to the same branch";
					return reject(this.#reply.DefaultResponse);
				}

				//item from branch where the transfer is coming from 
				const item_from = await DB.getById(token.BusinessId, token.BranchId, payload.Item);

				if (payload.Quantity > item_from.available) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Number of available item is too low";
					return reject(this.#reply.DefaultResponse);
				}

				try {
					//id of the item where the transfer is going to
					const id = await DB.isSameItem(token.BusinessId, payload.Branch, item_from.batchNumber, item_from.code, item_from.name, item_from.pricing?.amount as number);

					const data_from = {
						...item_from.toJSON(),
						available: payload.Quantity,
						previousQuantity: item_from.available,
						price: undefined,
						batch: item_from.batchNumber as string,
						businessId: token.BusinessId,
						branchId: token.BranchId,
						createdBy: DB_A_result.name
					}
					await DB.edit(item_from.id, data_from, undefined, undefined, true);

					//item from branch where the transfer is going to
					const item_to = await DB.getById(token.BusinessId, payload.Branch, id);

					const data_to = {
						...item_to.toJSON(),
						available: payload.Quantity,
						previousQuantity: item_from.available,
						price: undefined,
						batch: item_from.batchNumber as string,
						businessId: token.BusinessId,
						branchId: payload.Branch,
						createdBy: DB_A_result.name
					}
					await DB.edit(id, data_to);

					await DB_H.isTransferIn({
						itemId: item_to.id,
						quantity: payload.Quantity,
						itemLeft: item_to.available as number + payload.Quantity,
						createdBy: DB_A_result.name,
						businessId: token.BusinessId,
						branchId: payload.Branch
					})
					await DB_H.isTransferOut({
						itemId: item_from.id,
						quantity: payload.Quantity,
						itemLeft: item_from.available as number - payload.Quantity,
						createdBy: DB_A_result.name,
						businessId: token.BusinessId,
						branchId: token.BranchId
					})

					resolve(true);
				} catch (error) {
					const category = await DB_C.getById(token.BusinessId, token.BranchId, item_from.category);

					const buf = randomBytes(6);
					const categoryid = "QC_CT_" + buf.toString("hex").toUpperCase();

					await DB_C.save({
						categoryName: category.name,
						businessId: token.BusinessId,
						branchId: payload.Branch,
						createdBy: DB_A_result.name
					}, categoryid)

					await DB.save({
						...item_from.toJSON(),
						category: categoryid,
						batch: item_from.batchNumber as string,
						available: payload.Quantity,
						price: item_from.pricing?.amount as number,
						businessId: token.BusinessId,
						branchId: payload.Branch,
						createdBy: DB_A_result.name
					})

					const data_from = {
						...item_from.toJSON(),
						available: payload.Quantity,
						previousQuantity: item_from.available,
						price: undefined,
						batch: item_from.batchNumber as string,
						businessId: token.BusinessId,
						branchId: token.BranchId,
						createdBy: DB_A_result.name
					}
					await DB.edit(item_from.id, data_from, undefined, undefined, true);

					await DB_H.isTransferOut({
						itemId: item_from.id,
						quantity: payload.Quantity,
						itemLeft: item_from.available as number - payload.Quantity,
						createdBy: DB_A_result.name,
						businessId: token.BusinessId,
						branchId: token.BranchId
					})
					return resolve(true);
				}
			}
			catch (error) {
				return reject(error)
			}
		});
	}
}

export default LIB_ITEM;
