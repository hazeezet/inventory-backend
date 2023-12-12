'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("item", {
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
            category: {
                type: Sequelize.STRING,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            available: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            minimum: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            measurementName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            measurementValue: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            measurementUnit: {
                type: Sequelize.STRING,
                allowNull: true
            },
            batchNumber: {
                type: Sequelize.STRING,
                allowNull: true
            },
            price: {
                type: Sequelize.STRING,
                allowNull: true
            },
            manufacturerName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            imageUrl: {
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
        await queryInterface.dropTable("item");
    }
};
