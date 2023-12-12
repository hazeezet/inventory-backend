import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/business/switch/index.js";
import LIB_BRANCH from "#services/v1/lib/business/index.js";
import { SwitchBusiness } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/switch", async function (request, reply) {
		try {
			const lib = new LIB_BRANCH(fastify, reply);

			const payload = request.PAYLOADS as SwitchBusiness;

			const branchId = await lib.switch(request.RAW_token, payload);

			request.is_authorized = true;

			request.TEMP.BranchId = branchId;

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
