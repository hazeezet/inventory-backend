"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Verification } from "#types/payloads";

/**
 * Request body
 */
 interface requestBody extends RequestGenericInterface {
	Body: {
		code: string;
	}
	Querystring: {
		code: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async(request, reply) => {

		try
		{
			const req_code = request.body ? request.body.code : undefined as unknown as string;

			const validate = new validation(reply);
			
			const req_payloads: Verification = {
				Code: req_code ? req_code.trim() : "",
			}
			
			const payloads = await validate.verification(req_payloads);

			//since we are using post request query string is not available so setting it manually
			//because it is needed in fastify.require_mail_token();
			request.query.code = payloads.Code;

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
		
    });
})

export default HOOK_PAYLOAD;
