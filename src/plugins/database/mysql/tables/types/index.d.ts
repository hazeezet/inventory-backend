import { Role, AccountStatus, Actions } from "#types/global/tokens";
import { Actions as HistoryAction } from "#types/global/database";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";

interface BusinessModel extends Model<InferAttributes<BusinessModel>, InferCreationAttributes<BusinessModel>> {
	id: string;
	adminId: string;
	name: string;
	country: string;
	currency: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
	/**admin table association */
	admin?: NonAttribute<AdminModel>;
}

interface AdminsModel extends Model<InferAttributes<AdminsModel>, InferCreationAttributes<AdminsModel>> {
	id: string;
	businessId: string;
	/**default branch */
	branchId: string;
	name: string;
	email: string;
	password: string;
	country: string;
	currency: string;
	role?: Role;
	/**email verification */
	verified?: boolean;
	/**user subscription name */
	subscription: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
	/**payment table association */
	payment?: NonAttribute<PaymentHistoryModel>;
}

interface UsersModel extends Model<InferAttributes<UsersModel>, InferCreationAttributes<UsersModel>> {
	id: string;
	businessId: string;
	branchId: string;
	name: string;
	email: string;
	password: string;
	role?: Role;
	/**if the account is still active or disabled */
	status?: AccountStatus;
	/**email verification */
	verified?: boolean;
	createdBy: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface BranchesModel extends Model<InferAttributes<BranchesModel>, InferCreationAttributes<BranchesModel>> {
	id: string;
	businessId: string;
	name: string;
	address: string | null;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface CategoryModel extends Model<InferAttributes<CategoryModel>, InferCreationAttributes<CategoryModel>> {
	/**category id */
	id: string;
	/**business id which the category belong to */
	businessId: string;
	/**branch id which the category belong to */
	branchId: string;
	/**category name */
	name: string;
	/**number of items using the category */
	items?: number;
	/**name of the user who created it */
	createdBy: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface ItemModel extends Model<InferAttributes<ItemModel>, InferCreationAttributes<ItemModel>> {
	/**item id */
	id: string;
	/**business id which the item belong to */
	businessId: string;
	/**branch id which the item belong to */
	branchId: string;
	/**item name */
	name: string;
	/**category id which the item belong to */
	category: string;
	/**item code (SKU) */
	code: string;
	/**the number of the item available in stock */
	available: number;
	/**minimum number of item that should be available */
	minimum: number;
	/**name of the item measurement */
	measurementName?: string | null;
	/**the measurement value */
	measurementValue?: number | null;
	/**the unit of the measurement*/
	measurementUnit?: string | null;
	/**the batch the item belong to */
	batchNumber: string | null;
	/**price of each item */
	price: string | null;
	/**manufacturer of the item */
	manufacturerName: string | null;
	/**item image link */
	imageUrl?: string | null;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
	/**pricing table association */
	pricing?: NonAttribute<ItemPriceModel>;
}

interface SessionModel extends Model<InferAttributes<SessionModel>, InferCreationAttributes<SessionModel>> {
	userId: string;
	lastActive: string;
	ip: string;
	deviceType: string;
	platform: string;
	browser: string;
	/**session id */
	id: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface ItemHistoryModel extends Model<InferAttributes<ItemHistoryModel>, InferCreationAttributes<ItemHistoryModel>> {
	id: string;

	itemId: string;

	action: HistoryAction;
	/**business id which the item belong to */
	businessId: string;
	/**branch id which the item belong to */
	branchId: string;

	quantity: number;

	itemLeft: number;

	priceId: string | null;

	amount: number | null;

	createdBy: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface PricingModel extends Model<InferAttributes<PricingModel>, InferCreationAttributes<PricingModel>> {
	id: string;
	/**price name */
	name: string;
	/**total number of allow users */
	user: number;
	/**total number of allow business */
	business: number;
	/**total number of allow branch */
	branch: number;
	/**total number of allow items */
	item: number;
	/**total number of allow category */
	category: number;
	/**price visibility, either to all users or specific user (custom price) */
	visible: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface ItemPriceModel extends Model<InferAttributes<ItemPriceModel>, InferCreationAttributes<ItemPriceModel>> {
	id: string;
	/**item id */
	itemId: string;
	/**price amount */
	amount: number;
	/**business id*/
	businessId: string;
	/**branch id*/
	branchId: string;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}

interface PaymentHistoryModel extends Model<InferAttributes<PaymentHistoryModel>, InferCreationAttributes<PaymentHistoryModel>> {
	id: string;
	/**admin */
	adminId: string;
	/**payment duration montly or yearly */
	type: "MONTHLY" | "YEARLY" | "FOREVER";
	/**price name */
	name: string;
	/**payment gateway provider */
	customer: string | null;
	/**subscription id */
	subscriptionId?: string;
	/**amount paid */
	amount: number | null;
	/**currency */
	currency: string | null;
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
	/**pricing table association */
	pricing?: NonAttribute<PricingModel>;
}

interface PaymentCustomerModel extends Model<InferAttributes<PaymentCustomerModel>, InferCreationAttributes<PaymentCustomerModel>> {
	id: string;
	/**admin */
	adminId: string;
	/**payment gateway provider */
	provider: "STRIPE" | "PAYSTACK";
	/**date when the row was created */
	createdAt?: string;
	/**date when the row was updated */
	updatedAt?: string;
}
