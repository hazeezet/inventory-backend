import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { PaymentHistoryModel } from "./types";

export default fp(async function (fastify, _opts) {

    const payment = fastify.DB.SQL.Instance.define<PaymentHistoryModel>("paymentHistory", {
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
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "FREE"
        },
        customer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subscriptionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        currency: {
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

    fastify.DB.SQL.PaymentHistory = payment;

    fastify.ready()
        .then(async () => {
            try {
                fastify.DB.SQL.PaymentHistory.hasOne(fastify.DB.SQL.Pricing, {
                    sourceKey: "name",
                    foreignKey: "name",
                    as: "pricing"
                });
            } catch (error) {
                fastify.logger.error(error);
                fastify.debug.error(error);
            }
        })
});
