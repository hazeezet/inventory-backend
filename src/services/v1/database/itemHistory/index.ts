"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { randomBytes } from "crypto";

type SaveType = {
	itemId: string;
	quantity: number;
	priceId?: string;
	amount?: number;
	itemLeft: number;
	createdBy: string;
	businessId: string;
	branchId: string;
}


class DB_ITEM_HISTORY {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async isCreate(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const id = "QC_ITH_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.ItemHistory.create({
					id: id,
					itemId: data.itemId,
					action: "CREATE",
					quantity: data.quantity,
					itemLeft: data.itemLeft,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId,
				});

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

	async isRestock(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const id = "QC_ITH_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.ItemHistory.create({
					id: id,
					itemId: data.itemId,
					action: "RESTOCK",
					quantity: data.quantity,
					itemLeft: data.itemLeft,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId,
				});

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

	async isAdjust(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const id = "QC_ITH_" + buf.toString("hex").toUpperCase();

				const am = data.amount as number;

				await this.#fastify.DB.SQL.ItemHistory.create({
					id: id,
					itemId: data.itemId,
					action: "ADJUST",
					quantity: data.quantity,
					itemLeft: data.itemLeft,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId,
					amount:  am * data.quantity,
					priceId: data.priceId
				});

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to remove the item";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async delete(itemId: string, businessId: string, branchId: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.ItemHistory.destroy({
					where: {
						itemId,
						businessId,
						branchId
					}
				})

				if (result === 0) {
					this.#reply.DefaultResponse.statusCode = 404;
					this.#reply.DefaultResponse.error = "Item could not be deleted";
					return reject(this.#reply.DefaultResponse)
				}

				return resolve(result ? true : false);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async isTransferIn(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const id = "QC_ITH_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.ItemHistory.create({
					id: id,
					itemId: data.itemId,
					action: "TRANSFER_IN",
					quantity: data.quantity,
					itemLeft: data.itemLeft,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId,
				});

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Something went wrong";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async isTransferOut(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const id = "QC_ITH_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.ItemHistory.create({
					id: id,
					itemId: data.itemId,
					action: "TRANSFER_OUT",
					quantity: data.quantity,
					itemLeft: data.itemLeft,
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId,
				});

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Something went wrong";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}
}

export default DB_ITEM_HISTORY;
