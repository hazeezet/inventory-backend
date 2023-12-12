import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { ItemPriceModel } from "./types";

export default fp(async function (fastify, _opts) {

    const Pricing = fastify.DB.SQL.Instance.define<ItemPriceModel>("itemPrice", {
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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branchId: {
            type: DataTypes.INTEGER,
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

    fastify.DB.SQL.ItemPrice = Pricing;
});
