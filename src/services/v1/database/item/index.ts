"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { ItemModel, ItemHistoryModel } from "#db/mysql/types";
import { ListAdjustHistory, ListInventory, ListItem ,ListRestockHistory,ListTransferHistory} from "#types/payloads";
import sequelize, { Op } from "sequelize";
import { randomBytes } from "crypto";
import DB_ITEM_HISTORY from "../itemHistory";

type Row = ItemModel & {
	status: string;
};

type List = {
	rows: Row[];
	totalPages: number;
	currentPage: number
}

type inventoryList = {
	rows: ItemHistoryModel[];
	totalPages: number;
	currentPage: number;
};

type SaveType = {
	name: string;
	category: string;
	code: string;
	available?: number;
	price: number;
	minimum: number;
	batch: string;
	measurementValue?: number | null;
	measurementUnit?: string | null;
	measurementName?: string | null;
	manufacturerName?: string | null;
	businessId: string;
	branchId: string;
	createdBy: string;
}

type EditType = {
	name: string;
	category: string;
	code: string;
	available?: number;
	previousQuantity: number;
	price?: number;
	minimum: number;
	batch: string;
	measurementValue?: number | null;
	measurementUnit?: string | null;
	measurementName?: string | null;
	manufacturerName?: string | null;
	businessId: string;
	branchId: string;
	createdBy: string;
}

type AdjustType = {
	quantity: number,
	priceId?: string,
	amount?: number,
	previousQuantity: number;
	businessId: string,
	branchId: string,
	createdBy: string
}
class DB_ITEM {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async get(businessId: string, branchId: string, payload: ListItem): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Item.findAndCountAll({
					attributes: {
						exclude: ["businessId", "branchId", "price"]
					},
					where: {
						businessId,
						branchId,
						[Op.or]: [
							{ name: { [Op.like]: `%${payload.Search}%` } },
							{ code: { [Op.like]: `%${payload.Search}%` } },
							{ measurementName: { [Op.like]: `%${payload.Search}%` } },
							{ measurementUnit: { [Op.like]: `%${payload.Search}%` } },
							{ batchNumber: { [Op.like]: `%${payload.Search}%` } },
							{ manufacturerName: { [Op.like]: `%${payload.Search}%` } }
						]
					},
					include: [
						{
							model: this.#fastify.DB.SQL.ItemPrice,
							attributes: ["amount"],
							as: "pricing"
						},
					],
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})

				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				const rows = result.rows.map(({ available, minimum, dataValues }, index) => {
					let status;

					const av = available as number;
					const min = minimum as number;

					if (av > min * 1.7) {
						status = "HIGH";
					} else if (av > min * 1.5) {
						status = "LOW";
					} else {
						status = av <= min ? "EMPTY" : "LOW";
					}

					return { ...dataValues, status, createdAt: result.rows[index].createdAt, updatedAt: result.rows[index].createdAt };
				});

