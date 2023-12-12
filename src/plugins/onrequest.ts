"use strict"

import fp from "fastify-plugin";
import { DefaultResponse } from "#types/global/defaultResponse"
import { Category, ChangeUserRole, DeactivateUser, DeleteCategory, DeleteSession, EditBranch, EditCategory, ListBranchItem, ListCategory, ListItem, Login, Register, ResetPassword, SaveBranch, SaveBranchAdmin, SaveCookie, SetPassword, SwitchBranch, Verification, ChangePassword, AddItem, EditItem, Transfer } from "#types/payloads";
import { TEMP } from "#types/global/temp";
import Event from "stripe";


export default fp(async function (fastify, _opts) {
	fastify.addHook("onRequest", function (request, reply, done) {

		reply.DefaultResponse = {
			statusCode: 200,
			error: "",
			message: "success",
			data: {}
		};

		request.error = null;

		request.is_authorized = false;

		request.is_unverified = false;

		request.TEMP = temp

		request.PAYLOADS = null;

		done();
	});
})

declare module "fastify" {
	export interface FastifyRequest {
		/**Error message */
		error: null | string | DefaultResponse;
		/**True if a request was successful */
		is_authorized: boolean;
		/**false if user is verified */
		is_unverified: boolean;
		/**Contains available request payloads */
		PAYLOADS: Login | Register | Category | EditCategory | DeleteCategory | ListCategory | SwitchBranch |
		ListItem | SaveBranch | EditBranch | SaveBranchAdmin | SaveCookie | ListBranchItem | ChangeUserRole |
		DeactivateUser | DeleteSession | ChangePassword | AddItem | EditItem | Verification | ResetPassword | SetPassword |
		Transfer | Event.Event |null;
		/**Contains data that can be stored and access anywhere during the request */
		TEMP: TEMP
	}

	export interface FastifyReply {
		/** Response for all instance */
		DefaultResponse: DefaultResponse
	}
}

const temp = {
	Token: undefined,
	VerificationToken: undefined,
	PreToken: undefined
}
