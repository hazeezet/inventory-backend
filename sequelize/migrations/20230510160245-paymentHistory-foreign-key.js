"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("paymentHistory", {
            type: "foreign key",
            name: "paymentHistory_pricing_name_fk",
            fields: ["name"],
            references: {
                table: "pricing",
                field: "name"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
        await queryInterface.addConstraint("paymentHistory", {
            type: "foreign key",
            name: "paymentHistory_paymentCustomer_id_fk",
            fields: ["customer"],
            references: {
                table: "paymentCustomer",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("paymentHistory", "paymentHistory_pricing_name_fk");
    }
};
