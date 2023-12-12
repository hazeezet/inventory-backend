import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/user/deactivate/index.js";
import LIB_USER from "#services/v1/lib/user/index.js";
import { DeactivateUser } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/deactivate", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_USER(fastify, reply);

			const payload = request.PAYLOADS as DeactivateUser;

			await lib.deactivateUser(request.RAW_token, payload);

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
