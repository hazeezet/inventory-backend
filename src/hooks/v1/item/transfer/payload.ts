"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Transfer } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		branch: string;
		item: string;
		quantity: number;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_branch = request.body ? request.body.branch : undefined as unknown as string;
			const req_item = request.body ? request.body.item : undefined as unknown as string;
			const req_quantity = request.body ? request.body.quantity : undefined as unknown as number;


			const validate = new validation(reply);

			const req_payloads: Transfer = {
				Branch: req_branch ? req_branch.trim() : undefined as unknown as string,
				Item: req_item ? req_item.trim() : undefined as unknown as string,
				Quantity: req_quantity ? parseFloat(req_quantity.toString().trim()) : undefined as unknown as number,
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.transfer(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
