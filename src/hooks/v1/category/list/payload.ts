"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { ListCategory } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Querystring: {
		limit: string;
		page: string;
		s: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_limit = request.query.limit ? request.query.limit !== "" ? request.query.limit : "10" : "10";
			const req_page = request.query.page ? request.query.page !== "" ? request.query.page : "1" : "1";
			const req_search = request.query.s ?? "";

			const validate = new validation(reply);

			const req_payloads: ListCategory = {
				Limit: parseInt(req_limit),
				Page: parseInt(req_page),
				Search: req_search
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.listCategory(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
