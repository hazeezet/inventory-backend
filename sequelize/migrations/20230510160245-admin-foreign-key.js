"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("admin", {
            type: "foreign key",
            name: "admin_business_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("admin", {
            type: "foreign key",
            name: "admin_branch_branchId_fk",
            fields: ["branchId"],
            references: {
                table: "branch",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("admin", {
            type: "foreign key",
            name: "admin_paymentHistory_id_fk",
            fields: ["subscription"],
            references: {
                table: "paymentHistory",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("admin", "admin_business_businessId_fk");
        await queryInterface.removeConstraint("admin", "admin_branch_branchId_fk");
        await queryInterface.removeConstraint("admin", "admin_paymentHistory_id_fk");
    }
};
