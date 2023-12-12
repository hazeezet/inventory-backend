"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_REG_PAYLOAD from "./payload";
import HOOK_REG_REQUEST from "./request";
import HOOK_REG_RESPONSE from "./response";

const HOOK_LOGIN: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_REG_REQUEST);
	fastify.register(HOOK_REG_PAYLOAD);
	fastify.register(HOOK_REG_RESPONSE);
	
})

export default HOOK_LOGIN;
