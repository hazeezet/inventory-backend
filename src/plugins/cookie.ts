"use strict"

import fp from "fastify-plugin";
import cookie from "@fastify/cookie";

export default fp(async function (fastify, _opts) {
    fastify.register(cookie, {
        secret: process.env.COOKIE_SECRET
    });
})
