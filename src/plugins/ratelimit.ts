import fp from "fastify-plugin";
import ratelimit from "@fastify/rate-limit";
import Redis from "ioredis";

const redis = new Redis({
    connectionName: 'rate-limit',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 500,
    db: process.env.REDIS_DB_INDEX as unknown as number ?? 0,
    maxRetriesPerRequest: null
})

export default fp(async (fastify) => {
    fastify.register(ratelimit, {
        global: false,
        max: 10,
        timeWindow: '1 minute',
        redis,
        addHeadersOnExceeding: { // default show all the response headers when rate limit is not reached
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': false,
            'x-ratelimit-reset': false
        },
        addHeaders: { // default show all the response headers when rate limit is reached
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': false,
            'x-ratelimit-reset': false,
            'retry-after': false
        }
    })
})
