import { AUTH_PRE_Token, Role } from "#types/global/tokens";
import { FastifyPluginAsync } from "fastify"
import HOOK_LOGIN from "#hooks/v1/auth/login/index.js";
import LIB_AUTH from "#services/v1/lib/auth/index.js";
import { AUTH_Token } from "#types/global/tokens";
import { Login } from "#types/payloads";
import moment from "moment-timezone";


const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(HOOK_LOGIN);

	fastify.post("/login", {
		config: {
			rateLimit: {
				max: 5,
				timeWindow: "30 minute",
				hook: "preHandler",
				keyGenerator: function (request: any) {
					return request.PAYLOADS?.Email || request.headers["x-real-ip"] as string || request.ip
				},
				onExceeded: function (request: any, key: any) {
					//TODO
					//send a security mail, someone is trying to login too many times
				},
				errorResponseBuilder: function (request: any, context: { max: any; after: any; ttl: any; }) {
					return {
						statusCode: 429,
						error: "Too many request",
						message: `The login request for the email has been temporarily blocked for ${context.after}. Additional requests during this time will only reset the waiting period.`,
						data: {}
					}
				}
			}
		}
	}, async function (request, reply) {
		try {
			const lib = new LIB_AUTH(fastify, reply);

			const payload = request.PAYLOADS as Login

			const { raw_token, verified } = await lib.login(payload, request.TEMP.Token as AUTH_Token);

			if (verified) {
				request.TEMP.Token = raw_token;

				request.is_authorized = true;

				const pretoken_v: AUTH_PRE_Token = {
					Email: payload.Email,
					LoginId: raw_token.LoginId,
					Date: moment().tz(process.env.TIMEZONE as string).format("DD/MM/YYYY, hh:mm A")
				}

				const pretoken = await fastify.generate_auth_pre_token(pretoken_v);

				reply.DefaultResponse.data = {
					token: pretoken
				};

				reply.send(reply.DefaultResponse)
			}

			else {
				//needed so user can resend verification email
				request.TEMP.VerificationToken = {
					Id: raw_token.Id,
					BusinessId: raw_token.BusinessId,
					BranchId: raw_token.BranchId,
					Role: raw_token.Role as Role
				}

				request.is_unverified = true;

				reply.DefaultResponse.statusCode = 400;
				reply.DefaultResponse.error = "verify your account to continue";
				reply.send(reply.DefaultResponse)
			}

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
