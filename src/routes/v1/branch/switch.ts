import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/branch/switch/index.js";
import LIB_BRANCH from "#services/v1/lib/branch/index.js";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { SwitchBranch } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/switch", async function (request, reply) {
		try {
			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as SwitchBranch;

			await lib.switch(request.RAW_token, payload);

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
