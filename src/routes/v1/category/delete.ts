import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/category/delete/index.js";
import LIB_CATEGORY from "#services/v1/lib/category/index.js";
import { DeleteCategory } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.delete("/", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_CATEGORY(fastify, reply);

			const payload = request.PAYLOADS as DeleteCategory;

			const data = {
				id: payload.Id
			}

			await lib.delete(request.RAW_token, data);

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
