"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { UsersModel, SessionModel } from "#db/mysql/types";
import { ChangeUserRole, DeactivateUser, ListItem, SaveUser } from "#types/payloads";
import { Op } from "sequelize";
import { randomBytes } from "crypto";
import { VERIFICATION_Token } from "#types/global/tokens";

type List = {
	rows: UsersModel[];
	totalPages: number;
	currentPage: number
}

type SaveUserType = {
	businessId: string,
	branchId: string
	createdBy: string
} & SaveUser

type ChangeRoleType = {
	businessId: string,
	branchId: string
} & ChangeUserRole

type DeactivateType = {
	businessId: string,
	branchId: string
} & DeactivateUser

class DB_ITEM {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	/**list users of a particular branch */
	async get(businessId: string, branchId: string, payload: ListItem): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.User.findAndCountAll({
					attributes: {
						exclude: ["businessId", "branchId", "password"]
					},
					where: {
						businessId,
						branchId,
						[Op.or]: [
							{ name: { [Op.like]: `%${payload.Search}%` } },
							{ email: { [Op.like]: `%${payload.Search}%` } },
							{ role: { [Op.like]: `%${payload.Search}%` } },
							{ status: { [Op.like]: `%${payload.Search}%` } }
						]
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})
				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				return resolve({
					rows: result.rows,
					totalPages,
					currentPage
				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list users";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async saveuser(data: SaveUserType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = randomBytes(6);
				const userId = "QC_US_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.User.create({
					id: userId,
					name: `${data.FirstName} ${data.LastName}`,
					email: data.Email,
					password: "",
					role: data.Role == "ADMIN" ? "ADMIN" : "MANAGER",
					businessId: data.businessId,
					branchId: data.branchId,
					createdBy: data.createdBy
				});

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to save the user";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async changeRole(data: ChangeRoleType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.User.update({
					role: data.Role == "ADMIN" ? "ADMIN" : "MANAGER"
				}, { where: { id: data.User, businessId: data.businessId, branchId: data.branchId } });

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

	async deactivate(data: DeactivateType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.User.update({
					status: "DISABLED"
				}, { where: { id: data.Id, businessId: data.businessId, branchId: data.branchId } });

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

	async getSession(userId: string): Promise<SessionModel[] | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Session.findAll({
					attributes: {
						exclude: ["businessId", "branchId", "password"]
					},
					where: {
						userId
					}
				})

				return resolve(result);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list users";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async deleteSession(userId: string, sessionId: string): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Session.destroy({
					where: {
						userId,
						id: sessionId
					}
				})

				return resolve(result);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to list users";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async setPassword(token: VERIFICATION_Token, password: string, verified: boolean): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				if (token.Role == "SUPER_ADMIN") {
					await this.#fastify.DB.SQL.Admin.update({
						password
					}, { where: { id: token.Id, businessId: token.BusinessId, branchId: token.BranchId } });
				}

				else {

					await this.#fastify.DB.SQL.User.update({
						password
					}, { where: { id: token.Id, businessId: token.BusinessId, branchId: token.BranchId } });

					if (!verified) await this.#fastify.DB.SQL.User.update({
						verified: true
					}, { where: { id: token.Id, businessId: token.BusinessId, branchId: token.BranchId } });
				}
				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to set your password";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}
}

export default DB_ITEM;
