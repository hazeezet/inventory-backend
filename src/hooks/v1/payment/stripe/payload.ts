"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { StripeCheckout } from "#types/payloads";
import UTILS from "#services/utils/index.js";

type Interval = "year" | "month";
/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		priceId: string;
		interval: Interval;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_id = request.body ? request.body.priceId : undefined as unknown as string;
			const req_interval = request.body ? request.body.interval : undefined as unknown as string;

			const validate = new validation(reply);

			const req_payloads: StripeCheckout = {
				Id: req_id ? req_id.trim() : undefined as unknown as string,
				Interval: req_interval ? req_interval.trim() as Interval : undefined as unknown as Interval
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.stripeCheckout(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
