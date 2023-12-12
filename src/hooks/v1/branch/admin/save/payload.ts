"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { SaveBranchAdmin } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		firstName: string;
		lastName: string;
		email: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_firstName = request.body ? request.body.firstName : undefined as unknown as string;
			const req_lastName = request.body ? request.body.lastName : undefined as unknown as string;
			const req_email = request.body ? request.body.email : undefined as unknown as string;

			const validate = new validation(reply);

			const req_payloads: SaveBranchAdmin = {
				FirstName: req_firstName ? req_firstName.trim() : undefined as unknown as string,
				LastName: req_lastName ? req_lastName.trim() : undefined as unknown as string,
				Email: req_email ? req_email.trim() : undefined as unknown as string
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.addBranchAdmin(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
