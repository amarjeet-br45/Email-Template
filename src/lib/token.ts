import jwt from "jsonwebtoken";

/**
 * Generates a secure JWT token for unsubscription.
 * Payload: { email }
 * Expiry: 7 days
 */
export function generateUnsubscribeToken(email: string): string {
    const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET;

    if (!UNSUBSCRIBE_SECRET) {
        throw new Error("UNSUBSCRIBE_SECRET is missing in environment variables.");
    }

    return jwt.sign({ email }, UNSUBSCRIBE_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies an unsubscribe token and returns the email if valid.
 */
export function verifyUnsubscribeToken(token: string): string | null {
    try {
        const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET;
        if (!UNSUBSCRIBE_SECRET) {
            throw new Error("UNSUBSCRIBE_SECRET is missing in environment variables.");
        }

        const decoded = jwt.verify(token, UNSUBSCRIBE_SECRET) as { email: string };
        return decoded.email;
    } catch (error) {
        console.error("Unsubscribe Token Verification Error:", error);
        return null;
    }
}
