import { ModelStatic } from "sequelize/types";
import { UsersModel, PricingModel, LoginSessionModel, AdminsModel, BusinessModel, BranchesModel, CategoryModel, ItemModel, ItemHistoryModel, ItemPriceModel, PaymentHistoryModel, PaymentCustomerModel } from "#db/mysql/types";
import { Sequelize } from "sequelize";

/**Contains all the database that is available */
export interface DECORATE_DATABASE {
    /**MYSQL database */
    SQL: {
        /**Database Instance */
        Instance: Sequelize;
        /**business table */
        Business: ModelStatic<BusinessModel>;
        /**admin table */
        Admin: ModelStatic<AdminsModel>;
        /**users table */
        User: ModelStatic<UsersModel>;
        /**branch table */
        Branch: ModelStatic<BranchesModel>;
        /**category table */
        Category: ModelStatic<CategoryModel>;
        /**item table */
        Item: ModelStatic<ItemModel>;
        /**Login session table */
        Session: ModelStatic<LoginSessionModel>;
        /**item history table */
        ItemHistory: ModelStatic<ItemHistoryModel>;
        /**pricing table */
        Pricing: ModelStatic<PricingModel>;
        /**item price table */
        ItemPrice: ModelStatic<ItemPriceModel>;
        /**payment history table */
        PaymentHistory: ModelStatic<PaymentHistoryModel>;
        /**payment customer table */
        PaymentCustomer: ModelStatic<PaymentCustomerModel>;
    }
}
