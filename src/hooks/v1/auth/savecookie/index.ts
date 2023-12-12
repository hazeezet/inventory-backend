"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_LOGIN_PAYLOAD from "./payload";
import HOOK_LOGIN_REPLY from "./reply";
import HOOK_LOGIN_REQUEST from "./request";

const HOOK_SAVE_COOKIE: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_LOGIN_PAYLOAD);
	fastify.register(HOOK_LOGIN_REPLY);
	fastify.register(HOOK_LOGIN_REQUEST);
	
})

export default HOOK_SAVE_COOKIE;
