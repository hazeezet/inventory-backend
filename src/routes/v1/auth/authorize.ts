import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/auth/authenticate/index.js";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/authenticate", async function (request, reply) {
		try {
			const DB = new DB_AUTH(fastify, reply);

			const user = await DB.authenticate(request.RAW_token);

			const business = await DB.businessInfo(request.RAW_token.BusinessId);
			const branch = await DB.branchInfo(request.RAW_token.BranchId);

			request.is_authorized = true;

			reply.DefaultResponse.data = {
				businessId: user.businessId,
				branchId: user.branchId,
				businessName: business.name,
				branchName: branch.name,
				role: user.role,
				name: user.name,
				email: user.email,
				country: business.country,
				currency: business.currency
			}

			reply.send(reply.DefaultResponse);

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
