import { FastifyPluginAsync } from "fastify";


const root: FastifyPluginAsync = async (fastify): Promise<void> => {

	fastify.post("/logout", async function (request, reply) {
		try {
			reply.setCookie("qinv_token", "", {
				secure: "auto",
				httpOnly: true,
				maxAge: 1000,
				path: "/",
				signed: true,
				sameSite: "none",
				domain: process.env.DOMAIN
			});
			reply.send(reply.DefaultResponse);
		}

		catch (error) {
			reply.send(reply.DefaultResponse);
		}
	});
}

export default root;
