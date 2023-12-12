"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("category", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            businessId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            branchId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            items: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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
        await queryInterface.dropTable("category");
    }
};
