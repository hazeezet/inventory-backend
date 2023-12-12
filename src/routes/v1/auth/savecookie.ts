import { FastifyPluginAsync } from "fastify"
import HOOK_SAVE_COOKIE from "#hooks/v1/auth/savecookie/index.js";
import LIB_AUTH from "#services/v1/lib/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(HOOK_SAVE_COOKIE);

	fastify.get("/sav_co", async function (request, reply) {
		try {
			const lib = new LIB_AUTH(fastify, reply);

			const raw_token = await lib.saveCookie(request.RAW_pre_token);

			const token = await fastify.generate_auth_token(raw_token);

			reply.DefaultResponse.data = {
				token
			}

			reply.DefaultResponse.message = "Login successful";

			reply.send(reply.DefaultResponse);

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
