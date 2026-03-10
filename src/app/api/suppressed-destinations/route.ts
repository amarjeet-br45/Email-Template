import { NextResponse } from "next/server";
import { SESv2Client, ListSuppressedDestinationsCommand } from "@aws-sdk/client-sesv2";

const sesv2Client = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const nextToken = searchParams.get("nextToken");

        const command = new ListSuppressedDestinationsCommand({
            NextToken: nextToken || undefined,
        });

        const response = await sesv2Client.send(command);

        return NextResponse.json({
            success: true,
            data: response.SuppressedDestinationSummaries || [],
            nextToken: response.NextToken,
        });
    } catch (error: any) {
        console.error("SES v2 ListSuppressedDestinations error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
