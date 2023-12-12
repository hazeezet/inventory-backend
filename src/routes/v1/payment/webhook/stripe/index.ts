import { FastifyPluginAsync } from "fastify"
import hooks from "#hooks/v1/payment/webhook/stripe/index.js";
import { WebHookStripe } from "#types/payloads";
import LIB_WEBHOOK_STRIPE from "#services/v1/lib/payment/webhook/stripe/index.js";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.register(hooks);

	fastify.post("/", async function (request, reply) {
		try {

			const payload = request.PAYLOADS as WebHookStripe;

			if (payload.type === "checkout.session.completed" || payload.type === "invoice.paid") {
				const lib = new LIB_WEBHOOK_STRIPE(fastify, reply)
				await lib.subscriptionCreated(payload)
				
			}else if(payload.type === "invoice.payment_failed"){
				reply.DefaultResponse.message = "unable to make payment please check transaction details and try again"
			}

			request.is_authorized = true;


			reply.send()

		}

		catch (error) {
			reply.send(reply.DefaultResponse).code(400);
		}
	});
}

export default root;