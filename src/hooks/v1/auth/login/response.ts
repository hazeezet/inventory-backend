"use strict"

import { FastifyPluginAsync } from "fastify"; 21
import fp from "fastify-plugin";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { AUTH_Token } from "#types/global/tokens";

/**Hook after response has been sent */
const HOOK_LOGIN_RESPONSE: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("onResponse", async (request, reply) => {
		try {
			if (request.is_authorized) {
				const ip = request.headers["x-real-ip"] as string ?? request.ip;
				const DB = new DB_AUTH(fastify, reply);
				await DB.storeLoginID(request.TEMP.Token as AUTH_Token, ip, request.headers["user-agent"] as string);
			}
		}
		catch (error) {
			fastify.logger.error(error);
			fastify.debug.error(error);
		}
	});
})

export default HOOK_LOGIN_RESPONSE;
