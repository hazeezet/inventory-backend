import { Schema } from "./types/schema";


class schema {
    /**Login schema */
    static login() {
        const schema: Schema = {
            rules: {
                Email: ["required", "email"],
                Password: ["required", "regex:/^(?=.*([A-Z]){1,})(?=.*[!@.#$&*?~%-+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,50}$/"],
            },
            message: {
                "required.Password": "Your Password can not be empty",
                "regex.Password": "Invalid user or password",
                "required.Email": "Email can not be empty",
                "email.Email": "Invalid user or password"
            },

        };

        return schema;
    }

    /**Login schema */
    static preToken() {
        const schema: Schema = {
            rules: {
                SavCo: ["required", "string"]
            },
            message: {
                "required.SavCo": "unauthorized",
                "string.SavCo": "unautorized"
            },

        };

        return schema;
    }

    /**Register schema */
    static register() {
        const schema: Schema = {
            rules: {
                Email: ["required", "email"],
                Password: ["required", "regex:/^(?=.*([A-Z]){1,})(?=.*[!@.#$&*?~%-+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{6,50}$/"],
                FirstName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                LastName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                BusinessName: ["required", "regex:/^(([A-Za-z]+[A-Za-z ]*)*[A-Za-z]+)?$/"],
                Country: ["required", "string"],
                Currency: ["required", "string"]
            },
            message: {
                "required.Email": "Email can not be empty",
                "email.Email": "Invalid email address",
                "required.FirstName": "First name can not be empty",
                "regex.FirstName": "Invalid first name",
                "required.LastName": "Last name can not be empty",
                "regex.LastName": "Invalid last name",
                "required.Password": "Your Password can not be empty",
                "regex.Password": "Password should be at least 6 character long and must have UPPERCASE, LOWERCASE, NUMBER and at least one of this ( ! @ . # $ & * )",
                "required.BusinessName": "BusinessName can not be empty",
                "regex.BusinessName": "Invalid Business Name",
                "required.Country": "Country can not be empty",
                "string.Country": "Invalid country name",
                "required.Currency": "Currency can not be empty",
                "string.Currency": "Invalid currency"
            }
        }

        return schema;
    }

    static addCategory() {
        const schema: Schema = {
            rules: {
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Name": "Category name is required",
                "regex.Name": "Invalid category name"
            }
        }

        return schema;
    }

