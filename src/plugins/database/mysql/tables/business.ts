"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { BusinessModel } from "./types";


export default fp(async function (fastify, _opts) {

    const Business = fastify.DB.SQL.Instance.define<BusinessModel>("business", {
        // Model attributes are defined here
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        adminId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
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

    fastify.DB.SQL.Business = Business;

    fastify.ready()
        .then(async () => {
            try {
                fastify.DB.SQL.Business.hasOne(fastify.DB.SQL.Admin, {
                    sourceKey: "adminId",
                    foreignKey: "id",
                    as: "admin"
                });
            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
