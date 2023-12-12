"use strict";

import { DECORATE_DATABASE } from "#types/database";
import fp from "fastify-plugin";

export default fp(async function (fastify, _opts) {

	fastify.decorate("DB", database);
});

declare module "fastify" {
	export interface FastifyInstance {
		/**Database */
		DB: DECORATE_DATABASE
	}
}

const database = {
	SQL: {
        Instance: null,
        User: null,
        Session: null
    }
}
