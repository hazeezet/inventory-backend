"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { ChangeUserRole } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		userId: string;
		role: "ADMIN" | "MANAGER";
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_user = request.body ? request.body.userId : undefined as unknown as string;
			const req_role = request.body ? request.body.role : undefined as unknown as "ADMIN" | "MANAGER";

			const validate = new validation(reply);

			const req_payloads: ChangeUserRole = {
				User: req_user ? req_user.trim() : undefined as unknown as string,
				Role: req_role ? req_role.trim() as "ADMIN" | "MANAGER" : undefined as unknown as "ADMIN" | "MANAGER"
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.changeRole(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