    static editCategory() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Id": "Category id is required",
                "string.Id": "Category id is not valid",
                "required.Name": "Category name is required",
                "regex.Name": "Invalid category name"
            }
        }

        return schema;
    }

    static listCategory() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listItems() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listBranch() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listBranchItems() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"],
                BranchId: ["required", "string"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "required.BranchId": "Branch id is missing",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listBranchUser() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }
    static listInventory() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listTransferHistory() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listAdjustHistory() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }

    static listRestockHistory() {
        const schema: Schema = {
            rules: {
                Limit: ["required", "integer"],
                Page: ["required", "integer"]
            },
            message: {
                "required.Limit": "Data limit is required",
                "number.Limit": "Limit is not valid",
                "required.Page": "Page to fetch is required",
                "number.Page": "Invalid page"
            }
        }

        return schema;
    }


    static deleteCategory() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.Id": "Category id is required",
                "string.id": "Category id is not valid"
            }
        }

        return schema;
    }

    static stripeCheckout() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Interval: ["required", "regex:/^(month|year)$/"]
            },
            message: {
                "required.Id": "Subscription id is required",
                "string.id": "Subscription id is not valid",
                "required.Interval": "Subscription interval is required",
                "regex.Interval": "Subscription interval can either be month or year"
            }
        }

        return schema;
    }

    static addBranch() {
        const schema: Schema = {
            rules: {
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Address: ["regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Name": "Branch name is required",
                "regex.Name": "Invalid branch name",
                "regex.Address": "Invalid branch address"
            }
        }

        return schema;
    }

    static addBusiness() {
        const schema: Schema = {
            rules: {
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Name": "Business name is required",
                "regex.Name": "Invalid business name"
            }
        }

        return schema;
    }

    static swwitchBranch() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.BranchId": "Branch id is missing"
            }
        }

        return schema;
    }

    static editBranch() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Address: ["regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Id": "Branch id is required",
                "required.Name": "Branch name is required",
                "regex.Name": "Invalid branch name",
                "regex.Address": "Invalid branch address"
            }
        }

        return schema;
    }

    static editBusiness() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"]
            },
            message: {
                "required.Id": "Business id is required",
                "required.Name": "Business name is required",
                "regex.Name": "Invalid business name"
            }
        }

        return schema;
    }

    static addBranchAdmin() {
        const schema: Schema = {
            rules: {
                FirstName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                LastName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Email: ["required", "email"]
            },
            message: {
                "required.FirstName": "First name is required",
                "regex.FirstName": "Invalid first name",
                "required.LastName": "Last name is required",
                "regex.LastName": "Invalid last name",
                "required.Email": "Email is required",
                "email.Email": "Invalid email address"
            }
        }

        return schema;
    }

    static changeCurrency() {
        const schema: Schema = {
            rules: {
                Name: ["required", "string"]
            },
            message: {
                "required.Name": "currency name is missing"
            }
        }

        return schema;
    }

    static cookie() {
        const schema: Schema = {
            rules: {
                LoginId: ["required", "string",],
                Id: ["required", "string"],
                BusinessId: ["required", "string"],
                BranchId: ["required", "string"],
                Role: ["required", "string"]
            },
            message: {
                "required.Id": "User cannot be identified",
                "required.LoginId": "User session is missing",
                "required.BusinessId": "Business id is missing",
                "required.Role": "User role is not specified",
            }
        }

        return schema;
    }

    static verificationToken() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                BusinessId: ["required", "string"],
                BranchId: ["required", "string"],
                Role: ["required", "string"]
            },
            message: {
                "required.Id": "User cannot be identified",
                "required.BusinessId": "Business id is missing",
                "required.BranchId": "Branch id is missing",
                "required.Role": "User role is not specified",
            }
        }

        return schema;
    }

    static addItem() {
        const schema: Schema = {
            rules: {
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Category: ["required", "string"],
                Code: ["required", "string"],
                Available: ["required", "integer"],
                Price: ["integer"],
                Minimum: ["required", "integer"],
                Batch: ["string"],
                MeasurementValue: ["integer"],
                MeasurementUnit: ["string"],
                MeasurementName: ["string"],
                ManufacturerName: ["string"]
            },
            message: {
                "required.Name": "Item name is required",
                "regex.Name": "Invalid item name",
                "required.Category": "Category can not be empty",
                "string.Category": "Invalid category name",
                "required.Code": "Code can not be empty",
                "string.Code": "Invalid code name",
                "required.Available": "Total can not be empty",
                "number.Available": "Invalid ",
                "number.Price": "Invalid amount ",
                "required.Minimum": "Level can not be empty",
                "number.Minimum": "Invalid ",
                "string.Batch": "Invalid batch",
                "number.MeasurementValue": "Invalid ",
                "string.MeasurementUnit": "Invalid ",
                "string.MeasurementName": "Invalid ",
                "string.ManufacturerName": "Invalid "
            }
        }

        return schema;
    }

    static editItem() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Name: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Category: ["required", "string"],
                Code: ["required", "string"],
                Price: ["integer"],
                Minimum: ["required", "integer"],
                Batch: ["string"],
                MeasurementValue: ["integer"],
                MeasurementUnit: ["string"],
                MeasurementName: ["string"],
                ManufacturerName: ["string"]
            },
            message: {
                "required.Id": "Item id is required",
                "string.Id": "Item id is not valid",
                "required.Name": "Item name is required",
                "regex.Name": "Invalid item name",
                "required.Category": "Category can not be empty",
                "string.Category": "Invalid category name",
                "required.Code": "Code can not be empty",
                "string.Code": "Invalid code name",
                "number.Price": "Invalid amount ",
                "required.Minimum": "Minimum can not be empty",
                "number.Minimum": "Invalid ",
                "string.Batch": "Invalid batch",
                "number.MeasurementValue": "Invalid ",
                "string.MeasurementUnit": "Invalid ",
                "string.MeasurementName": "Invalid ",
                "string.ManufacturerName": "Invalid "
            }
        }

        return schema;
    }
    static deleteItem() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.Id": "Item id is required",
                "string.id": "Item id is not valid"
            }
        }

        return schema;
    }

    static changeRole() {
        const schema: Schema = {
            rules: {
                User: ["required", "string"],
                Role: ["regex:/^(ADMIN|MANAGER)$/"]
            },
            message: {
                "required.User": "user payload is required",
                "regex.Role": "Invalid role"
            }
        }

        return schema;
    }

    static addUser() {
        const schema: Schema = {
            rules: {
                FirstName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                LastName: ["required", "regex:/^[a-zA-Z0-9.&,/_\\ \-]+$/"],
                Email: ["required", "email"],
                Role: ["regex:/^(ADMIN|MANAGER)$/"]
            },
            message: {
                "required.FirstName": "First name is required",
                "regex.FirstName": "Invalid first name",
                "required.LastName": "Last name is required",
                "regex.LastName": "Invalid last name",
                "required.Email": "Email is required",
                "email.Email": "Invalid email address",
                "regex.Role": "Invalid role"
            }
        }

        return schema;
    }

    static deactivateUser() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.BranchId": "User id is missing"
            }
        }

        return schema;
    }

    static resendInvite() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.Id": "User id is missing"
            }
        }

        return schema;
    }

    static resetPassword() {
        const schema: Schema = {
            rules: {
                Email: ["required", "email"]
            },
            message: {
                "required.Email": "Email is missing",
                "email.Email": "Invalid user"
            }
        }

        return schema;
    }

    static setPassword() {
        const schema: Schema = {
            rules: {
                Password: ["required", "regex:/^(?=.*([A-Z]){1,})(?=.*[!@.#$&*?~%-+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,50}$/"]
            },
            message: {
                "required.Password": "Password is missing",
                "regex.Password": "Password should be at least 6 character long and must have UPPERCASE, LOWERCASE, NUMBER and at least one of this ( ! @ . # $ & * )"
            }
        }

        return schema;
    }

    static verification() {
        const schema: Schema = {
            rules: {
                Code: ["required", "string"]
            },
            message: {
                "required.BranchId": "verification code is missing"
            }
        }

        return schema;
    }

    static verifyCode() {
        const schema: Schema = {
            rules: {
                Email: ["required", "email"],
                Date: ["required", "string"],
                Type: ["required", "string"]
            },
            message: {
                "required.Email": "Email is required",
                "required.Date": "Date is required",
                "required.Type": "Verification type is required"
            }
        }

        return schema;
    }

    static deleteSession() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"]
            },
            message: {
                "required.BranchId": "Login id is missing"
            }
        }

        return schema;
    }
    static changePassword() {
        const schema: Schema = {
            rules: {
                OldPassword: ["required", "regex:/^(?=.*([A-Z]){1,})(?=.*[!@.#$&*?~%-+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,50}$/"],
                NewPassword: ["required", "regex:/^(?=.*([A-Z]){1,})(?=.*[!@.#$&*?~%-+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,50}$/"],
            },
            message: {
                "required.OldPassword": "Old Password can not be empty",
                "regex.OldPassword": "Invalid user or password",
                "required.NewPassword": "New Password can not be empty",
                "regex.NewPassword": "Invalid user or password",
            },

        };

        return schema;
    }
    static restock() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Available: ["required", "integer"],
            },
            message: {
                "required.Id": "Item id is required",
                "required.Name": "Item name is required",
                "regex.Name": "Invalid item name",
                "required.Available": "Number of items can not be empty",
                "number.Available": "Invalid quantity"
            }
        }

        return schema;
    }

    static adjust() {
        const schema: Schema = {
            rules: {
                Id: ["required", "string"],
                Quantity: ["required", "integer"],
            },
            message: {
                "required.Id": "Item id is required",
                "string.Id": "Item id is not valid",
                "required.Quantity": "Number of items removed can not be empty",
                "number.Quantity": "Invalid quantity"
            }
        }

        return schema;
    }

    static transfer() {
        const schema: Schema = {
            rules: {
                Item: ["required", "string"],
                Quantity: ["required", "integer"],
                Branch: ["required", "string"]
            },
            message: {
                "required.Item": "Item id is required",
                "string.Item": "Item id is not valid",
                "required.Quantity": "Number of items to transfer cannot be empty",
                "required.Branch": "Branch you are transferring to cannot be empty"
            }
        }

        return schema;
    }
}



export default schema;
