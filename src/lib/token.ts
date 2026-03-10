import jwt from "jsonwebtoken";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET;

if (!UNSUBSCRIBE_SECRET) {
    throw new Error("UNSUBSCRIBE_SECRET is missing in .env.local");
}

/**
 * Generates a secure JWT token for unsubscription.
 * Payload: { email }
 * Expiry: 7 days
 */
export function generateUnsubscribeToken(email: string): string {
    return jwt.sign({ email }, UNSUBSCRIBE_SECRET!, { expiresIn: "7d" });
}

/**
 * Verifies an unsubscribe token and returns the email if valid.
 */
export function verifyUnsubscribeToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, UNSUBSCRIBE_SECRET!) as { email: string };
        return decoded.email;
    } catch (error) {
        console.error("Unsubscribe Token Verification Error:", error);
        return null;
    }
}
