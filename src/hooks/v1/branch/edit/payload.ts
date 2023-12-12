"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { EditBranch } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		id: string;
		name: string;
		address: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_id = request.body ? request.body.id : undefined as unknown as string;
			const req_name = request.body ? request.body.name : undefined as unknown as string;
			const req_address = request.body ? request.body.address : undefined as unknown as string;

			const validate = new validation(reply);

			const req_payloads: EditBranch = {
				Id: req_id ? req_id.trim() : undefined as unknown as string,
				Name: req_name ? req_name.trim() : undefined as unknown as string,
				Address: req_address ? req_address.trim() : undefined as unknown as string
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.editBranch(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
