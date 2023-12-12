"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { Register } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
 interface requestBody extends RequestGenericInterface {
	Body: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		businessname: string;
		country: string;
		currency: string;
	}
}

const HOOK_LOGIN_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async(request, reply) => {

		try
		{
			const req_email = request.body ? request.body.email : undefined as unknown as string;
			const req_password = request.body ? request.body.password : undefined as unknown as string;
			const req_firstName = request.body ? request.body.firstName : undefined as unknown as string;
			const req_lastName = request.body ? request.body.lastName : undefined as unknown as string;
			const req_businessname = request.body ? request.body.businessname : undefined as unknown as string;
			const req_country = request.body ? request.body.country : undefined as unknown as string;
			const req_currency = request.body ? request.body.currency : undefined as unknown as string;

			const validate = new validation(reply);
			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);
			
			const req_payloads: Register = {
				Password: req_password ? req_password.trim() : undefined as unknown as string,
				Email: req_email,
				FirstName: req_firstName ? req_firstName.trim() : undefined as unknown as string,
				LastName: req_lastName ? req_lastName.trim() : undefined as unknown as string,
				BusinessName: req_businessname ? req_businessname.trim() : undefined as unknown as string,
				Country: req_country ? req_country.trim() : undefined as unknown as string,
				Currency: req_currency ? req_currency.trim() : undefined as unknown as string
			}
			const payloads = await validate.register(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			if(reply.DefaultResponse.statusCode == 200){
				reply.DefaultResponse.error = "Internal server error";
				reply.DefaultResponse.statusCode = 500;
				fastify.logger.error(error);
				fastify.debug.error(error);
			}
			request.error = reply.DefaultResponse;
			throw new Error();
		}
		
    });
})

export default HOOK_LOGIN_PAYLOAD;