				return resolve({
					rows: rows as unknown as Row[],
					totalPages,
					currentPage
				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async getById(businessId: string, branchId: string, id: string): Promise<ItemModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Item.findOne({
					attributes: {
						exclude: ["businessId", "branchId", "price"]
					},
					include: [
						{
							model: this.#fastify.DB.SQL.ItemPrice,
							attributes: ["amount", "id"],
							as: "pricing"
						},
					],
					where: {
						businessId,
						branchId,
						id
					}
				})

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "Item does not exist";
					return reject(this.#reply.DefaultResponse)
				}

				return resolve(result);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async getInventory(businessId: string, branchId: string, payload: ListInventory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.ItemHistory.findAndCountAll({
					attributes: [
						"itemId", "createdBy", "createdAt", "updatedAt",
						[
							sequelize.literal(`(SELECT SUM(quantity) FROM itemHistory WHERE action IN ('CREATE', 'TRANSFER_IN', 'RESTOCK') AND businessId = '${businessId}' AND branchId = '${branchId}')`),
							"quantityStocked"
						],
						[
							sequelize.literal(`(SELECT SUM(quantity) FROM itemHistory WHERE action IN ('ADJUST', 'TRANSFER_OUT') AND businessId = '${businessId}' AND branchId = '${branchId}')`),
							"quantityOut"
						],
					],
					include: [
						{
							model: this.#fastify.DB.SQL.Item,
							attributes: ["name", ["available", "stock_left"]],
							as: "item"
						},
					],
					where: {
						businessId,
						branchId,
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})

				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;
				
				return resolve({
					rows: result.rows,
					totalPages,
					currentPage
				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list inventory report";
				return reject(this.#reply.DefaultResponse);
			}
		});
	}


	async getAdjustHistory(businessId: string, branchId: string, payload: ListAdjustHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.ItemHistory.findAndCountAll({
					attributes: [
						"itemId", "createdBy", "createdAt", "updatedAt","quantity","action",
						
					],
					include: [
						{
							model: this.#fastify.DB.SQL.Item,
							attributes: ["name", "code",["available", "stock_left"]],
							as: "item"
						},
					],
					where: {
						businessId,
						branchId,
						action:"ADJUST",
						
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})

				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				return resolve({
					rows: result.rows,
					totalPages,
					currentPage
				});
				
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list item adjust history";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async getRestockHistory(businessId: string, branchId: string, payload: ListRestockHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.ItemHistory.findAndCountAll({
					attributes: [
						"itemId", "createdBy", "createdAt", "updatedAt","quantity","action",
						
					],
					include: [
						{
							model: this.#fastify.DB.SQL.Item,
							attributes: ["name", "code",["available", "stock_level"]],
							as: "item"
						},
					],
					where: {
						businessId,
						branchId,
						action:"RESTOCK",
						
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})

				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				return resolve({
					rows: result.rows,
					totalPages,
					currentPage
				});
				
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list item restock history";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async getTransferHistory(businessId: string, branchId: string, payload: ListTransferHistory): Promise<inventoryList | []> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.ItemHistory.findAndCountAll({
					attributes: [
						"itemId", "createdBy", "createdAt", "updatedAt","action","quantity",
					
					],
					include: [
						{
							model: this.#fastify.DB.SQL.Item,
							attributes: ["name", "code" ],
							as: "item"
						},
						{
							model: this.#fastify.DB.SQL.Branch,
							attributes: [["name","recieving_branch"]],
		
							as: "branch"
						},
					],
					where: {
						businessId,
						branchId,
						action: 'TRANSFER_OUT' 
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})

				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				return resolve({
					rows: result.rows,
					totalPages,
					currentPage
				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list stock transfer history";
				return reject(this.#reply.DefaultResponse);
			}
		});
	}

	async save(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const DB_H = new DB_ITEM_HISTORY(this.#fastify, this.#reply);
				const buf = randomBytes(6);
				const itemId = "QC_IT_" + buf.toString("hex").toUpperCase();

				let priceId = null;

				if (data.price) {
					const buf_p = randomBytes(6);
					priceId = "QC_IPR_" + buf_p.toString("hex").toUpperCase();

					await this.#fastify.DB.SQL.ItemPrice.create({
						id: priceId,
						itemId,
						amount: data.price,
						businessId: data.businessId,
						branchId: data.branchId,
					});
				}

				await this.#fastify.DB.SQL.Item.create({
					id: itemId,
					name: data.name,
					category: data.category,
					code: data.code,
					available: data.available as number,
					price: priceId,
					minimum: data.minimum,
					batchNumber: data.batch,
					measurementValue: data.measurementValue,
					measurementUnit: data.measurementUnit,
					measurementName: data.measurementName,
					manufacturerName: data.manufacturerName,
					businessId: data.businessId,
					branchId: data.branchId,
				});

