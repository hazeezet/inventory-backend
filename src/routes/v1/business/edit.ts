import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/business/edit/index.js";
import LIB_BRANCH from "#services/v1/lib/business/index.js";
import { EditBusiness } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.patch("/", async function (request, reply) {
		try {
			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as EditBusiness;

			const data = {
				Id: payload.Id,
				Name: payload.Name
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
