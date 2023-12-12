import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/auth/email/resend/index.js";
import LIB_USER from "#services/v1/lib/user/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/resend", {
		config: {
			rateLimit: {
				max: 3,
				timeWindow: "30 minute",
				hook: "preHandler",
				keyGenerator: function (request: any) {
					return request.PAYLOADS?.Email || request.headers["x-real-ip"] as string || request.ip
				},
				errorResponseBuilder: function (request: any, context: { max: any; after: any; ttl: any; }) {
					return {
						statusCode: 429,
						error: "Too many request",
						message: `Resending of verification mail has been blocked for ${context.after}. Additional requests during this time will only reset the waiting period.`,
						data: {}
					}
				}
			}
		}
	}, async function (request, reply) {
		try {
			const lib = new LIB_USER(fastify, reply);

			const user = await lib.resendVerificationMail(request.RAW_verification_token);

			request.TEMP.Mail = user

			request.is_authorized = true;

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
