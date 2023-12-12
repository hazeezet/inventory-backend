"use strict"

import { AUTH_Token } from "#types/global/tokens";
import { FastifyInstance, FastifyReply } from "fastify";

class DB_SUBSCRIPTION {

    #fastify;
    #reply;

    constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
        this.#fastify = fastifyInstance;
        this.#reply = fastifyReply;
    }

    canAddCategory(token: AUTH_Token) {
        return new Promise(async (resolve, reject) => {
            const category = await this.#fastify.DB.SQL.Category.count({
                where: { businessId: token.BusinessId }
            })
            const result = await this.#fastify.DB.SQL.Admin.findOne({
                where: { businessId: token.BusinessId },
                attributes: ["subscription"],
                include: [
                    {
                        model: this.#fastify.DB.SQL.PaymentHistory,
                        attributes: ["name"],
                        as: "payment",
                        include: [
                            {
                                model: this.#fastify.DB.SQL.Pricing,
                                attributes: ["category"],
                                as: "pricing"
                            },
                        ]
                    },
                ],
            })
            if (result == null) {
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "unable to validate your request, please login again";
                return reject(this.#reply.DefaultResponse);
            }

            if (result.payment && result.payment.pricing?.category == 0) return resolve(true);

            if (!result.payment || (result.payment.pricing?.category as number <= category)) {
                this.#reply.DefaultResponse.statusCode = 429;
                this.#reply.DefaultResponse.error = "You have reached the maximum limit of categories that can be created. Please consider upgrading your account for additional capacity.";
                return reject(this.#reply.DefaultResponse);
            }
            return resolve(true);
        })
    }

    canAddItem(token: AUTH_Token) {
        return new Promise(async (resolve, reject) => {
            const item = await this.#fastify.DB.SQL.Item.count({
                where: { businessId: token.BusinessId }
            })
            const result = await this.#fastify.DB.SQL.Admin.findOne({
                where: { businessId: token.BusinessId },
                attributes: ["subscription"],
                include: [
                    {
                        model: this.#fastify.DB.SQL.PaymentHistory,
                        attributes: ["name"],
                        as: "payment",
                        include: [
                            {
                                model: this.#fastify.DB.SQL.Pricing,
                                attributes: ["item"],
                                as: "pricing"
                            },
                        ]
                    },
                ],
            })
            if (result == null) {
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "unable to validate your request, please login again";
                return reject(this.#reply.DefaultResponse);
            }

            if (result.payment && result.payment.pricing?.item == 0) return resolve(true);

            if (!result.payment || (result.payment.pricing?.item as number <= item)) {
                this.#reply.DefaultResponse.statusCode = 429;
                this.#reply.DefaultResponse.error = "You have reached the maximum limit of items that can be created. Please consider upgrading your account for additional capacity.";
                return reject(this.#reply.DefaultResponse);
            }
            return resolve(true);
        })
    }

    canAddBranch(token: AUTH_Token) {
        return new Promise(async (resolve, reject) => {
            const branch = await this.#fastify.DB.SQL.Branch.count({
                where: { businessId: token.BusinessId }
            })
            const result = await this.#fastify.DB.SQL.Admin.findOne({
                where: { businessId: token.BusinessId },
                attributes: ["subscription"],
                include: [
                    {
                        model: this.#fastify.DB.SQL.PaymentHistory,
                        attributes: ["name"],
                        as: "payment",
                        include: [
                            {
                                model: this.#fastify.DB.SQL.Pricing,
                                attributes: ["branch"],
                                as: "pricing"
                            },
                        ]
                    },
                ],
            })
            if (result == null) {
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "unable to validate your request, please login again";
                return reject(this.#reply.DefaultResponse);
            }

            if (result.payment && result.payment.pricing?.branch == 0) return resolve(true);

            if (!result.payment || (result.payment.pricing?.branch as number <= branch)) {
                this.#reply.DefaultResponse.statusCode = 429;
                this.#reply.DefaultResponse.error = "You have reached the maximum limit of branches that can be created. Please consider upgrading your account for additional capacity.";
                return reject(this.#reply.DefaultResponse);
            }
            return resolve(true);
        })
    }

    canAddUser(token: AUTH_Token) {
        return new Promise(async (resolve, reject) => {
            const user = await this.#fastify.DB.SQL.User.count({
                where: { businessId: token.BusinessId }
            })
            const result = await this.#fastify.DB.SQL.Admin.findOne({
                where: { businessId: token.BusinessId },
                attributes: ["subscription"],
                include: [
                    {
                        model: this.#fastify.DB.SQL.PaymentHistory,
                        attributes: ["name"],
                        as: "payment",
                        include: [
                            {
                                model: this.#fastify.DB.SQL.Pricing,
                                attributes: ["user"],
                                as: "pricing"
                            },
                        ],
                    },
                ],
            })
            if (result == null) {
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "unable to validate your request, please login again";
                return reject(this.#reply.DefaultResponse);
            }

            if (result.payment && result.payment.pricing?.user == 0) return resolve(true);

            if (!result.payment || (result.payment.pricing?.user as number <= user)) {
                this.#reply.DefaultResponse.statusCode = 429;
                this.#reply.DefaultResponse.error = "You have reached the maximum limit of users that can be created. Please consider upgrading your account for additional capacity.";
                return reject(this.#reply.DefaultResponse);
            }
            return resolve(true);
        })
    }

    canAddBusiness(token: AUTH_Token) {
        return new Promise(async (resolve, reject) => {

            const result = await this.#fastify.DB.SQL.Admin.findOne({
                where: { businessId: token.BusinessId },
                attributes: ["subscription", "id"],
                include: [
                    {
                        model: this.#fastify.DB.SQL.PaymentHistory,
                        attributes: ["name"],
                        as: "payment",
                        include: [
                            {
                                model: this.#fastify.DB.SQL.Pricing,
                                attributes: ["business"],
                                as: "pricing"
                            },
                        ]
                    },
                ],
            })

            if (result == null) {
                this.#reply.DefaultResponse.statusCode = 401;
                this.#reply.DefaultResponse.error = "unable to validate your request, please login again";
                return reject(this.#reply.DefaultResponse);
            }

            const business = await this.#fastify.DB.SQL.Business.count({
                where: { adminId: result.id }
            })

            if (result.payment && result.payment.pricing?.business == 0) return resolve(true);

            if (!result.payment || (result.payment.pricing?.business as number <= business)) {
                this.#reply.DefaultResponse.statusCode = 429;
                this.#reply.DefaultResponse.error = "You have reached the maximum limit of businesses that can be created. Please consider upgrading your account for additional capacity.";
                return reject(this.#reply.DefaultResponse);
            }
            return resolve(true);
        })
    }

    updateSubscription(adminId: string, id: string) {
        return new Promise(async (resolve, reject) => {

            await this.#fastify.DB.SQL.Admin.update({
                subscription: id
            }, {
                where: { id: adminId },
            })

            return resolve(true);
        })
    }
}

export default DB_SUBSCRIPTION;
