import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/user/role/index.js";
import LIB_BRANCH from "#services/v1/lib/user/index.js";
import { ChangeUserRole } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.patch("/role", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as ChangeUserRole;

			await lib.changeRole(request.RAW_token, payload);

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
