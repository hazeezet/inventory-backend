"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { SaveBusiness } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		name: string;
		country: string;
		currency: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_name = request.body ? request.body.name : undefined as unknown as string;
			const req_country = request.body ? request.body.country : undefined as unknown as string;
			const req_currency = request.body ? request.body.currency : undefined as unknown as string;

			const validate = new validation(reply);

			const req_payloads: SaveBusiness = {
				Name: req_name ? req_name.trim() : undefined as unknown as string,
				Country: req_country ? req_country.trim() : undefined as unknown as string,
				Currency: req_currency ? req_country.trim() : undefined as unknown as string
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.addBusiness(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
