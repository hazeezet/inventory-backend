import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/auth/email/verify/index.js";
import LIB_AUTH from "#services/v1/lib/auth/index.js";
import { Role } from "#types/global/tokens";
import DB_ITEM from "#services/v1/database/item/index.js";
import DB_ITEM_HISTORY from "#services/v1/database/itemHistory/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/verify", async function (request, reply) {
		try {
			const LIB = new LIB_AUTH(fastify, reply);

			const token = request.RAW_mail_token;

			const user = await LIB.verifyCode(token);

			if ((token.Type !== "VERIFICATION") && (token.Type !== "DELETE_ITEM")) {
				//setting a token, so that the user will able to set their password
				request.TEMP.VerificationToken = {
					Id: user.id,
					BusinessId: user.businessId,
					BranchId: user.branchId,
					Role: user.role as Role
				}
				request.is_authorized = true;
			}

			if (token.Type == "VERIFICATION") {
				//send a welcome mail
				request.TEMP.Mail = {
					email: user.email,
					name: user.name
				}
			}

			if (token.Type == "DELETE_ITEM") {
				//delete the item
				const DB_I = new DB_ITEM(fastify, reply);
				const DB_H = new DB_ITEM_HISTORY(fastify, reply);
				await DB_H.delete(token.Data?.itemId as string, token.Data?.businessId as string, token.Data?.branchId as string);
				await DB_I.delete(token.Data?.itemId as string);
			}

			reply.DefaultResponse.data = {
				type: token.Type,
				email: user.email
			}
			reply.DefaultResponse.message = "success";

			reply.send(reply.DefaultResponse);

		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
