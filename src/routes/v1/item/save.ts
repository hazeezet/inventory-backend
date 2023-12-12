import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/item/save/index.js";
import LIB_ITEM from "#services/v1/lib/item/index.js";
import { AddItem } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_ITEM(fastify, reply);

			const payload = request.PAYLOADS as AddItem;

			await lib.save(payload, request.RAW_token);


			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;