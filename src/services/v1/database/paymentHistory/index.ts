"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { randomBytes } from "crypto";


type SaveType = {
	AdminId: string;
	SubscriptionId: string;
	Type: "MONTHLY" | "YEARLY";
	Name: string,
	Customer: string,
	Currency: string,
	Amount: number
}

/**
 * Authorization database instance
 */
class DB_PAYMENT_HISTORY {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async save(payload: SaveType): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {

				const buf_p = randomBytes(4);
				const paymentId = "QC_PYH_" + buf_p.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.PaymentHistory.create({
					id: paymentId,
					adminId: payload.AdminId,
					name: payload.Name,
					type: payload.Type,
					customer: payload.Customer,
					subscriptionId: payload.SubscriptionId,
					currency: payload.Currency,
					amount: payload.Amount
				})

				return resolve(paymentId);
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

export default DB_PAYMENT_HISTORY;
