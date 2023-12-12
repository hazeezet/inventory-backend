import { MAIL_Token } from "#types/global/tokens";
import Event from "stripe";

export interface Login {
    Email: string;
    Password: string;
}

interface Register {
    Email: string;
    Password: string;
    FirstName: string;
    LastName: string;
    BusinessName: string;
    Country: string;
    Currency: string;
}

interface SaveCookie {
    SavCo: string;
}

interface SaveBusiness {
    Name: string;
    Country?: string;
    Currency?: string;
}

interface EditBusiness {
    Id: string;
    Name: string;
}

interface SwitchBusiness {
    Id: string;
}

interface ListBusiness {
    Limit: number;
    Page: number;
    Search: string;
}

interface Category {
    Name: string;
}

interface EditCategory {
    Id: string;
    Name: string;
}

interface ListCategory {
    Limit: number;
    Page: number;
    Search: string;
}

interface ListItem {
    Limit: number;
    Page: number;
    Search: string;
}

interface ListBranch {
    Limit: number;
    Page: number;
    Search: string;
}

interface ListBranchItem {
    Limit: number;
    Page: number;
    Search: string;
    BranchId: string;
}

interface SwitchBranch {
    Id: string;
}

interface ListBranchUser {
    Limit: number;
    Page: number;
    Search: string;
}

interface ListInventory {
    Limit: number;
    Page: number;
    Search: string;

}

interface ListAdjustHistory {
    Limit: number;
    Page: number;
    Search: string;
}
interface ListRestockHistory {
    Limit: number;
    Page: number;
    Search: string;
}
interface ListTransferHistory {
    Limit: number;
    Page: number;
    Search: string;
}

interface DeleteCategory {
    Id: string;
}

interface WebHookStripe extends Event.Event {

}

interface StripeCheckout {
    Id: string;
    Interval: "year" | "month"
}

interface SaveBranch {
    Name: string;
    Address: string
}

interface EditBranch {
    Id: string;
    Name: string;
    Address: string;
}

interface SaveBranchAdmin {
    FirstName: string;
    LastName: string;
    Email: string;
}

interface SaveUser {
    FirstName: string;
    LastName: string;
    Email: string;
    Role: "ADMIN" | "MANAGER"
}

interface DeactivateUser {
    Id: string;
}

interface ResendInvite {
    Id: string;
}

interface Verification {
    Code: string;
}

interface VerificationCode extends MAIL_Token {

}

interface ResetPassword {
    Email: string;
}

interface SetPassword {
    Password: string;
}

interface DeleteSession {
    Id: string;
}

interface ListUser {
    Limit: number;
    Page: number;
    Search: string;
}

interface AddItem {
    Name: string;
    Category: string;
    Code: string;
    Available: number;
    Price: number;
    Minimum: number;
    Batch: string;
    MeasurementValue: number;
    MeasurementUnit: string;
    MeasurementName: string;
    ManufacturerName: string;
}

interface EditItem {
    Id: string;
    Name: string;
    Category: string;
    Code: string;
    Price: number;
    Minimum: number;
    Batch: string;
    MeasurementValue: number;
    MeasurementUnit: string;
    MeasurementName: string;
    ManufacturerName: string;
}
interface DeleteItem {
    Id: string;
}

interface ChangeUserRole {
    User: string;
    Role: "ADMIN" | "MANAGER";
}

interface ChangeCurrency {
    Name: string;
}

interface ChangePassword {
    OldPassword: string;
    NewPassword: string;
}


interface Restock {
    Id: string;
    Available: number;
    Batch?: string;
    Price?: number;
}

interface Adjust {
    Id: string;
    Quantity: number;
}

interface Transfer {
    Branch: string;
    Item: string;
    Quantity: number;
}