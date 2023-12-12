"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { AdminsModel } from "./types";


export default fp(async function (fastify, _opts) {

    const Admin = fastify.DB.SQL.Instance.define<AdminsModel>("admin", {
        // Model attributes are defined here
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        businessId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        branchId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
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
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "SUPER_ADMIN"
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        subscription: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "FREE"
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

    fastify.DB.SQL.Admin = Admin;

    fastify.ready()
        .then(async () => {
            try {
                fastify.DB.SQL.Admin.hasOne(fastify.DB.SQL.PaymentHistory, {
                    sourceKey: "subscription",
                    foreignKey: "id",
                    as: "payment"
                });
            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
