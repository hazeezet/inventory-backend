"use strict"

import { FastifyInstance } from "fastify";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { EmailVerification } from "#types/email";

class EMAIL_TEMPLATE {

    #fastify;
    #path;

    constructor(fastifyInstance: FastifyInstance) {
        this.#fastify = fastifyInstance;
        this.#path = path.join(path.resolve(__dirname), "templates")
    }

    verification(replacements: EmailVerification): string | null {
        try {
            const filePath = path.join(this.#path, "verification.html");
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = handlebars.compile(source);
            return template(replacements);
        } catch (error) {
            this.#fastify.logger.error(error);
            this.#fastify.debug.error(error);
            return null
        }
    }

    branch_admin_verification(replacements: EmailVerification): string | null {
        try {
            const filePath = path.join(this.#path, "branch_admin_verification.html");
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = handlebars.compile(source);
            return template(replacements);
        } catch (error) {
            this.#fastify.logger.error(error);
            this.#fastify.debug.error(error);
            return null
        }
    }

    reset_password(replacements: EmailVerification): string | null {
        try {
            const filePath = path.join(this.#path, "reset_password.html");
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = handlebars.compile(source);
            return template(replacements);
        } catch (error) {
            this.#fastify.logger.error(error);
            this.#fastify.debug.error(error);
            return null
        }
    }

    welcome(replacements: EmailVerification): string | null {
        try {
            const filePath = path.join(this.#path, "welcome.html");
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = handlebars.compile(source);
            return template(replacements);
        } catch (error) {
            this.#fastify.logger.error(error);
            this.#fastify.debug.error(error);
            return null
        }
    }

    delete_item(replacements: EmailVerification): string | null {
        try {
            const filePath = path.join(this.#path, "delete_item.html");
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = handlebars.compile(source);
            return template(replacements);
        } catch (error) {
            this.#fastify.logger.error(error);
            this.#fastify.debug.error(error);
            return null
        }
    }
}

export default EMAIL_TEMPLATE;
