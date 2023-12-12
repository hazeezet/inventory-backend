"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import HOOK_PAYLOAD from "./payload";

const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_PAYLOAD);
	fastify.require_verification_token(fastify);

	fastify.addHook("preHandler", async (request, reply) => {
		try {
			const validate = new validation(reply);

			await validate.verificationToken(request.RAW_verification_token);
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});
	
})

export default HOOK;