				await this.#fastify.DB.SQL.Category.update({
					items: sequelize.literal("items+1")

				}, { where: { id: data.category, businessId: data.businessId, branchId: data.branchId } });

				await DB_H.isCreate({
					itemId: itemId,
					quantity: data.available as number,
					itemLeft: data.available as number,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId
				})

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to save the item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async edit(id: string, data: EditType, oldCategory: string | undefined = undefined, isRestock: boolean = false, isRemove: boolean = false): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				let priceId = undefined;

				if (data.price) {
					const buf_p = randomBytes(6);
					priceId = "QC_IPR_" + buf_p.toString("hex").toUpperCase();

					await this.#fastify.DB.SQL.ItemPrice.create({
						id: priceId,
						itemId: id,
						amount: data.price,
						businessId: data.businessId,
						branchId: data.branchId,
					});
				}

				await this.#fastify.DB.SQL.Item.update({
					name: data.name,
					category: data.category,
					code: data.code,
					available: (data.available && !isRemove) ? sequelize.literal(`available+${data.available}`) : data.available && isRemove ? sequelize.literal(`available-${data.available}`) : undefined,
					price: priceId,
					minimum: data.minimum,
					batchNumber: data.batch,
					measurementValue: data.measurementValue,
					measurementUnit: data.measurementUnit,
					measurementName: data.measurementName,
					manufacturerName: data.manufacturerName

				}, { where: { id, businessId: data.businessId, branchId: data.branchId } });

				//update number of items in the category
				if (oldCategory && (oldCategory !== data.category)) {
					await this.#fastify.DB.SQL.Category.update({
						items: sequelize.literal("items-1")

					}, { where: { id: oldCategory, businessId: data.businessId, branchId: data.branchId } });

					await this.#fastify.DB.SQL.Category.update({
						items: sequelize.literal("items+1")

					}, { where: { id: data.category, businessId: data.businessId, branchId: data.branchId } });
				}

				if (isRestock) {
					const DB_H = new DB_ITEM_HISTORY(this.#fastify, this.#reply);
					await DB_H.isRestock({
						itemId: id,
						quantity: data.available as number,
						itemLeft: data.available as number + data.previousQuantity as number,
						createdBy: data.createdBy,
						businessId: data.businessId,
						branchId: data.branchId
					})
				}
				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to edit the item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async adjust(id: string, data: AdjustType, isAdjust: boolean = false): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.Item.update({
					available: sequelize.literal(`available -${data.quantity}`)
				}, { where: { id, businessId: data.businessId, branchId: data.branchId } });

				if (isAdjust) {
					const DB_H = new DB_ITEM_HISTORY(this.#fastify, this.#reply);
					await DB_H.isAdjust({
						itemId: id,
						quantity: data.quantity as number,
						priceId: data.priceId as string,
						amount: data.amount as number,
						itemLeft: data.previousQuantity as number - data.quantity as number,
						createdBy: data.createdBy,
						businessId: data.businessId,
						branchId: data.branchId
					})
				}

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to adjust the item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async exist(id: string): Promise<ItemModel | null> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.Item.findOne({
					attributes: ["id", "name", "category", "code", "available", "price", "minimum", "batchNumber", "measurementValue", "measurementUnit", "measurementName", "manufacturerName", "updatedAt"],
					where: { id }
				})
				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "Item does not exist";
					return reject(this.#reply.DefaultResponse)
				}

				return resolve(result);
			} catch (error) {

				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async delete(id: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const catId = await this.#fastify.DB.SQL.Item.findOne({ where: { id } })

				if (catId !== null) {

					await this.#fastify.DB.SQL.Category.update({
						items: sequelize.literal("items-1")

					}, { where: { id: catId.category } });

					const result = await this.#fastify.DB.SQL.Item.destroy({ where: { id } })

					if (result === 0) {
						this.#reply.DefaultResponse.statusCode = 401;
						this.#reply.DefaultResponse.error = "Item could not be deleted";

						await this.#fastify.DB.SQL.Category.update({
							items: sequelize.literal("items+1")

						}, { where: { id: catId.category } });

						return reject(this.#reply.DefaultResponse)
					}

					return resolve(result ? true : false);
				}

			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async isSameItem(businessId: string, branchId: string, batchNumber: string | null, code: string, name: string, price: number | null): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Item.findOne({
					attributes: {
						exclude: ["businessId", "branchId"]
					},
					where: {
						businessId,
						branchId,
						batchNumber,
						code,
						name
					},
					include: [
						{
							model: this.#fastify.DB.SQL.ItemPrice,
							attributes: ["amount"],
							as: "pricing"
						},
					]
				})

				if (result === null) {
					return reject(false)
				}

				if (result.pricing?.amount != price) return reject(false);

				return resolve(result.id);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}
}

export default DB_ITEM;
