"use strict"

import fp from "fastify-plugin";
import { Sequelize } from "sequelize";

export default fp(async function (fastify, _opts) {
    const sequelize = new Sequelize(process.env.MYSQL_DATABASE as string, process.env.MYSQL_USERNAME as string, process.env.MYSQL_PASSWORD as string, {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT as unknown as number,
        dialect: "mysql",
        logging: false,
        timezone: process.env.MYSQL_TIMEZONE,
		dialectOptions: {
            dateStrings: true,
			connectTimeout: 60000
		},
        define: {
            freezeTableName: true
        },
		pool: {
			max: 25,
			min: 0,
			idle: 5000
		}
    });

    fastify.DB.SQL.Instance = sequelize;

    fastify.ready()
    .then(async()=>{
        try {
            await fastify.DB.SQL.Instance.authenticate();
        } catch (error) {
            fastify.logger.error(error);
			fastify.debug.error(error);
        }
    });
});
