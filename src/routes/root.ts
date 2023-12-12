import { FastifyPluginAsync } from "fastify"

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/", async function (request, reply) {
        reply.DefaultResponse.message = "welcome"
        reply.send(reply.DefaultResponse)
    })
}

export default root;
