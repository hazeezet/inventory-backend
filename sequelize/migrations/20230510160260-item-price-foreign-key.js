"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("itemPrice", {
            type: "foreign key",
            name: "itemPrice_admin_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("itemPrice", {
            type: "foreign key",
            name: "itemPrice_branch_branchId_fk",
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
        await queryInterface.removeConstraint("itemPrice", "itemPrice_business_businessId_fk");
        await queryInterface.removeConstraint("itemPrice", "itemPrice_branch_branchId_fk");
    }
};
