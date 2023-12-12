"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Restock } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		id: string;
        available: number;
        price: number;
        batch: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_id = request.body ? request.body.id : undefined as unknown as string;
            const req_available = request.body ? request.body.available : undefined as unknown as number;
            const req_price = request.body ? request.body.price : undefined as unknown as number;
            const req_batch= request.body ? request.body.batch : undefined as unknown as string;
            

			const validate = new validation(reply);
           
			const req_payloads: Restock = {
				Id: req_id ? req_id.trim() : undefined as unknown as string,
                Available: req_available ? parseInt(req_available.toString().trim()) : undefined as unknown as number,
                Price: req_price ? parseFloat(req_price.toString().trim()) : undefined as unknown as number,
                Batch: req_batch ? req_batch.trim() : undefined as unknown as string
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.restock(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
