"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("itemHistory", {
            type: "foreign key",
            name: "itemHistory_business_businessId_fk",
            fields: ["businessId"],
            references: {
                table: "business",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("itemHistory", {
            type: "foreign key",
            name: "itemHistory_branch_branchId_fk",
            fields: ["branchId"],
            references: {
                table: "branch",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("itemHistory", {
            type: "foreign key",
            name: "itemHistory_item_itemId_fk",
            fields: ["itemId"],
            references: {
                table: "item",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("itemHistory", {
            type: "foreign key",
            name: "itemHistory_itemPrice_itemId_fk",
            fields: ["priceId"],
            references: {
                table: "itemPrice",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("itemHistory", "itemHistory_business_businessId_fk");
        await queryInterface.removeConstraint("itemHistory", "itemHistory_branch_branchId_fk");
        await queryInterface.removeConstraint("itemHistory", "itemHistory_item_itemId_fk");
        await queryInterface.removeConstraint("itemHistory", "itemHistory_itemPrice_itemId_fk");
    }
};
