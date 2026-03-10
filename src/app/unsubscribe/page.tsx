"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [email, setEmail] = useState<string>("");

    // Simple client-side JWT decode for display purposes
    useState(() => {
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                if (payload.email) setEmail(payload.email);
            } catch (e) {
                console.error("Failed to decode token for display", e);
            }
        }
    });

    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleUnsubscribe = async () => {
        if (!token) return;
        setStatus("loading");
        setErrorMsg("");
        try {
            const response = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMsg(data.error || "Failed to process unsubscribe request.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMsg("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f4f4f4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "Arial, sans-serif"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                padding: "40px",
                textAlign: "center"
            }}>
                <h1 style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000",
                    marginBottom: "10px"
                }}>Unsubscribe</h1>

                {status === "success" ? (
                    <div style={{ margin: "20px 0" }}>
                        <div style={{
                            backgroundColor: "#f0fdf4",
                            color: "#166534",
                            padding: "15px",
                            borderRadius: "12px",
                            marginBottom: "20px",
                            fontWeight: "600"
                        }}>
                            You have successfully unsubscribed.
                        </div>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                            You will no longer receive marketing emails from Selixer.
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}>
                            Unsubscribe <span style={{ fontWeight: "bold", color: "#000" }}>{email || "this email"}</span> from Selixer emails
                        </p>

                        <button
                            onClick={handleUnsubscribe}
                            disabled={status === "loading" || !token}
                            style={{
                                width: "100%",
                                padding: "16px",
                                backgroundColor: "#000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                cursor: (status === "loading" || !token) ? "not-allowed" : "pointer",
                                opacity: !token ? 0.5 : 1,
                                transition: "all 0.2s",
                                fontSize: "16px"
                            }}
                        >
                            {status === "loading" ? "Processing..." : "Unsubscribe"}
                        </button>

                        {status === "error" && (
                            <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "15px" }}>
                                {errorMsg}
                            </p>
                        )}

                        {!token && (
                            <p style={{ color: "#d97706", fontSize: "14px", marginTop: "15px" }}>
                                Invalid or missing unsubscribe link.
                            </p>
                        )}
                    </>
                )}

                <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #eee" }}>
                    <p style={{
                        fontSize: "12px",
                        color: "#999",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "2px"
                    }}>
                        Selixer
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "#999", fontWeight: "bold", textTransform: "uppercase" }}>Loading...</div>
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    );
}
