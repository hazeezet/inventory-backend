"use strict"

import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import HOOK_CHANGEPASSWORD_PAYLOAD from "./payload";
import HOOK_COOKIE from "#hooks/v1/cookie.js";

const HOOK_CHANGEPASSWORD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.register(HOOK_COOKIE);
	fastify.register(HOOK_CHANGEPASSWORD_PAYLOAD);
	
	
})

export default HOOK_CHANGEPASSWORD;