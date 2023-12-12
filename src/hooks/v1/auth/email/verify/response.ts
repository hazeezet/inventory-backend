"use strict"

import { FastifyPluginAsync } from "fastify"; 21
import fp from "fastify-plugin";
import { EmailVerification } from "#types/email";

/**Hook after response has been sent */
const HOOK_RESPONSE: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("onResponse", async (request, reply) => {
		try {
			if (request.RAW_mail_token.Type == "VERIFICATION") {

				fastify.SEND_MAIL({
					template: "welcome",
					subject: "Welcome onboard",
					email: request.TEMP.Mail?.email as string,
					data: {
						name: request.TEMP.Mail?.name,
						subject: "Welcome onboard",
						supportMail: process.env.EMAIL_SUPPORT,
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
