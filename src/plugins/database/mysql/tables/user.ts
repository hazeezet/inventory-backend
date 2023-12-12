"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { UsersModel } from "./types";


export default fp(async function (fastify, _opts) {

    const User = fastify.DB.SQL.Instance.define<UsersModel>("user", {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "MANAGER"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "ACTIVE"
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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

    fastify.DB.SQL.User = User;
});
