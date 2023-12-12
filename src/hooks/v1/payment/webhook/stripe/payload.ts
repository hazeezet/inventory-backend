"use strict"

import { WebHookStripe } from "#types/payloads";
import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import Event from "stripe";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: Event.Event
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addContentTypeParser("application/json", {
		parseAs: "string",
		bodyLimit: 120000000
	}, async function (request: any, payload: any) {
		return payload
	})


	fastify.addHook<requestBody>("preHandler", async (request, reply) => {
		try {
			const sig = request.headers["stripe-signature"] as string;

			let event: Event.Event;

			try {
				event = fastify.STRIPE.webhooks.constructEvent(request.body as unknown as string, sig, process.env.STRIPE_WEBHOOK_KEY as string);
				request.PAYLOADS = event as WebHookStripe;
			} catch (err) {
				fastify.logger.error(err)
				fastify.debug.error(err)
				reply.code(400).send("Webhook Error");
				return;
			}
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
