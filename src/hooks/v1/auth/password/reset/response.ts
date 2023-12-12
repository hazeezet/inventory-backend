"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { EmailVerification } from "#types/email";
import moment from "moment-timezone";

/**Hook after response has been sent */
const HOOK_RESPONSE: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("onResponse", async (request, reply) => {
		try {
			if (request.is_authorized) {

				const token = await fastify.generate_mail_token({
					Email: request.TEMP.Mail?.email as string,
					Date: moment().tz(process.env.TIMEZONE as string).format("DD/MM/YYYY, hh:mm A"),
					Type: "RESET_PASSWORD"
				})

				const link = `${process.env.CLIENT_URL}/verify?code=${token}`;

				fastify.SEND_MAIL({
					template: "reset_password",
					subject: "Reset password",
					email: request.TEMP.Mail?.email as string,
					data: {
						name: request.TEMP.Mail?.name,
						subject: "Reset password",
						supportMail: process.env.EMAIL_SUPPORT,
						link,
						logo: ""
					} as EmailVerification
				})
			}
		}
		catch (error) {
			fastify.logger.error(error);
			fastify.debug.error(error);
		}
	});
})

export default HOOK_RESPONSE;
