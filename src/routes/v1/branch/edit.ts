import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/branch/edit/index.js";
import LIB_BRANCH from "#services/v1/lib/branch/index.js";
import { EditBranch } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.patch("/", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as EditBranch;

			const data = {
				Id: payload.Id,
				Name: payload.Name,
				Address: payload.Address
			}

			await lib.edit(request.RAW_token, data);

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
