"use strict"

import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async function (fastify, opts) {
    const clientUrl = process.env.CLIENT_URL as string;
    const localhost = process.env.ALLOW_LOCALHOST as string;
    fastify.register(cors, {
        methods: ["GET", "POST", "PATCH", "DELETE"],
        origin: localhost ? [clientUrl, localhost] : [clientUrl],
        optionsSuccessStatus: 200,
        credentials: true
    });
})
