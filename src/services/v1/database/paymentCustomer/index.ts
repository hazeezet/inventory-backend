"use strict"

import { PaymentCustomerModel } from "#plugins/database/mysql/tables/types";
import { FastifyInstance, FastifyReply } from "fastify";


type SaveType = {
	AdminId: string;
	Id: string;
	Provider: "STRIPE" | "PAYSTACK";
}

/**
 * Authorization database instance
 */
class DB_PAYMENT_CUSTOMER {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async save(payload: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.PaymentCustomer.findOrCreate({
					where: {
						adminId: payload.AdminId
					},
					defaults: {
						id: payload.Id,
						adminId: payload.AdminId,
						provider: payload.Provider
					}
				})

				return resolve(true);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async get(adminId: string): Promise<PaymentCustomerModel | null> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.PaymentCustomer.findOne({
					where: {
						adminId: adminId
					}
				})

				return resolve(result);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}
}

export default DB_PAYMENT_CUSTOMER;
