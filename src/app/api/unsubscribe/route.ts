import { NextRequest, NextResponse } from "next/server";
import { suppressEmail } from "@/lib/ses";
import { verifyUnsubscribeToken } from "@/lib/token";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { error: "Unsubscribe token is required." },
                { status: 400 }
            );
        }

        // Verify JWT
        const email = verifyUnsubscribeToken(token);
        if (!email) {
            return NextResponse.json(
                { error: "Invalid or expired unsubscribe token." },
                { status: 401 }
            );
        }

        // Add email to SES Suppression List
        try {
            await suppressEmail(email);
        } catch (awsError: any) {
            if (awsError.name === "BadRequestException" && awsError.message.includes("sandbox")) {
                return NextResponse.json(
                    { error: "SES account is in sandbox mode. Production access required to manage suppression list." },
                    { status: 403 }
                );
            }
            throw awsError;
        }

        return NextResponse.json({
            success: true,
            message: "You have been successfully unsubscribed.",
        });
    } catch (error: any) {
        console.error("Unsubscribe API Error:", error);
        const statusCode = error.$metadata?.httpStatusCode || 500;
        const message = error.message || "Failed to process unsubscribe request.";
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
