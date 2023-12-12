"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("itemHistory", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            itemId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            businessId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            branchId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            itemLeft: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: true
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            createdBy: {
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
        await queryInterface.dropTable("itemHistory");
    }
};
