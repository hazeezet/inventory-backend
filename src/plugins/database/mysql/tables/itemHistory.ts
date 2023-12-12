import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { ItemHistoryModel } from "./types";


export default fp(async function (fastify, _opts) {

    const History = fastify.DB.SQL.Instance.define<ItemHistoryModel>("itemHistory", {
        // Model attributes are defined here
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        itemId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        businessId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        branchId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemLeft: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        priceId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
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

    fastify.DB.SQL.ItemHistory = History;

    fastify.ready()
        .then(async () => {
            try {
                fastify.DB.SQL.ItemHistory.hasOne(fastify.DB.SQL.ItemPrice, {
                    sourceKey: "priceId",
                    foreignKey: "id"
                });
                fastify.DB.SQL.ItemHistory.hasOne(fastify.DB.SQL.Item, {
                    sourceKey: "itemId",
                    foreignKey: "id",
                    as: "item"
                });

                fastify.DB.SQL.ItemHistory.hasOne(fastify.DB.SQL.Branch, {
                    sourceKey: "branchId",
                    foreignKey: "id",
                    as: "branch"
                });
            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
