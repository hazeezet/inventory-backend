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
					Type: "DELETE_ITEM",
					Data: {
						itemId: request.TEMP.ItemId,
						businessId: request.TEMP.BusinessId,
						branchId: request.TEMP.BranchId
					}
				})

				const link = `${process.env.CLIENT_URL}/verify?code=${token}`;
				const mail = request.TEMP.Mail
				fastify.SEND_MAIL({
					template: "delete_item",
					subject: "Confirmation of Item Deletion",
					email: mail?.email as string,
					data: {
						name: mail?.name,
						subject: "Confirmation of Item Deletion",
						supportMail: process.env.EMAIL_SUPPORT,
						item: mail?.item,
						branch: mail?.branch,
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
