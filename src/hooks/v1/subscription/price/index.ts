"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_COOKIE from "#hooks/v1/cookie.js";

const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_COOKIE);
})

export default HOOK;
