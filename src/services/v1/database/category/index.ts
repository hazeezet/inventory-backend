"use strict"

import { FastifyInstance, FastifyReply } from "fastify";
import { CategoryModel, ItemModel } from "#db/mysql/types";
import { randomBytes } from "crypto";
import { ListCategory } from "#types/payloads";
import { Op } from "sequelize";

type SaveType = {
	categoryName: string,
	businessId: string,
	branchId: string,
	createdBy: string
}

type List = {
	rows: CategoryModel[];
	totalPages: number;
	currentPage: number
}
class DB_CATEGORY {

	#fastify;
	#reply;

	constructor(fastifyInstance: FastifyInstance, fastifyReply: FastifyReply) {
		this.#fastify = fastifyInstance;
		this.#reply = fastifyReply;
	}

	async get(businessId: string, branchId: string, payload: ListCategory): Promise<List | []> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Category.findAndCountAll({
					attributes: ["id", "name", "items", "createdBy", "createdAt"],
					where: {
						businessId,
						branchId,
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
					rows: result.rows,
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

	async exist(id: string): Promise<CategoryModel | null> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Category.findOne({
					attributes: ["id", "name", "items", "createdBy", "createdAt"],
					where: { id }
				})

				if (result === null) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Category does not exist";
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

	async save(data: SaveType, id: string | undefined = undefined): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				let categoryid: string;

				if(id){
					categoryid = id;
				}
				else{
					const buf = randomBytes(6);
					categoryid = "QC_CT_" + buf.toString("hex").toUpperCase();
				}

				await this.#fastify.DB.SQL.Category.create({
					id: categoryid,
					branchId: data.branchId,
					businessId: data.businessId,
					name: data.categoryName,
					createdBy: data.createdBy
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

				await this.#fastify.DB.SQL.Category.update({
					name: data.categoryName
				}, { where: { id, businessId: data.businessId, branchId: data.branchId } });

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

	async canDelete(id: string): Promise<ItemModel | null> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.#fastify.DB.SQL.Item.findOne({
					attributes: ["id"],
					where: { category: id }
				})

				if (result === null) {
					return resolve(result);
				}

				this.#reply.DefaultResponse.statusCode = 401;
				this.#reply.DefaultResponse.error = "Category is in use, please delete all items and try again";
				return reject(this.#reply.DefaultResponse)
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async delete(id: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Category.destroy({ where: { id } })
				
				if (result === 0) {
					this.#reply.DefaultResponse.statusCode = 401;
					this.#reply.DefaultResponse.error = "Category could not be deleted";
					return reject(this.#reply.DefaultResponse)
				}

				return resolve(result ? true : false);
			} catch (error) {
				this.#fastify.logger.error(error);
				this.#fastify.debug.error(error);
				this.#reply.DefaultResponse.statusCode = 515;
				this.#reply.DefaultResponse.error = "Unable to validate your request, not you, it was us.";
				return reject(this.#reply.DefaultResponse);
			}
		})
	}

	async getById(businessId: string, branchId: string, id: string): Promise<CategoryModel> {
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.#fastify.DB.SQL.Category.findOne({
					attributes: ["id", "name", "items", "createdBy", "createdAt"],
					where: {
						businessId,
						branchId,
						id
					}
				})

				return resolve(result as CategoryModel);
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

export default DB_CATEGORY;
