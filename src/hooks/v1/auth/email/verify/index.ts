"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import HOOK_PAYLOAD from "./payload";
import HOOK_REPLY from "./reply";
import HOOK_RESPONSE from "./response";


const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {
	fastify.register(HOOK_PAYLOAD);
	fastify.register(HOOK_REPLY);
	fastify.register(HOOK_RESPONSE);

	fastify.require_mail_token(fastify);

	fastify.addHook("preHandler", async (request, reply) => {

		try {
			const validate = new validation(reply);

			// Validate payload
			await validate.verifyCode(request.RAW_mail_token);

		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});

})

export default HOOK;
