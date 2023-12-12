import { AUTH_Token } from "#types/global/tokens";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { FastifyInstance, FastifyReply } from "fastify";
import Stripe from "stripe";
import { StripeCheckout } from "#types/payloads";
import DB_PRICING from "#services/v1/database/pricing/index.js";
import UTILS from "#services/utils/index.js";
import DB_PAYMENT_CUSTOMER from "#services/v1/database/paymentCustomer/index.js";


class LIB_PAYMENT {
    #fastify;
    #reply;

    constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
        this.#fastify = fastifyInstance;
        this.#reply = fastifyReply;
    }

    async session(token: AUTH_Token, payload: StripeCheckout): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        return new Promise(async (resolve, reject) => {
            try {
                const DB_A = new DB_AUTH(this.#fastify, this.#reply);
                const DB_P = new DB_PRICING(this.#fastify, this.#reply);
                const util = new UTILS(this.#fastify, this.#reply);
                const DB_PC = new DB_PAYMENT_CUSTOMER(this.#fastify, this.#reply);

                await util.isMainAdmin(token)

                const DB_A_result = await DB_A.getUser(token.Id);
                const DB_P_result = await DB_P.getById(payload.Id);

                const prices = await this.#fastify.STRIPE.prices.search({
                    query: `metadata["name"]:"${DB_P_result.name}"`
                })

                let priceId = "";

                for (const price of prices.data) {
                    if (price.recurring && price.recurring.interval === payload.Interval) {
                        priceId = price.id;
                        break;
                    }
                }

                const currentDate = new Date();
                const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
                const futureUnixTimestamp = unixTimestamp + 1800; //30 minutes

                const customer = await DB_PC.get(token.Id);
                const session = await this.#fastify.STRIPE.checkout.sessions.create({
                    mode: 'subscription',
                    metadata: {
                        userId: token.Id,
                        subscription: payload.Id,
                        type: payload.Interval == "month" ? "MONTHLY" : "YEARLY"
                    },
                    customer: customer ? customer.id : undefined, //using old customer if it exist
                    customer_email: customer ? undefined : DB_A_result?.email, //create new one if it does not exist
                    expires_at: futureUnixTimestamp, //30 minutes
                    line_items: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],

                    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.CLIENT_URL}/v1/canceled`,
                });

                resolve(session)

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


export default LIB_PAYMENT;