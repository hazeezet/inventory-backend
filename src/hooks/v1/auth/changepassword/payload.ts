"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { ChangePassword } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
 interface requestBody extends RequestGenericInterface {
	Body: {
		oldPassword: string;
		newPassword: string;
	}
}

const HOOK_CHANGEPASSWORD_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async(request, reply) => {

		try
		{
			const req_oldPassword = request.body ? request.body.oldPassword : undefined as unknown as string;
			const req_newPassword = request.body ? request.body.newPassword : undefined as unknown as string;

			const validate = new validation(reply);
			
			const req_payloads: ChangePassword= {
				OldPassword: req_oldPassword ? req_oldPassword.trim() : undefined as unknown as string,
				NewPassword: req_newPassword ? req_newPassword.trim() : undefined as unknown as string,
			}

			const utils = new UTILS(fastify, reply);
            
			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.changePassword(req_payloads);
            
			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
		
    });
})

export default HOOK_CHANGEPASSWORD_PAYLOAD;
