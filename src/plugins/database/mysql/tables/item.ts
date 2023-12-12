"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { ItemModel } from "./types";


export default fp(async function (fastify, _opts) {

    const Category = fastify.DB.SQL.Instance.define<ItemModel>("item", {
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
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        available: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minimum: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        measurementName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        measurementValue: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        measurementUnit: {
            type: DataTypes.STRING,
            allowNull: true
        },
        batchNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        manufacturerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
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
	
	fastify.DB.SQL.Item = Category;

    fastify.ready()
        .then(async () => {
            try {
                fastify.DB.SQL.Item.hasOne(fastify.DB.SQL.ItemPrice, {
                    sourceKey: "price",
                    foreignKey: "id",
                    as: "pricing"
                });
            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});



