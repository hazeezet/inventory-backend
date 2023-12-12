import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/item/transfer/index.js";
import LIB_ITEM from "#services/v1/lib/item/index.js";
import { Transfer } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.patch("/", async function (request, reply) {
		try {

			const lib = new LIB_ITEM(fastify, reply);

			const payload = request.PAYLOADS as Transfer;

			await lib.transfer(request.RAW_token, payload);

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;