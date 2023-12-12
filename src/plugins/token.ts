"use strict";

import fp from "fastify-plugin";
import token from "fastify-esso";

import { AUTH_PRE_Token, AUTH_Token, MAIL_Token, VERIFICATION_Token } from "#types/global/tokens";

export default fp(async function (fastify, opts) {

    fastify.register(token({
        secret: process.env.COOKIE_SECRET as string,
        disable_headers: true,
        disable_query: true,
        header_name: "qinv_token",
        token_prefix: null as unknown as undefined,
        rename_decorators: {
            auth: "RAW_token",
            requireAuthentication: "require_auth",
            generateAuthToken: "generate_auth_token"
        }
    }));

    fastify.register(token({
        secret: process.env.COOKIE_SECRET as string,
        disable_headers: true,
        disable_query: true,
        header_name: "qinv_token",
        token_prefix: null as unknown as undefined,
        rename_decorators: {
            auth: "RAW_verification_token",
            requireAuthentication: "require_verification_token",
            generateAuthToken: "generate_verification_token"
        }
    }));

    fastify.register(token({
        secret: process.env.PRE_COOKIE_SECRET as string,
        disable_headers: true,
        header_name: "session_",
        token_prefix: null as unknown as undefined,
        rename_decorators: {
            auth: "RAW_pre_token",
            requireAuthentication: "require_pre_auth",
            generateAuthToken: "generate_auth_pre_token"
        }
    }));

    fastify.register(token({
        secret: process.env.MAIL_SECRET as string,
        disable_headers: true,
        disable_cookies: true,
        header_name: "code",
        token_prefix: null as unknown as undefined,
        rename_decorators: {
            auth: "RAW_mail_token",
            requireAuthentication: "require_mail_token",
            generateAuthToken: "generate_mail_token"
        }
    }));
});

declare module "fastify" {
    export interface FastifyInstance {
        /**Validate authentication token */
        require_auth: (arg0: FastifyInstance) => void;
        /**Validate authentication pre token */
        require_pre_auth: (arg0: FastifyInstance) => void;
        /**Validate mail token */
        require_mail_token: (arg0: FastifyInstance) => Promise<string>;
        /**Validate token, used if email is not verified */
        require_verification_token: (arg0: FastifyInstance) => Promise<string>;
        /**Generate authentication token */
        generate_auth_token: (arg0: AUTH_Token) => Promise<string>;
        /**Generate authentication pre token */
        generate_auth_pre_token: (arg0: AUTH_PRE_Token) => Promise<string>;
        /**Generate mail token */
        generate_mail_token: (arg0: MAIL_Token) => Promise<string>;
        /**Generate verification token, used when email is not verified so user can resend verification mail */
        generate_verification_token: (arg0: VERIFICATION_Token) => Promise<string>;
    }

    export interface FastifyRequest {
        /**Contain authentication raw data that was encrypted */
        RAW_pre_token: AUTH_PRE_Token;
        /**Contain authentication raw data that was encrypted */
        RAW_token: AUTH_Token;
        /**Contain mail raw data that was encrypted */
        RAW_mail_token: MAIL_Token;
        /**Contain verification raw data that was encrypted */
        RAW_verification_token: VERIFICATION_Token;
    }
}
