import { SESv2Client, GetSuppressedDestinationCommand, PutSuppressedDestinationCommand } from "@aws-sdk/client-sesv2";

const sesv2Client = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Checks if an email is suppressed in the AWS SES account-level suppression list.
 */
export async function isEmailSuppressed(email: string): Promise<boolean> {
    try {
        const command = new GetSuppressedDestinationCommand({
            EmailAddress: email,
        });
        const response = await sesv2Client.send(command);
        return !!response.SuppressedDestination;
    } catch (error: any) {
        if (error.name === "NotFoundException") {
            return false;
        }
        console.error("SES v2 GetSuppressedDestination error:", error);
        throw error;
    }
}

/**
 * Adds an email to the AWS SES account-level suppression list.
 */
export async function suppressEmail(email: string): Promise<void> {
    try {
        const command = new PutSuppressedDestinationCommand({
            EmailAddress: email,
            Reason: "COMPLAINT",
        });
        await sesv2Client.send(command);
        console.log(`Email added to SES suppression list: ${email}`);
    } catch (error: any) {
        console.error("SES v2 PutSuppressedDestination error:", error);
        throw error;
    }
}
