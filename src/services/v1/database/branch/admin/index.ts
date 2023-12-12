"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { UsersModel } from "#db/mysql/types";
import { ListItem } from "#types/payloads";
import { Op } from "sequelize";
import { randomBytes } from "crypto";

type List = {
	rows: UsersModel[];
	totalPages: number;
	currentPage: number
}

type SaveUserType = {
	FirstName: string,
	LastName: string,
	Email: string,
	businessId: string,
	branchId: string,
	createdBy: string
}

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
				const userId = buf.toString("hex").toUpperCase();

				await this.#fastify.DB.SQL.User.create({
					id: "QC_US_" + userId,
					name: `${data.FirstName} ${data.LastName}`,
					email: data.Email,
					password: "",
					role: "BRANCH_ADMIN_MANAGER",
					createdBy: data.createdBy,
					businessId: data.businessId,
					branchId: data.branchId
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
}

export default DB_ITEM;
