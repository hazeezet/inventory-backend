"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("session", {
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastActive: {
                type: Sequelize.DATE,
                allowNull: false
            },
            ip: {
                type: Sequelize.STRING,
                allowNull: false
            },
            deviceType: {
                type: Sequelize.STRING,
                allowNull: false
            },
            platform: {
                type: Sequelize.STRING,
                allowNull: false
            },
            browser: {
                type: Sequelize.STRING,
                allowNull: false
            },
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("session");
    }
};
