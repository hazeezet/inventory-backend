"use strict"

import fp from "fastify-plugin";
import bcrypt from "fastify-bcrypt";

export default fp(async function (fastify, opts) {
    fastify.register(bcrypt, {
        saltWorkFactor: 12
    });
})
