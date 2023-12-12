import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/auth/password/set/index.js";
import LIB_USER from "#services/v1/lib/user/index.js";
import { SetPassword } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/set", async function (request, reply) {
		try {
			const lib = new LIB_USER(fastify, reply);

			const payload = request.PAYLOADS as SetPassword;

			await lib.setPassword(request.RAW_verification_token, payload);

			request.is_authorized = true;

			reply.DefaultResponse.message = "Your password has been changed successfully";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
