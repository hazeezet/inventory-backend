import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/item/delete/index.js";
import LIB_ITEM from "#services/v1/lib/item/index.js";
import { DeleteItem } from "#types/payloads";
import DB_AUTH from "#services/v1/database/auth/index.js";
import DB_ITEM from "#services/v1/database/item/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.delete("/", async function (request, reply) {
		try {

			const DB_A = new DB_AUTH(fastify, reply);
			await DB_A.validateUseragent(request.RAW_token, request.headers["user-agent"] as string);

			const lib = new LIB_ITEM(fastify, reply);

			const payload = request.PAYLOADS as DeleteItem;

			const data = {
				id: payload.Id
			}

			await lib.delete(request.RAW_token, data);

			const business = await DB_A.businessInfo(request.RAW_token.BusinessId);
			const admin = await DB_A.adminInfo(request.RAW_token.BusinessId);
			const branch = await DB_A.branchInfo(request.RAW_token.BranchId);

			request.TEMP.BranchId = request.RAW_token.BranchId;
			request.TEMP.BusinessId = request.RAW_token.BusinessId;
			request.TEMP.ItemId = payload.Id;

			const DB_I = new DB_ITEM(fastify, reply);
			const item = await DB_I.getById(request.RAW_token.BusinessId, request.RAW_token.BranchId, payload.Id);

			request.TEMP.Mail = {
				email: admin.admin.email,
				name: admin.admin.name,
				business: business.name,
				branch: branch.name,
				item: item.name
			}
			request.is_authorized = true;
			reply.DefaultResponse.message = "your request has been sent successfully";

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;