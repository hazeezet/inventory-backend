"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("item", {
            type: "foreign key",
            name: "item_admin_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("item", {
            type: "foreign key",
            name: "item_branch_branchId_fk",
            fields: ["branchId"],
            references: {
                table: "branch",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("item", {
            type: "foreign key",
            name: "item_category_id_fk",
            fields: ["category"],
            references: {
                table: "category",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("item", {
            type: "foreign key",
            name: "item_itemPrice_id_fk",
            fields: ["price"],
            references: {
                table: "itemPrice",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("item", "item_business_businessId_fk");
        await queryInterface.removeConstraint("item", "item_branch_branchId_fk");
        await queryInterface.removeConstraint("item", "item_category_id_fk");
    }
};
