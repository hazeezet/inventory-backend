"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { BranchesModel } from "#db/mysql/types";
import { randomBytes } from "crypto";
import { ListBranch } from "#types/payloads";
import { AUTH_Token } from "#types/global/tokens";
import { Op } from "sequelize";

type SaveType = {
	Name: string,
	Address: string,
	Currency?: string,
	businessId: string,
	branchId: string
}

type List = {
	rows: BranchesModel[];
	totalPages: number;
	currentPage: number
}

/**
 * Authorization database instance
 */
class DB_BRANCH {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async getAll(businessId: string, payload: ListBranch): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Branch.findAndCountAll({
					attributes: ["id", "name", "address"],
					where: {
						businessId,
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
					rows: result.rows as unknown as BranchesModel[],
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

	async get(businessId: string, branchId: string): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Branch.findOne({
					attributes: ["id", "name", "address"],
					where: { businessId, id: branchId }
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

	async exist(id: string): Promise<BranchesModel | null> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Branch.findOne({
					attributes: ["id", "name", "createdAt"],
					where: { id }
				})

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Branch does not exist";
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
				const buf = randomBytes(6);
				const branchid = buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.Branch.create({
					id: "QC_BR_" + branchid,
					businessId: data.businessId,
					name: data.Name,
					address: data.Address
				});

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

	async edit(id: string, data: SaveType): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				await this.#fastify.DB.SQL.Branch.update({
					name: data.Name,
					address: data.Address
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

	async switch(token: AUTH_Token, branchId: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				if (token.Role == "SUPER_ADMIN") {
					this.#fastify.DB.SQL.Admin.update({
						branchId
					}, {
						where: { id: token.Id }
					})
				}
				else {
					this.#fastify.DB.SQL.User.update({
						branchId
					}, {
						where: { id: token.Id }
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
}

export default DB_BRANCH;
