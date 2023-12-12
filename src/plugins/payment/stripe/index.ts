"use strict"

import Stripe from "stripe"
import fp from "fastify-plugin";

export default fp(async function (fastify, _opts) {
    const secretKey = process.env.STRIPE_SECRET_KEY as string
    //const priceId1 = process.env.BASIC_PRICE_ID as string
    //const priceId2 = process.env.PRO_PRICE_ID as string
    
    const stripe = new Stripe(secretKey, {
    
        apiVersion: "2023-08-16",
        typescript: true,
        maxNetworkRetries: 5
    });
    
    fastify.decorate("STRIPE", stripe);
});

declare module "fastify" {
    export interface FastifyInstance {
        /**Stripe */
        STRIPE: Stripe
    }
}
