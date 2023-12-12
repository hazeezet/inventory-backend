import { FastifyInstance, FastifyReply } from "fastify";
import Event from "stripe";
import DB_PRICING from "#services/v1/database/pricing/index.js";
import DB_PAYMENT_HISTORY from "#services/v1/database/paymentHistory/index.js";
import DB_SUBSCRIPTION from "#services/v1/database/subscription/index.js";
import DB_PAYMENT_CUSTOMER from "#services/v1/database/paymentCustomer/index.js";

interface Payload {
    id: string;
    amount_total: number;
    created: number;
    currency: string;
    customer: string;
    expires_at: number;
    metadata: {
        userId: string;
        subscription: string;
        type: "MONTHLY" | "YEARLY"
    };
    subscription: string;
}
class LIB_WEBHOOK_STRIPE {
    #fastify;
    #reply;

    constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
        this.#fastify = fastifyInstance;
        this.#reply = fastifyReply;
    }

    async subscriptionCreated(event: Event.Event): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = event.data.object as Payload;

                const DB_P = new DB_PRICING(this.#fastify, this.#reply);
                const DB_PH = new DB_PAYMENT_HISTORY(this.#fastify, this.#reply);
                const DB_PC = new DB_PAYMENT_CUSTOMER(this.#fastify, this.#reply);
                const SUB = new DB_SUBSCRIPTION(this.#fastify, this.#reply);

                const sub = await DB_P.getById(payload.metadata.subscription);
                const data = {
                    AdminId: payload.metadata.userId,
                    SubscriptionId: payload.subscription,
                    Type: payload.metadata.type,
                    Name: sub.name,
                    Currency: payload.currency,
                    Customer: payload.customer,
                    Amount: payload.amount_total / 100
                }
               
                await DB_PC.save({
                    Id: payload.customer,
                    AdminId: payload.metadata.userId,
                    Provider: "STRIPE"
                })
                const subId = await DB_PH.save(data);
                await SUB.updateSubscription(payload.metadata.userId, subId);
                resolve(true)
            }
            catch (error) {
                this.#fastify.logger.error(error);
                this.#fastify.debug.error(error);
                this.#reply.DefaultResponse.statusCode = 400;
                this.#reply.DefaultResponse.error = "unable to process your payment";
                return reject(error)
            }
        });
    }

}

export default LIB_WEBHOOK_STRIPE;
