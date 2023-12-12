"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_LOGIN_PAYLOAD from "./payload";
import HOOK_LOGIN_REPLY from "./reply";
import HOOK_LOGIN_REQUEST from "./request";
import HOOK_LOGIN_RESPONSE from "./response";

const HOOK_LOGIN: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_LOGIN_REQUEST);
	fastify.register(HOOK_LOGIN_PAYLOAD);
	fastify.register(HOOK_LOGIN_RESPONSE);
	fastify.register(HOOK_LOGIN_REPLY);
	
})

export default HOOK_LOGIN;
