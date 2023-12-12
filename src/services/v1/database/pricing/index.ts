"use strict"

import { PricingModel } from "#plugins/database/mysql/tables/types";
import { FastifyInstance, FastifyReply } from "fastify";
import { Op } from "sequelize";

class DB_PRICING {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async getById(id: string): Promise<PricingModel> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.Pricing.findOne({
					attributes: {
						exclude: ["createdAt", "updatedAt"]
					},
					where: {
						id
					}
				});

				if (result == null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "We could not complete your payment";
					return reject();
				}
				resolve(result)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "We could not complete your payment";
				return reject();
			}
		})
	}

	async get(adminId: string): Promise<PricingModel[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.Pricing.findAll({
					attributes: {
						exclude: ["createdAt", "updatedAt", "visible"]
					},
					where: {
						[Op.or]: [
							{ visible: adminId },
							{ visible: "ALL" }
						]
					}
				});

				if (result == null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "unable to list price";
					return reject();
				}
				resolve(result)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "unable to list price";
				return reject();
			}
		})
	}
}

export default DB_PRICING;
