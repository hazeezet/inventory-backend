
type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "BRANCH_ADMIN_MANAGER" | "BRANCH_MANAGER";

type AccountStatus = "ACTIVE" | "DISABLED";


/**Raw cookie token value */
export interface VERIFICATION_Token {
	/**User id */
	Id: string;
	/**User role */
	Role: Role
	/**Business id of the organization */
	BusinessId: string;
	/**The branch the user belong to */
	BranchId: string;
}

interface AUTH_Token extends VERIFICATION_Token {
	/**User login identity */
	LoginId: string;
}

interface AUTH_PRE_Token {
	/**User id */
	Email: string;
	/**session id */
	LoginId: string;
	/**Duration */
	Date: string;
}

/**Raw mail token */
interface MAIL_Token {
	/**The type of email sent */
	Type: "VERIFICATION" | "RESET_PASSWORD" | "INVITATION" | "DELETE_ITEM";
	/**used to set expiration date or time */
	Date: string;
	/**User Email */
	Email: string;
	/**extra data */
	Data?: {
		itemId?: string;
		branchId?: string;
		businessId?: string;
	}
}
