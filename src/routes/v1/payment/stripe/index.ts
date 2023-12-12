
import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/payment/stripe/index.js";
import LIB_PAYMENT from "#services/v1/lib/payment/stripe/index.js";
import { StripeCheckout } from "#types/payloads";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/", async function (request, reply) {
		try {
			const lib = new LIB_PAYMENT(fastify, reply);

            const payload = request.PAYLOADS as StripeCheckout;

			const session = await lib.session(request.RAW_token,payload);

			request.is_authorized = true;

			reply.DefaultResponse.data = {
				url: session.url
			}

			reply.send(reply.DefaultResponse)

		}

		catch (error) {
			reply.DefaultResponse.message = "";
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
