"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { SaveCookie } from "#types/payloads";

/**
 * Request body
 */
 interface requestBody extends RequestGenericInterface {
	Querystring: {
		session_: string;
	}
}

const HOOK_LOGIN_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async(request, reply) => {

		try
		{
			const req_savecookie = request.query ? request.query.session_ : undefined as unknown as string;

			const validate = new validation(reply);
			
			const req_payloads: SaveCookie = {
				SavCo: req_savecookie
			}
			const payloads = await validate.preToken(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
		
    });
})

export default HOOK_LOGIN_PAYLOAD;
