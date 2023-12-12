"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addConstraint("paymentCustomer", {
            type: "foreign key",
            name: "paymentCustomer_admin_id_fk",
            fields: ["adminId"],
            references: {
                table: "admin",
                field: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint("paymentCustomer", "paymentCustomer_admin_id_fk");
    }
};
