"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import moment from "moment-timezone";

const HOOK_LOGIN_REQUEST: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.require_pre_auth(fastify);

	fastify.addHook("preHandler", async (request, reply) => {

		try {
			const pretoken = request.RAW_pre_token;
			const now = moment();
			const nowInTimezone = moment.tz(now, process.env.TIMEZONE as string);
			const givenDate = moment.tz(pretoken.Date, "DD/MM/YYYY, hh:mm A", process.env.TIMEZONE as string);
			const mins = nowInTimezone.diff(givenDate, "minutes");

			if(mins > 1){
				reply.DefaultResponse.error = "unauthorized";
				reply.DefaultResponse.statusCode = 400;
				throw new Error();
			}
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});
})

export default HOOK_LOGIN_REQUEST;
