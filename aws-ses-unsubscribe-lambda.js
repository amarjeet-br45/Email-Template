import { SESv2Client, PutSuppressedDestinationCommand } from "@aws-sdk/client-sesv2";

// Initialize the SES v2 Client
// AWS Lambda automatically provides credentials and region through the execution environment
const ses = new SESv2Client({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event) => {
    console.log("Received SNS event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        try {
            // Extract the SES message published to the SNS topic
            const snsMessageRaw = record.Sns.Message;
            const snsMessage = JSON.parse(snsMessageRaw);

            // SES Unsubscribe events typically have eventType 'Subscription'
            // when interacting with the {{amazonSESUnsubscribeUrl}} macro
            const eventType = snsMessage.eventType || snsMessage.notificationType;

            if (eventType !== "Subscription" && eventType !== "Unsubscribe") {
                console.log(`Ignoring event type: ${eventType}`);
                continue;
            }

            // Extract the email address(es) that triggered the unsubscribe
            // SES events generally provide the original destination email in the mail.destination array
            let emailsToSuppress = [];

            if (snsMessage.mail && snsMessage.mail.destination) {
                emailsToSuppress = snsMessage.mail.destination;
            } else if (snsMessage.subscription && snsMessage.subscription.contactList) {
                // Fallback or alternative structure if the destination array is formatted differently
                emailsToSuppress = [snsMessage.mail?.destination?.[0] || ""];
            }

            // Filter out any empty/undefined emails
            emailsToSuppress = emailsToSuppress.filter(Boolean);

            for (const email of emailsToSuppress) {
                console.log(`Adding ${email} to SES Account-Level Suppression List...`);

                // Add the email to the Account-level suppression list (PutSuppressedDestination)
                // Note: The SES v2 API only accepts 'BOUNCE' or 'COMPLAINT' as suppression reasons.
                // We use 'COMPLAINT' here as the closest representation of an explicit user opt-out.
                const command = new PutSuppressedDestinationCommand({
                    EmailAddress: email,
                    Reason: "COMPLAINT"
                });

                await ses.send(command);
                console.log(`Successfully suppressed ${email}`);
            }

        } catch (error) {
            console.error("Error processing record:", error);
            // In production, you may want to re-throw the error or send to a DLQ depending on requirements
        }
    }

    // Return success response for Lambda
    return {
        statusCode: 200,
        body: "SNS event processed successfully."
    };
};
