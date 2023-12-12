import { FastifyPluginAsync } from "fastify"
import HOOK_REG from "#hooks/v1/auth/register/index.js";
import LIB_AUTH from "#services/v1/lib/auth/index.js";
import { Register } from "#types/payloads";


const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(HOOK_REG);

	fastify.post("/register", {
		config: {
			rateLimit: {
				max: 3,
				timeWindow: "15 minute",
				hook: "preHandler",
				keyGenerator: function (request: any) {
					return request.PAYLOADS?.Email || request.headers["x-real-ip"] as string || request.ip
				},
				errorResponseBuilder: function (_request: any, context: { max: any; after: any; ttl: any; }) {
					return {
						statusCode: 429,
						error: "Too many request",
						message: `The signup request for the email has been temporarily blocked for ${context.after}. Additional requests during this time will only reset the waiting period.`,
						data: {}
					}
				}
			}
		}
	}, async function (request, reply) {
		try {
			const lib = new LIB_AUTH(fastify, reply);

			const payload = request.PAYLOADS as Register

			await lib.register(payload, request.TEMP.UserId as string, request.TEMP.BusinessId as string);

			request.is_authorized = true;

			request.TEMP.Mail = {
				email: payload.Email,
				name: payload.FirstName
			}

			reply.DefaultResponse.message = "Registration successful";

			reply.send(reply.DefaultResponse);

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
