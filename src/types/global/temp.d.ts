import { AUTH_Token, AUTH_PRE_Token, VERIFICATION_Token } from "./tokens";

export interface TEMP {
    /**Raw cookie token value */
    Token?: AUTH_Token;
    /**Raw cookie token value */
    VerificationToken?: VERIFICATION_Token;
    /**Raw pre token value */
    PreToken?: AUTH_PRE_Token;
    /**User Id */
    UserId?: string
    /**Business Id */
    BusinessId?: string;
    /**Business Id */
    BranchId?: string;
    /**item Id */
    ItemId?: string;
    /**Mail data that will be use to pharse the html */
    Mail?: {
        /**user email */
        email: string;
        /**user name */
        name?: string;
        /**Branch name */
        branch?: string;
        /**Business name */
        business?: string;
        /**item name */
        item?: string;
    }
}
