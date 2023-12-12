"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("user", {
            type: "foreign key",
            name: "users_admin_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("user", {
            type: "foreign key",
            name: "users_branch_branchId_fk",
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
        await queryInterface.removeConstraint("user", "users_business_businessId_fk");
        await queryInterface.removeConstraint("user", "users_branch_branchId_fk");
    }
};
