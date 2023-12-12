import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/business/list/index.js";
import LIB_BRANCH from "#services/v1/lib/business/index.js";
import { ListBusiness } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.get("/", async function (request, reply) {
		try {
			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as ListBusiness;

			const business = await lib.list(request.RAW_token, payload);

			reply.DefaultResponse.data = business;

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
