"use strict"

import { AUTH_Token } from "#types/global/tokens";
import { FastifyInstance, FastifyReply } from "fastify";
import moment from "moment-timezone";

class UTILS {

    #fastify;
    #reply;

    constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
        this.#fastify = fastifyInstance;
        this.#reply = fastifyReply;
    }

    hashPassword(password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const hash = await this.#fastify.bcrypt.hash(password + process.env.BCRYPT)
                resolve(hash);
            }

            catch (error) {
                this.#reply.DefaultResponse.statusCode = 500;
                this.#reply.DefaultResponse.error = "Something went wrong, most likely with your password.";
                return reject(this.#reply.DefaultResponse);
            }
        });
    }

    validatePassword(hash: string, password: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const verify = await this.#fastify.bcrypt.compare(password + process.env.BCRYPT, hash)

                if (verify) {
                    resolve(true);
                }
                else {
                    this.#reply.DefaultResponse.statusCode = 401;
                    this.#reply.DefaultResponse.error = "Invalid user or password";
                    return reject(this.#reply.DefaultResponse);
                }
            } catch (error) {
                this.#fastify.logger.error(error);
                this.#fastify.debug.error(error);
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "Unable to login you in. not you, it was us.";
                return reject(this.#reply.DefaultResponse);
            }

        });
    }

    getDayDiff(dateString: string): number {
        const now = moment();
        const nowInTimezone = moment.tz(now, process.env.TIMEZONE as string);
        const givenDate = moment.tz(dateString, "DD/MM/YYYY, hh:mm A", process.env.TIMEZONE as string);
        const days = nowInTimezone.diff(givenDate, "days");
        return days
    }

    getMinDiff(dateString: string): number {
        const now = moment();
        const nowInTimezone = moment.tz(now, process.env.TIMEZONE as string);
        const givenDate = moment.tz(dateString, "DD/MM/YYYY, hh:mm A", process.env.TIMEZONE as string);
        const mins = nowInTimezone.diff(givenDate, "minutes");
        return mins
    }

    getDeviceType(userAgent: string) {
        if (userAgent == undefined) return "unknown";

        const regexes = {
            "mobile": /mobile/i,
            "tablet": /tablet/i,
            "desktop": /windows|linux|macintosh/i
        };
        for (const [deviceType, regex] of Object.entries(regexes)) {
            if (regex.test(userAgent ?? "")) {
                return deviceType;
            }
        }
        return "unknown";
    }

    getPlatform(userAgent: string): string | null {
        const platformRegex = /\(([^)]+)\)/;
        const platformMatch = platformRegex.exec(userAgent);
        const platform = platformMatch ? platformMatch[1].split("; ")[1] : null;
        return platform;
    }

    getBrowser(userAgent: string): string {
        const browserRegex = /(Chrome|Firefox|Safari|Edge|Opera|IE)/;
        const browserMatch = browserRegex.exec(userAgent);
        const browser = browserMatch ? browserMatch[1] : "unknown";
        return browser;
    }

    UserAgentInfo(userAgent: string): Promise<{ platform: string | null, browser: string }> {
        return new Promise((resolve, reject) => {
            if (userAgent == undefined || userAgent == null) {
                this.#reply.DefaultResponse.statusCode = 400;
                this.#reply.DefaultResponse.error = "Bad request";
                return reject(this.#reply.DefaultResponse);
            }

            const platform = this.getPlatform(userAgent);

            const browser = this.getBrowser(userAgent);

            const agent = {
                platform,
                browser
            };

            if (agent.platform === null || agent.platform === undefined) {
                this.#reply.DefaultResponse.statusCode = 400;
                this.#reply.DefaultResponse.error = "Bad request";
                return reject(this.#reply.DefaultResponse);
            }

            resolve(agent)
        })

    }

    isMainAdmin(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if (token.Role === "SUPER_ADMIN") return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isAdmin(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if ((token.Role === "SUPER_ADMIN") || (token.Role === "ADMIN")) return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isAdminAndManager(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if ((token.Role === "SUPER_ADMIN") || (token.Role === "ADMIN") || (token.Role === "MANAGER")) return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isManager(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if (token.Role === "MANAGER") resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isBranchManager(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if (token.Role === "BRANCH_MANAGER") return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isBranchAdmin(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if (token.Role === "BRANCH_ADMIN_MANAGER") return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }

    isAnyAdmin(token: AUTH_Token) {
        return new Promise((resolve, reject) => {
            if ((token.Role === "SUPER_ADMIN") || (token.Role === "ADMIN") || (token.Role === "BRANCH_ADMIN_MANAGER")) return resolve(true);
            this.#reply.DefaultResponse.statusCode = 401;
            this.#reply.DefaultResponse.error = "You may not have permission to perform this action";
            return reject(this.#reply.DefaultResponse);
        })
    }
}

export default UTILS;
