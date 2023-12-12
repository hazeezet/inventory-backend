"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { randomBytes } from "crypto";

const HOOK_LOGIN_REQUEST: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("preHandler", async (request, reply) => {

		try {
			// generate User ID
			const buf = randomBytes(7);
			const bufb = randomBytes(6);
			const id = buf.toString("hex").toUpperCase();
			const bid = bufb.toString("hex").toUpperCase();

			request.TEMP.UserId = id;
			request.TEMP.BusinessId = bid;

		} catch (error) {
			fastify.logger.error(error);
			fastify.debug.error(error);
			reply.DefaultResponse.statusCode = 515;
			reply.DefaultResponse.error = "Unable to register your account, not you, it was us.";
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});
})

export default HOOK_LOGIN_REQUEST;
