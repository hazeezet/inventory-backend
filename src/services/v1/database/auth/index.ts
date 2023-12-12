"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { AUTH_Token } from "#types/global/tokens";
import UTILS from "#services/utils/index.js";
import { AdminsModel, BranchesModel, BusinessModel, UsersModel } from "#db/mysql/types";
import { Register } from "#types/payloads";
import { randomBytes } from "crypto";


type VerifiedType = {
	businessId: string,
	branchId: string,
	id: string
}

/**
 * Authorization database instance
 */
type PasswordData = {
	hashPassword: string;
	businessId: string;
	branchId: string;

}
class DB_AUTH {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	/**
	 * validate the user login id
	 */
	async validateSession(payload: AUTH_Token): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const utils = new UTILS(this.#fastify, this.#reply);

				const [admin, user] = await Promise.all([
					this.#fastify.DB.SQL.Admin.findOne({
						attributes: ["email"],
						where: { id: payload.Id.trim() }
					}),
					this.#fastify.DB.SQL.User.findOne({
						attributes: ["email", "status"],
						where: { id: payload.Id.trim() }
					})
				]);

				if (admin === null && user === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				if (user?.status == "DISABLED") {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				const result = await this.#fastify.DB.SQL.Session.findOne({
					attributes: ["userId", "lastActive"],
					where: { id: payload.LoginId }
				});

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				const days = utils.getDayDiff(result.lastActive);

				if (days >= 3) {
					await this.#fastify.DB.SQL.Session.destroy({ where: { id: payload.LoginId, userId: payload.Id } })
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(true);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	/**validate the user agent, if it has changed unauthorized the user */
	async validateUseragent(payload: AUTH_Token, userAgent: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const utils = new UTILS(this.#fastify, this.#reply);

				const browser = utils.getBrowser(userAgent);
				const platform = utils.getPlatform(userAgent);
				const type = utils.getDeviceType(userAgent);

				const result = await this.#fastify.DB.SQL.Session.findOne({
					attributes: ["userId", "lastActive", "deviceType", "platform", "browser"],
					where: { id: payload.LoginId }
				});

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				if ((platform !== result.platform) || (browser !== result.browser) || (type !== result.deviceType)) {
					await this.#fastify.DB.SQL.Session.destroy({ where: { id: payload.LoginId, userId: payload.Id } })
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(true);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async storeLoginID(payload: AUTH_Token, ip: string, userAgent: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const util = new UTILS(this.#fastify, this.#reply);

				const { platform, browser } = await util.UserAgentInfo(userAgent);
				const type = util.getDeviceType(userAgent);

				const find = await this.#fastify.DB.SQL.Session.findOne({
					where: { deviceType: type, platform: platform as string, browser, userId: payload.Id }
				})

				if (find == null) {
					await this.#fastify.DB.SQL.Session.create({
						userId: payload.Id,
						lastActive: new Date(),
						ip: ip,
						deviceType: util.getDeviceType(userAgent),
						platform: platform as string,
						browser: browser,
						id: payload.LoginId
					})
				}

				else {
					this.#fastify.DB.SQL.Session.update({
						lastActive: new Date(),
						ip: ip,
						id: payload.LoginId
					}, {
						where: { deviceType: type, platform: platform as string, browser, userId: payload.Id }
					})
				}

				return resolve(true);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async storeUser(payload: Register, userId: string, businessId: string, hashPassword: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(4);
				const branchid = "QC_BR_" + buf.toString("hex").toUpperCase();

				const buf_p = randomBytes(4);
				const paymentId = "QC_PYH_" + buf_p.toString("hex").toUpperCase();

				const [business, payment, branch, admin] = await Promise.all([
					await this.#fastify.DB.SQL.Business.create({
						id: "QC_BS_" + businessId,
						adminId: "QC_US_" + userId,
						name: payload.BusinessName,
						country: payload.Country,
						currency: payload.Currency
					}),
					await this.#fastify.DB.SQL.PaymentHistory.create({
						id: paymentId,
						adminId: "QC_US_" + userId,
						name: "FREE",
						type: "FOREVER"
					}),
					await this.#fastify.DB.SQL.Branch.create({
						id: branchid,
						businessId: "QC_BS_" + businessId,
						name: "Headquarter"
					}),
					await this.#fastify.DB.SQL.Admin.create({
						id: "QC_US_" + userId,
						branchId: branchid,
						businessId: "QC_BS_" + businessId,
						email: payload.Email,
						password: hashPassword,
						name: `${payload.FirstName} ${payload.LastName}`,
						country: payload.Country,
						currency: payload.Currency,
						subscription: paymentId
					})
				])


				if (admin === null) {

					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unable to register your account, please try again";

					if (branch !== null || business !== null || payment !== null) {
						this.#fastify.DB.SQL.Branch.destroy({
							where: { id: branchid }
						})
						this.#fastify.DB.SQL.Business.destroy({
							where: { id: businessId }
						})
						this.#fastify.DB.SQL.PaymentHistory.destroy({
							where: { id: paymentId }
						})
					}

					return reject(this.#reply.DefaultResponse);
				}

				if (branch === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Your business name could not be registered, login and add it manually";

					if (business !== null) {
						this.#fastify.DB.SQL.Business.destroy({
							where: { id: businessId }
						})
					}

					return reject(this.#reply.DefaultResponse);
				}

				if (business === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Unable to register your account, please try again";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(true);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async findUser(email_: string): Promise<UsersModel | AdminsModel | null> {
		return new Promise(async (resolve, reject) => {
			try {
				const email = email_.trim();

				const [admin, user] = await Promise.all([
					this.#fastify.DB.SQL.Admin.findOne({
						attributes: ["password", "id", "name", "email", "role", "businessId", "branchId", "verified"],
						where: { email }
					}),
					this.#fastify.DB.SQL.User.findOne({
						attributes: ["password", "id", "name", "email", "role", "businessId", "branchId", "verified", "status"],
						where: { email }
					})
				]);

				return resolve(admin || user || null);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async getUser(id: string): Promise<UsersModel | AdminsModel | null> {
		return new Promise(async (resolve, reject) => {
			try {

				const [admin, user] = await Promise.all([
					this.#fastify.DB.SQL.Admin.findOne({
						attributes: ["id", "name", "email", "password", "role", "verified", "businessId", "branchId"],
						where: { id }
					}),
					this.#fastify.DB.SQL.User.findOne({
						attributes: ["id", "name", "password", "role", "verified", "businessId", "branchId", "status"],
						where: { id }
					})
				]);

				return resolve(admin || user || null);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async businessInfo(id: string): Promise<BusinessModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const business = await this.#fastify.DB.SQL.Business.findOne({
					attributes: ["id", "name", "currency", "country"],
					where: { id }
				})

				if (business === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Your account may be invalid please login again";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(business);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async authenticate(payload: AUTH_Token): Promise<AdminsModel | UsersModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const [admin, user] = await Promise.all([
					this.#fastify.DB.SQL.Admin.findOne({
						attributes: ["role", "businessId", "branchId", "name", "email"],
						where: { id: payload.Id.trim() }
					}),
					this.#fastify.DB.SQL.User.findOne({
						attributes: ["role", "businessId", "branchId", "name", "email", "status"],
						where: { id: payload.Id.trim() }
					})
				]);

				if (admin === null && user === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				if (user?.status == "DISABLED") {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, please login again";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(admin as AdminsModel || user as UsersModel);

			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async storePassword(token: AUTH_Token, data: PasswordData): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				if (token.Role === "SUPER_ADMIN") {
					await this.#fastify.DB.SQL.Admin.update({
						password: data.hashPassword
					}, { where: { id: token.Id, businessId: data.businessId, branchId: data.branchId } })
				} else {
					await this.#fastify.DB.SQL.User.update({
						password: data.hashPassword
					}, { where: { id: token.Id, businessId: data.businessId, branchId: data.branchId } })
				}

				return resolve(true);


			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		}
		)
	}

	async verified(data: VerifiedType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.Admin.update({
					verified: true
				}, { where: { id: data.id, branchId: data.branchId, businessId: data.businessId } });

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to save the category";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async adminInfo(businessId: string): Promise<BusinessModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const business = await this.#fastify.DB.SQL.Business.findOne({
					attributes: ["name"],
					where: { id: businessId },
					include: {
						model: this.#fastify.DB.SQL.Admin,
						attributes: ["id", "email", "name", "country", "currency", "subscription"],
						as: "admin"
					}
				})

				if (business === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, we could not complete your request";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(business);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async branchInfo(branchId: string): Promise<BranchesModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const branch = await this.#fastify.DB.SQL.Branch.findOne({
					attributes: ["businessId", "id", "name", "address"],
					where: { id: branchId }
				})

				if (branch === null) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = "Unauthorized, we could not complete your request";
					return reject(this.#reply.DefaultResponse);
				}

				return resolve(branch);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}
}

export default DB_AUTH;
