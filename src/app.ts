import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { DefaultResponse } from "#types/global/defaultResponse";

export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Load env only in development
if (process.env.NODE_ENV != "production") {
    const dot = import("dotenv");
    dot.then((env) => {
        env.config();
    })
}


const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {

    fastify.setNotFoundHandler(function (request, reply) {
        reply.DefaultResponse.statusCode = 404;
        reply.DefaultResponse.error = "The api route could not be found";
        reply.send(reply.DefaultResponse)
    })

    fastify.setErrorHandler(function (error, request, reply) {
        const res = request.error as DefaultResponse;
        res.message = "";
        // When there is a custom error in any hook
        if (request.error) return reply.send(res);

        // If there is uncatch error then status code is 500 else it is fastify error
        reply.DefaultResponse.statusCode = error.statusCode || 500;

        const message = reply.DefaultResponse.statusCode == 500 ? "Internal server error" : error.message.split(":", 1)[0] ?? error.message;

        reply.DefaultResponse.error = message;

        reply.send(reply.DefaultResponse);

        if (message.toLocaleUpperCase() !== "UNAUTHORIZED" && message.toLocaleUpperCase() !== "FORBIDDEN" && error.statusCode !== 429) {
            fastify.logger.error(error);
            fastify.debug.error(error);
        }
    })

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: join(__dirname, "plugins"),
        ignorePattern: /.*.d.ts/,
        options: Object.assign({}, opts)
    })

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
        options: Object.assign({}, opts)
    });

}

export default app;
export { app }
