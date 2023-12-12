"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import DB_AUTH from "#services/v1/database/auth/index.js";

const HOOK_AUTH: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.require_auth(fastify);

	fastify.addHook("preHandler", async (request, reply) => {
		try {
			const validate = new validation(reply);
			const DB = new DB_AUTH(fastify, reply);

			const payloads = await validate.cookie(request.RAW_token);

			await DB.validateSession(payloads);
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});

})

export default HOOK_AUTH;
