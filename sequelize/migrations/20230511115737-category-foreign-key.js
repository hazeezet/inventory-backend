"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("category", {
            type: "foreign key",
            name: "category_business_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("category", {
            type: "foreign key",
            name: "category_branch_branchId_fk",
            fields: ["branchId"],
            references: {
                table: "branch",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("category", "category_business_businessId_fk");
        await queryInterface.removeConstraint("category", "category_branch_branchId_fk");
    }
};
