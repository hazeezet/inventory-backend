import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/user/invite/index.js";
import LIB_USER from "#services/v1/lib/branch/admin/index.js";
import { ResendInvite } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_USER(fastify, reply);

			const payload = request.PAYLOADS as ResendInvite;

			const user = await lib.resendInvite(request.RAW_token, payload);

			const business = await DB_A.businessInfo(request.RAW_token.BusinessId);
			const branch = await DB_A.branchInfo(request.RAW_token.BranchId);

			request.TEMP.Mail = {
				email: user.email,
				name: user.name,
				business: business.name,
				branch: branch.name
			}

			request.is_authorized = true;

			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
