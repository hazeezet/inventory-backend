"use strict"

import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { BranchesModel } from "./types";


export default fp(async function (fastify, _opts) {

    const Branch = fastify.DB.SQL.Instance.define<BranchesModel>("branch", {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
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
    }, {/** Other model options go here */ });

    fastify.DB.SQL.Branch = Branch;

    fastify.ready()
        .then(async () => {
            try {

                fastify.DB.SQL.Branch.hasMany(fastify.DB.SQL.User, {
                    sourceKey: "id",
                    foreignKey: "branchId",
                    onDelete: "RESTRICT"
                });

                fastify.DB.SQL.Branch.hasMany(fastify.DB.SQL.Category, {
                    sourceKey: "id",
                    foreignKey: "branchId",
                    onDelete: "RESTRICT"
                });
                fastify.DB.SQL.Branch.hasMany(fastify.DB.SQL.Item, {
                    sourceKey: "id",
                    foreignKey: "branchId",
                    onDelete: "RESTRICT"
                });

            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
