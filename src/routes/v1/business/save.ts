import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/business/save/index.js";
import LIB_BUSINESS from "#services/v1/lib/business/index.js";
import { SaveBusiness } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/", async function (request, reply) {
		try {
			const lib = new LIB_BUSINESS(fastify, reply);

			const payload = request.PAYLOADS as SaveBusiness;

			await lib.save(request.RAW_token, payload);

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
