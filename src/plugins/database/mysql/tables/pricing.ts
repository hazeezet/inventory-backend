import fp from "fastify-plugin";
import { DataTypes } from "sequelize";
import { PricingModel } from "./types";
import { randomBytes } from "crypto";

interface PriceAttributes {
    id: string;
    name: string;
    user: number;
    business: number;
    branch: number;
    item: number;
    category: number;
    visible: string;
}

export default fp(async function (fastify, _opts) {

    const Pricing = fastify.DB.SQL.Instance.define<PricingModel>("pricing", {
        // Model attributes are defined here
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        business: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        branch: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        visible: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "ALL"
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

    fastify.DB.SQL.Pricing = Pricing;

    fastify.ready(async (err) => {
        if (err) return;
        const priceToCreate: PriceAttributes[] = [
            {
                id: "",
                name: "FREE",
                user: 2,
                business: 1,
                branch: 1,
                item: 10,
                category: 2,
                visible: "ALL"
            },
            {
                id: "",
                name: "BASIC",
                user: 20,
                business: 1,
                branch: 5,
                item: 500,
                category: 10,
                visible: "ALL"
            },
            {
                id: "",
                name: "PRO",
                user: 50,
                business: 1,
                branch: 20,
                item: 0,
                category: 0,
                visible: "ALL"
            }
        ];

        try {
            const existingPrice = await fastify.DB.SQL.Pricing.findAll({
                where: {
                    name: priceToCreate.map(price => price.name),
                },
            });

            const priceToAdd = priceToCreate.filter(priceToCreate => {
                return !existingPrice.some(existingPrice => existingPrice.name === priceToCreate.name);
            });

            priceToAdd.forEach(price => {
                price.id = "QC_PR_" + priceId();
            });

            if (priceToAdd.length > 0) {
                await fastify.DB.SQL.Pricing.bulkCreate(priceToAdd);
            }
        } catch (error) {
            fastify.logger.error(error);
            fastify.debug.error(error);
        }

    })
});

function priceId() {
    const buf = randomBytes(4);
    return buf.toString("hex").toUpperCase();
}
