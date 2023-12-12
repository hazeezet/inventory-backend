"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Adjust } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		id: string;
        quantity: number;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_id = request.body ? request.body.id : undefined as unknown as string;
            const req_quantity = request.body ? request.body.quantity : undefined as unknown as number;


			const validate = new validation(reply);
           
			const req_payloads: Adjust = {
				Id: req_id ? req_id.trim() : undefined as unknown as string,
                Quantity: req_quantity ? parseInt(req_quantity.toString().trim()) : undefined as unknown as number,
                
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.adjust(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
