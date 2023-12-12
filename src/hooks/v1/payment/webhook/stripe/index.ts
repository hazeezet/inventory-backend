"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_PAYLOAD from "./payload";

const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {
	fastify.register(HOOK_PAYLOAD);
})

export default HOOK;