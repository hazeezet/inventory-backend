"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("paymentHistory", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            adminId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "FREE"
            },
            customer: {
                type: Sequelize.STRING,
                allowNull: true
            },
            subscriptionId: {
                type: Sequelize.STRING,
                allowNull: true
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            currency: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable("paymentHistory");
    }
};
