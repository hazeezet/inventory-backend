"use strict"

import fp from "fastify-plugin";

import winston, { createLogger, format, transports } from "winston";
const { combine, errors, printf, timestamp } = format;

export default fp(async function (fastify, _opts) {

    const logger = createLogger({
        level: "info",
        format: combine(
            timestamp(),
            printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
        ),
        transports: [
            new transports.File({ filename: "error.log"})
        ],
    });
	
    const debug = createLogger({
        level: "info",
        format: combine(
            errors({ stack: true }),
            timestamp(),
            printf(info => `[${info.timestamp}] :: ${info.stack}`)
        ),
        transports: [
            new transports.File({ filename: "debug.log"})
        ],
    });
	
    fastify.decorate("logger", logger);
    fastify.decorate("debug", debug);
})

declare module "fastify"{
	export interface FastifyInstance{
        /**Normal error logging */
		logger: winston.Logger;
        /**Logging with stack trace */
		debug: winston.Logger;
	}
}
