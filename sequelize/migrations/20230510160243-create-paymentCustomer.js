"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("paymentCustomer", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            adminId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            provider: {
                type: Sequelize.STRING,
                allowNull: false
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
        await queryInterface.dropTable("paymentCustomer");
    }
};
