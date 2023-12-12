"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Login } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
 interface requestBody extends RequestGenericInterface {
	Body: {
		email: string;
		password: string;
	}
}

const HOOK_LOGIN_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async(request, reply) => {

		try
		{
			const req_email = request.body ? request.body.email : undefined as unknown as string;
			const req_password = request.body ? request.body.password : undefined as unknown as string;

			const validate = new validation(reply);
			
			const req_payloads: Login = {
				Password: req_password ? req_password.trim() : undefined as unknown as string,
				Email: req_email
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.login(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
		
    });
})

export default HOOK_LOGIN_PAYLOAD;
