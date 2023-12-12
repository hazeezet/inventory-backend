"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("pricing", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            user: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            business: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            branch: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            item: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            category: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            visible: {
                type: Sequelize.STRING,
                allowNull: false,
                default: "ALL"
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
        await queryInterface.dropTable("pricing");
    }
};
