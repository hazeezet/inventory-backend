
export interface EmailVerification {
    name: string
    subject: string;
    supportMail: string;
    link: string;
    logo: string;
    business?: string;
    branch?: string;
    item?: string;
}

/**this is stored in the cookie */
interface EmailToken {
    Email: string;
    Type: "verification" | "resetpassword",
    Date: Date
}
