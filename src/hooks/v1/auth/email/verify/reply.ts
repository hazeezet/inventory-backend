"use strict"

import { VERIFICATION_Token } from "#types/global/tokens";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const HOOK_REPLY: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook("onSend", async (request, reply) => {
		try {	
			if (request.is_authorized) {
				// generate verification cookie
				const token = await fastify.generate_verification_token(request.TEMP.VerificationToken as VERIFICATION_Token);
				const allowlocal = process.env.ALLOW_LOCALHOST as string;
				const regex = /^http:\/\/localhost:\d+$/;
				const host = request.headers.origin ?? "";

				if (allowlocal && regex.test(host)) {
					reply.setCookie("qinv_token", token, {
						secure: "auto",
						httpOnly: true,
						maxAge: 1000 * 60 * 30 * 1 * 1, // 30 minutes
						path: "/",
						signed: true,
						sameSite: "none",
						domain: process.env.DOMAIN
					});
				}
				else {
					reply.setCookie("qinv_token", token, {
						secure: process.env.NODE_ENV === "production",
						httpOnly: true,
						maxAge: 1000 * 60 * 30 * 1 * 1, // 30 minutes
						path: "/",
						signed: true,
						sameSite: "strict",
						domain: process.env.DOMAIN
					});
				}
			}
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}
	});
})

export default HOOK_REPLY;
