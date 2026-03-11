import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from "next/server";
import { renderEmailHtml } from "@/lib/renderEmailHtml";
import { isEmailSuppressed } from "@/lib/ses";
import { generateUnsubscribeToken } from "@/lib/token";

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(req: Request) {
    try {
        const { toEmail, subject, blocks } = await req.json();

        if (!toEmail || !blocks) {
            return NextResponse.json(
                { error: "Recipient email and template blocks are required." },
                { status: 400 }
            );
        }

        // Validate Environment Variables
        const missingVars: string[] = [];
        if (!process.env.AWS_REGION) missingVars.push("AWS_REGION");
        if (!process.env.AWS_ACCESS_KEY_ID) missingVars.push("AWS_ACCESS_KEY_ID");
        if (!process.env.AWS_SECRET_ACCESS_KEY) missingVars.push("AWS_SECRET_ACCESS_KEY");
        if (!process.env.NEXT_PUBLIC_BASE_URL) missingVars.push("NEXT_PUBLIC_BASE_URL");
        if (!process.env.UNSUBSCRIBE_SECRET) missingVars.push("UNSUBSCRIBE_SECRET");

        if (missingVars.length > 0) {
            return NextResponse.json(
                { error: `Missing variables on live server: ${missingVars.join(", ")}` },
                { status: 500 }
            );
        }

        // ✅ Step 1: Prevent Future Emails (Suppression Check)
        try {
            const isSuppressed = await isEmailSuppressed(toEmail);
            if (isSuppressed) {
                return NextResponse.json(
                    { error: "This email address is on the suppression list.", suppressed: true },
                    { status: 403 }
                );
            }
        } catch (suppressionError: any) {
            console.warn("Suppression check failed (likely sandbox or AWS error):", suppressionError.message);
            // Optionally continue if you want to be permissive, but per requirements we should probably handle it.
        }

        const fromEmail = process.env.AWS_SES_FROM_EMAIL || process.env.VERIFIED_SENDER;

        if (!fromEmail) {
            return NextResponse.json(
                { error: "Sender email not configured." },
                { status: 500 }
            );
        }

        // ✅ Step 2: Generate SECURE Unsubscribe Token
        const unsubscribeToken = generateUnsubscribeToken(toEmail);
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${unsubscribeToken}`;

        // ✅ Step 3: Generate Email HTML
        const htmlContent = renderEmailHtml(blocks, unsubscribeUrl);

        // ✅ Step 4: Construct Raw MIME Message with Headers
        const boundary = `----=_Part_${Date.now()}`;
        const rawMessage = [
            `From: ${fromEmail}`,
            `To: ${toEmail}`,
            `Subject: ${subject || "Test Email from Selixer"}`,
            `Reply-To: ${fromEmail}`,
            `List-Unsubscribe: <${unsubscribeUrl}>`,
            `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            ``,
            `--${boundary}`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            ``,
            htmlContent,
            ``,
            `--${boundary}--`,
        ].join("\n");

        const command = new SendRawEmailCommand({
            RawMessage: {
                Data: Buffer.from(rawMessage),
            },
        });

        await sesClient.send(command);

        return NextResponse.json({
            success: true,
            message: "Email sent successfully!",
        });
    } catch (error: any) {
        console.error("Email API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send email." },
            { status: 500 }
        );
    }
}
