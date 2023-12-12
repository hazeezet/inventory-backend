"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { CategoryModel } from "./types";


export default fp(async function (fastify, _opts) {

    const Category = fastify.DB.SQL.Instance.define<CategoryModel>("category", {
        // Model attributes are defined here
        id: {
            type: DataTypes.STRING,
            allowNull: false,
			primaryKey: true
        },
        businessId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        branchId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        items: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                const date = new Date(this.getDataValue("createdAt") as string).toLocaleString("en-NG", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: process.env.TIMEZONE
                });
                return date
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                const date = new Date(this.getDataValue("updatedAt") as string).toLocaleString("en-NG", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: process.env.TIMEZONE
                });
                return date
            }
        }
    }, {});
	
	fastify.DB.SQL.Category = Category;

    fastify.ready()
        .then(async () => {
            try {

                fastify.DB.SQL.Category.hasMany(fastify.DB.SQL.Item, {
                    sourceKey: "id",
                    foreignKey: "category",
                    onDelete: "RESTRICT",
                    as: "categoryItem"
                });
                fastify.DB.SQL.Category.hasOne(fastify.DB.SQL.Admin, {
                    sourceKey: "businessId",
                    foreignKey: "businessId",
                    onDelete: "RESTRICT"
                });

            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
