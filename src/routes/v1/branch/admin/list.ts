import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/branch/admin/list/index.js";
import LIB_USER from "#services/v1/lib/branch/admin/index.js";
import DB_AUTH from "#services/v1/database/auth/index.js";
import { ListBranchUser } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.get("/", async function (request, reply) {
		try
		{
			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);
			
			const lib = new LIB_USER(fastify, reply);

			const payload = request.PAYLOADS as ListBranchUser;

			const branches = await lib.listBranch(request.RAW_token, payload);

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
