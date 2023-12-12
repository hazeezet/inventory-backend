import { FastifyPluginAsync } from "fastify";
import hook from "#hooks/v1/subscription/price/index.js"
import DB_PRICING from "#services/v1/database/pricing/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hook);

	fastify.get("/", async function (request, reply) {
		try {
			const DB_P = new DB_PRICING(fastify, reply);
			const price = await DB_P.get(request.RAW_token.Id);

			reply.DefaultResponse.data = price;

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
