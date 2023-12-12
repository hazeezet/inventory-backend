"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_PAYLOAD from "./payload";
import HOOK_RESPONSE from "./response";

const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_PAYLOAD);
	fastify.register(HOOK_RESPONSE);
	
})

export default HOOK;
