"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { SwitchBranch } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		id: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_branchId = request.body ? request.body.id : undefined as unknown as string;

			const validate = new validation(reply);

			const req_payloads: SwitchBranch = {
				Id: req_branchId ? req_branchId.trim() : undefined as unknown as string
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.switchBranch(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
