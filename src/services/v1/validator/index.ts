"use strict";

import Validator from "validatorjs";
import validatorSchema from "./schema.js";
import { FastifyReply } from "fastify";
import { AUTH_Token, VERIFICATION_Token } from "#types/global/tokens";
import { AddItem, Category, DeleteCategory, EditCategory, ListCategory, Login, Register, SaveCookie, EditItem, EditBranch, ListItem, SaveBranch, SaveBranchAdmin, ChangeUserRole, ListBranchUser, SaveUser, DeleteItem, SwitchBranch, DeactivateUser, DeleteSession, ChangeCurrency, ChangePassword, ResendInvite, Verification, VerificationCode, ResetPassword, SetPassword, Restock, ListBranch, Adjust, Transfer, SaveBusiness, EditBusiness, ListInventory, ListAdjustHistory, ListRestockHistory,ListTransferHistory, StripeCheckout } from "#types/payloads";

/**all payloads Validator */
class Validation {

	/**fastify reply instance */
	#reply;

	constructor(fastifyReply: FastifyReply) {
		this.#reply = fastifyReply;
	}

	/**Login payload validator */
	async login(payload: Login): Promise<Login> {
		const schema = validatorSchema.login();
		return new Promise((resolve, reject) => {
			if (payload.Email != undefined && payload.Password != undefined) {

				let login = new Validator(payload, schema.rules, schema.message);

				if (login.fails()) {
					let error: string | boolean = "error with the request, please try again";

					if (login.errors.has("Email")) error = login.errors.first("Email");

					else if (login.errors.has("Password")) error = login.errors.first("Password");

					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = error as string;
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}
			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more required payload is missing";
				reject(this.#reply.DefaultResponse);
			}

		});

	}

	async preToken(payload: SaveCookie): Promise<SaveCookie> {
		const schema = validatorSchema.preToken();
		return new Promise((resolve, reject) => {
			if (payload.SavCo != undefined) {
				let sav = new Validator(payload, schema.rules, schema.message);

				if (sav.fails()) {
					this.#reply.DefaultResponse.statusCode = 400;
					this.#reply.DefaultResponse.error = [sav.errors.first("SavCo")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 400;
				this.#reply.DefaultResponse.error = "unauthorized m";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async register(payload: Register): Promise<Register> {
		const schema = validatorSchema.register();
		return new Promise((resolve, reject) => {
			if (payload.Email != undefined && payload.FirstName != undefined && payload.LastName != undefined && payload.BusinessName != undefined && payload.Password != undefined && payload.Country != undefined && payload.Currency != undefined) {
				let register = new Validator(payload, schema.rules, schema.message);

				if (register.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [register.errors.first("Name"), register.errors.first("BusinessName"), register.errors.first("Email"), register.errors.first("Password"), register.errors.first("Country"), register.errors.first("Currency")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async addCategory(payload: Category): Promise<Category> {
		const schema = validatorSchema.addCategory();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);

				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("Name")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async editCategory(payload: EditCategory): Promise<EditCategory> {
		const schema = validatorSchema.editCategory();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined && payload.Id != undefined) {
				let edit = new Validator(payload, schema.rules, schema.message);

				if (edit.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [edit.errors.first("Name"), edit.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listCategory(payload: ListCategory): Promise<ListCategory> {
		const schema = validatorSchema.listCategory();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async addItem(payload: AddItem): Promise<AddItem> {
		const schema = validatorSchema.addItem();

		return new Promise((resolve, reject) => {
			if (payload.Name != undefined && payload.Category != undefined && payload.Code != undefined && payload.Available != undefined && payload.Minimum != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);

				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("Name"), add.errors.first("Category"), add.errors.first("Code"), add.errors.first("Available"), add.errors.first("Price"), add.errors.first("Minimum"), add.errors.first("Batch"), add.errors.first("MeasurementValue"), add.errors.first("MeasurementUnit"), add.errors.first("MeasurementName"), add.errors.first("ManufacturerName")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listItems(payload: ListItem): Promise<ListItem> {
		const schema = validatorSchema.listItems();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listBranch(payload: ListBranch): Promise<ListBranch> {
		const schema = validatorSchema.listItems();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listBranchItems(payload: ListItem): Promise<ListItem> {
		const schema = validatorSchema.listBranchItems();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page"), list.errors.first("BranchId")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listBranchUser(payload: ListBranchUser): Promise<ListBranchUser> {
		const schema = validatorSchema.listBranchUser();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page"), list.errors.first("BranchId")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listInventory(payload: ListInventory): Promise<ListInventory> {
		const schema = validatorSchema.listInventory();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listAdjustHistory(payload: ListAdjustHistory): Promise<ListAdjustHistory> {
		const schema = validatorSchema.listAdjustHistory();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}


	async listRestockHistory(payload: ListRestockHistory): Promise<ListRestockHistory> {
		const schema = validatorSchema.listRestockHistory();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async listTransferHistory(payload: ListTransferHistory): Promise<ListTransferHistory> {
		const schema = validatorSchema.listTransferHistory();
		return new Promise((resolve, reject) => {
			if (payload.Limit != undefined && payload.Page != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Limit"), list.errors.first("Page")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async deleteCategory(payload: DeleteCategory): Promise<DeleteCategory> {
		const schema = validatorSchema.deleteCategory();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let delete_ = new Validator(payload, schema.rules, schema.message);

				if (delete_.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [delete_.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async stripeCheckout(payload: StripeCheckout): Promise<StripeCheckout> {
		const schema = validatorSchema.stripeCheckout();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined && payload.Interval != undefined) {
				let checkout = new Validator(payload, schema.rules, schema.message);

				if (checkout.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [checkout.errors.first("Id"), checkout.errors.first("Interval")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}
	

	async addBranch(payload: SaveBranch): Promise<SaveBranch> {
		const schema = validatorSchema.addBranch();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);
				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("Name"), add.errors.first("Address")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async addBusiness(payload: SaveBusiness): Promise<SaveBusiness> {
		const schema = validatorSchema.addBusiness();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);
				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("Name"), add.errors.first("Address")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async switchBranch(payload: SwitchBranch): Promise<SwitchBranch> {
		const schema = validatorSchema.swwitchBranch();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async editBranch(payload: EditBranch): Promise<EditBranch> {
		const schema = validatorSchema.editBranch();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined && payload.Id != undefined) {
				let edit = new Validator(payload, schema.rules, schema.message);

				if (edit.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [edit.errors.first("Name"), edit.errors.first("Id"), edit.errors.first("Address")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async editBusiness(payload: EditBusiness): Promise<EditBusiness> {
		const schema = validatorSchema.editBusiness();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined && payload.Id != undefined) {
				let edit = new Validator(payload, schema.rules, schema.message);

				if (edit.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [edit.errors.first("Name"), edit.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async addBranchAdmin(payload: SaveBranchAdmin): Promise<SaveBranchAdmin> {
		const schema = validatorSchema.addBranchAdmin();
		return new Promise((resolve, reject) => {
			if (payload.FirstName != undefined && payload.LastName != undefined && payload.Email != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);

				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("FirstName"), add.errors.first("LastName"), add.errors.first("Email")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async changeCurrency(payload: ChangeCurrency): Promise<ChangeCurrency> {
		const schema = validatorSchema.changeCurrency();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);
				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("Name")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async editItem(payload: EditItem): Promise<EditItem> {
		const schema = validatorSchema.editItem();
		return new Promise((resolve, reject) => {
			if (payload.Name != undefined && payload.Id != undefined && payload.Category != undefined && payload.Code != undefined && payload.Minimum != undefined) {
				let edit = new Validator(payload, schema.rules, schema.message);

				if (edit.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [edit.errors.first("Name"), edit.errors.first("Id"), edit.errors.first("Category"), edit.errors.first("Code"), edit.errors.first("Price"), edit.errors.first("Minimum"), edit.errors.first("Batch"), edit.errors.first("MeasurementValue"), edit.errors.first("MeasurementUnit"), edit.errors.first("MeasurementName"), edit.errors.first("ManufacturerName")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async deleteItem(payload: DeleteItem): Promise<DeleteItem> {
		const schema = validatorSchema.deleteItem();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let delete_ = new Validator(payload, schema.rules, schema.message);

				if (delete_.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [delete_.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async changeRole(payload: ChangeUserRole): Promise<ChangeUserRole> {
		const schema = validatorSchema.changeRole();
		return new Promise((resolve, reject) => {
			if (payload.User != undefined && payload.Role != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);
				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("User"), add.errors.first("Branch"), add.errors.first("Role")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async addUser(payload: SaveUser): Promise<SaveUser> {
		const schema = validatorSchema.addUser();
		return new Promise((resolve, reject) => {
			if (payload.FirstName != undefined && payload.Role != undefined && payload.LastName != undefined && payload.Email != undefined) {
				let add = new Validator(payload, schema.rules, schema.message);

				if (add.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [add.errors.first("FirstName"), add.errors.first("LastName"), add.errors.first("Email"), add.errors.first("Role")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async deactivateUser(payload: DeactivateUser): Promise<DeactivateUser> {
		const schema = validatorSchema.deactivateUser();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async resendInvite(payload: ResendInvite): Promise<ResendInvite> {
		const schema = validatorSchema.resendInvite();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async resetPassword(payload: ResetPassword): Promise<ResetPassword> {
		const schema = validatorSchema.resetPassword();
		return new Promise((resolve, reject) => {
			if (payload.Email != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Email")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async verifyCode(payload: VerificationCode): Promise<VerificationCode> {
		const schema = validatorSchema.verifyCode();
		return new Promise((resolve, reject) => {
			if (payload.Email != undefined && payload.Date != undefined && payload.Type != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = "Invalid verification link";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "Invalid verification link";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async verification(payload: Verification): Promise<Verification> {
		const schema = validatorSchema.verification();
		return new Promise((resolve, reject) => {
			if (payload.Code != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Code")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async verificationToken(payload: VERIFICATION_Token): Promise<VERIFICATION_Token> {
		const schema = validatorSchema.verificationToken();

		return new Promise((resolve, reject) => {

			const token = new Validator(payload, schema.rules, schema.message);

			if (token.fails()) {
				this.#reply.DefaultResponse.statusCode = 401;
				this.#reply.DefaultResponse.error = "Invalid verification code";
				reject(this.#reply.DefaultResponse);
			}
			else {
				resolve(payload);
			}

		});
	}

	async setPassword(payload: SetPassword): Promise<SetPassword> {
		const schema = validatorSchema.setPassword();

		return new Promise((resolve, reject) => {

			const token = new Validator(payload, schema.rules, schema.message);

			if (token.fails()) {
				this.#reply.DefaultResponse.statusCode = 401;
				this.#reply.DefaultResponse.error = token.errors.first("Password") as string;
				reject(this.#reply.DefaultResponse);
			}
			else {
				resolve(payload);
			}

		});
	}

	async deleteSession(payload: DeleteSession): Promise<DeleteSession> {
		const schema = validatorSchema.deleteSession();
		return new Promise((resolve, reject) => {
			if (payload.Id != undefined) {
				let list = new Validator(payload, schema.rules, schema.message);

				if (list.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [list.errors.first("Id")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async cookie(payload: AUTH_Token): Promise<AUTH_Token> {
		const schema = validatorSchema.cookie();

		return new Promise((resolve, reject) => {

			const token = new Validator(payload, schema.rules, schema.message);

			if (token.fails()) {
				this.#reply.DefaultResponse.statusCode = 401;
				this.#reply.DefaultResponse.error = "Unauthorized, please login again";
				reject(this.#reply.DefaultResponse);
			}
			else {
				resolve(payload);
			}

		});
	}

	async changePassword(payload: ChangePassword): Promise<ChangePassword> {
		const schema = validatorSchema.changePassword();

		return new Promise((resolve, reject) => {
			if (payload.OldPassword != undefined && payload.NewPassword != undefined) {

				let changePassword = new Validator(payload, schema.rules, schema.message);

				if (changePassword.fails()) {
					let error: string | boolean = "error with the request, please try again";

					if (changePassword.errors.has("OldPassword")) error = changePassword.errors.first("OldPassword");

					else if (changePassword.errors.has("NewPassword")) error = changePassword.errors.first("NewPassword");

					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = error as string;
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}
			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more required payload is missing";
				reject(this.#reply.DefaultResponse);
			}

		});

	}

	async restock(payload: Restock): Promise<Restock> {
		const schema = validatorSchema.restock();
		return new Promise((resolve, reject) => {
			if (payload.Available != undefined && payload.Id != undefined) {
				let restock = new Validator(payload, schema.rules, schema.message);

				if (restock.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [restock.errors.first("Name"), restock.errors.first("Id"), restock.errors.first("Available"), restock.errors.first("Category"), restock.errors.first("Code"), restock.errors.first("BatchNumber"), restock.errors.first("Price")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async adjust(payload: Adjust): Promise<Adjust> {
		const schema = validatorSchema.adjust();
		return new Promise((resolve, reject) => {
			if (payload.Quantity != undefined && payload.Id != undefined) {
				let adjust = new Validator(payload, schema.rules, schema.message);

				if (adjust.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [adjust.errors.first("Id"), adjust.errors.first("Quantity")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}

	async transfer(payload: Transfer): Promise<Transfer> {
		const schema = validatorSchema.transfer();
		return new Promise((resolve, reject) => {
			if (payload.Quantity != undefined && payload.Item != undefined && payload.Branch != undefined) {
				let transfer = new Validator(payload, schema.rules, schema.message);

				if (transfer.fails()) {
					this.#reply.DefaultResponse.statusCode = 419;
					this.#reply.DefaultResponse.error = [transfer.errors.first("Branch"), transfer.errors.first("Quantity"), transfer.errors.first("Item")].find(value => value !== false && value !== undefined) as string ?? "";
					reject(this.#reply.DefaultResponse);
				}
				else {
					resolve(payload);
				}
			}

			else {
				this.#reply.DefaultResponse.statusCode = 422;
				this.#reply.DefaultResponse.error = "One or more payloads are missing";
				reject(this.#reply.DefaultResponse);
			}

		});
	}
}

export default Validation;
