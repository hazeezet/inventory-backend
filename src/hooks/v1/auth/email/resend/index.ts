"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_RESPONSE from "./response";

const HOOK: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_RESPONSE);

	fastify.require_verification_token(fastify);
	
})

export default HOOK;
