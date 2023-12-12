"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { randomBytes } from "crypto";
import { AUTH_Token } from "#types/global/tokens";

const HOOK_LOGIN_REQUEST: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("preHandler", async(request, reply) => {
		
		try {
			// generate login ID
			const buf = randomBytes(6);
			const id =  buf.toString("hex").toUpperCase();
			
			request.TEMP.Token = {
				...request.TEMP.Token as AUTH_Token,
				LoginId: "QC_LG_" + id
			}

		} catch (error) {
			fastify.logger.error(error);
			fastify.debug.error(error);
			reply.DefaultResponse.statusCode = 515;
			reply.DefaultResponse.error = "Unable to log you in, not you, it was us.";
			request.error = reply.DefaultResponse;
			throw new Error();
		}
    });
})

export default HOOK_LOGIN_REQUEST;
