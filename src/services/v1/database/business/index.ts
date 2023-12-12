"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { BusinessModel } from "#db/mysql/types";
import { randomBytes } from "crypto";
import { ChangeCurrency, ListBranch } from "#types/payloads";
import { AUTH_Token } from "#types/global/tokens";
import { Op } from "sequelize";
import DB_BRANCH from "#services/v1/database/branch/index.js";

type SaveType = {
	name: string,
	currency: string,
	country: string,
	businessId: string,
	adminId: string
}

type EditType = {
	name: string,
	businessId: string
}

type ChangeCurrencyType = {
	businessId: string,
} & ChangeCurrency

type List = {
	rows: BusinessModel[];
	totalPages: number;
	currentPage: number
}

/**
 * Authorization database instance
 */
class DB_BUSINESS {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async getAll(adminId: string, payload: ListBranch): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Business.findAndCountAll({
					attributes: ["id", "name", "currency"],
					where: {
						adminId,
						[Op.or]: [
							{ name: { [Op.like]: `%${payload.Search}%` } }
						]
					},
					limit: payload.Limit,
					offset: (payload.Page - 1) * payload.Limit,
				})
				const totalPages = Math.ceil(result.count / payload.Limit);
				const currentPage = payload.Page;

				return resolve({
					rows: result.rows as unknown as BusinessModel[],
					totalPages,
					currentPage
				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async get(businessId: string): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Business.findOne({
					attributes: ["id", "name", "currency"],
					where: { id: businessId }
				})

				const branch = result ? [result] : [];
				return resolve({
					rows: branch,
					totalPages: 1,
					currentPage: 1

				});
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async exist(id: string): Promise<BusinessModel | null> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Business.findOne({
					attributes: ["id", "name", "createdAt"],
					where: { id }
				})

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Business does not exist";
					return reject(this.#reply.DefaultResponse)
				}

				return resolve(result);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async save(data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const Branch = new DB_BRANCH(this.#fastify, this.#reply)
				const buf = randomBytes(6);
				const businessId = "QC_BS_" + buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.Business.create({
					id: businessId,
					name: data.name,
					adminId: data.adminId,
					country: data.country,
					currency: data.currency as string
				});
				await Branch.save({
					businessId,
					branchId: "",
					Name: "Headquater",
					Address: "",
					Currency: data.currency
				})
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

	async edit(id: string, data: EditType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.Branch.update({
					name: data.name
				}, { where: { id, businessId: data.businessId } });

				resolve(true)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to edit the user";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async changeCurrency(data: ChangeCurrencyType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.Business.update({
					currency: data.Name
				}, { where: { id: data.businessId } });

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

	async switch(token: AUTH_Token, businessId: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.Branch.findOne({
					where: { businessId }
				})
				if (result !== null) {
					this.#fastify.DB.SQL.Admin.update({
						businessId,
						branchId: result.id
					}, {
						where: { id: token.Id }
					})

				}
				return resolve(result?.id as string);
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
}

export default DB_BUSINESS;
