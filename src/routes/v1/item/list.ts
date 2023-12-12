import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/item/list/index.js";
import LIB_ITEM from "#services/v1/lib/item/index.js";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { ListItem } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.get("/", async function (request, reply) {
		try
		{
			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);
			
			const lib = new LIB_ITEM(fastify, reply);

			const payload = request.PAYLOADS as ListItem;

			const branches = await lib.list(request.RAW_token, payload);

			reply.DefaultResponse.data = branches;

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}
		
		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
