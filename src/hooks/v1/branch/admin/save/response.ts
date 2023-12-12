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
					Type: "INVITATION"
				})

				const link = `${process.env.CLIENT_URL}/verify?code=${token}`;
				const mail = request.TEMP.Mail
				fastify.SEND_MAIL({
					template: "branch_admin_verification",
					subject: "Verify your account",
					email: mail?.email as string,
					data: {
						name: request.TEMP.Mail?.name,
						subject: "Verify your acount",
						supportMail: process.env.EMAIL_SUPPORT,
						link,
						logo: "",
						business: mail?.business,
						branch: mail?.branch
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
