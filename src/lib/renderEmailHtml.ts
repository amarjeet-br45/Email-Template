import { EditorBlock } from "./editor-types";

/**
 * Renders editor blocks into highly compatible, table-based HTML for email clients.
 * Follows strict rules: No divs, no flexbox, inline CSS only, 600px centered layout.
 * Optimized for Gmail Mobile, Outlook, and Dark Mode.
 */
export function renderEmailHtml(blocks: EditorBlock[], unsubscribeUrl: string): string {
    const unsubscribeLink = unsubscribeUrl;

    const renderBlock = (block: EditorBlock): string => {
        const { type, content } = block;

        switch (type) {
            case "heading":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 10px;">
                        <tr>
                            <td align="${content.textAlign || 'left'}" valign="top" style="padding: 10px 0;">
                                <h1 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: ${content.fontSize}px; font-weight: bold; color: ${content.color || '#000000'}; margin: 0; line-height: 1.2; mso-line-height-rule: exactly;">
                                    ${content.text}
                                </h1>
                            </td>
                        </tr>
                    </table>
                `;

            case "paragraph":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-bottom: 15px;">
                        <tr>
                            <td align="${content.textAlign || 'left'}" valign="top" style="padding: 5px 0;">
                                <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: ${content.lineHeight || 1.5}; color: ${content.color || '#333333'}; margin: 0; mso-line-height-rule: exactly;">
                                    ${content.text}
                                </p>
                            </td>
                        </tr>
                    </table>
                `;

            case "button":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 20px 0;">
                        <tr>
                            <td align="${content.align || 'center'}" valign="top">
                                <!-- Bulletproof Button -->
                                <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr>
                                        <td align="center" bgcolor="${content.backgroundColor || '#2563eb'}" style="border-radius: ${content.borderRadius || 4}px; color: ${content.textColor || '#ffffff'};">
                                            <a href="${content.link || '#'}" target="_blank" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: ${content.textColor || '#ffffff'}; text-decoration: none; padding: ${content.paddingY || 12}px ${content.paddingX || 24}px; display: inline-block; border-radius: ${content.borderRadius || 4}px; border: 1px solid ${content.backgroundColor || '#2563eb'};">
                                                ${content.text}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                `;

            case "image": {
                const padding = content.padding || { top: 0, right: 0, bottom: 0, left: 0 };
                const imgWidth = content.widthMode === "full" ? "100%" : `${content.width || 100}%`;
                const pixelWidth = content.widthMode === "full" ? "600" : "";

                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                            <td align="${content.align || 'center'}" valign="top" style="padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;">
                                <img src="${content.url}" alt="${content.alt || ''}" width="${pixelWidth}" style="width: ${imgWidth}; max-width: 100%; height: auto; display: block; border: 0; outline: none; text-decoration: none;" border="0" />
                            </td>
                        </tr>
                    </table>
                `;
            }

            case "divider":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                            <td style="padding: ${content.spacing || 20}px 0; font-size: 1px; line-height: 1px; border-bottom: ${content.thickness || 1}px solid ${content.color || '#e5e7eb'};">
                                &nbsp;
                            </td>
                        </tr>
                    </table>
                `;

            case "social":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 20px 0;">
                        <tr>
                            <td align="${content.align || 'center'}" valign="top">
                                <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr>
                                        ${(content.icons || []).map((icon: any) => `
                                            <td style="padding: 0 ${content.iconSpacing || 10}px;">
                                                <a href="${icon.url || '#'}" target="_blank">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="${content.iconSize || 32}" height="${content.iconSize || 32}" style="display: block; border: 0; outline: none;" border="0" alt="${icon.platform}" />
                                                </a>
                                            </td>
                                        `).join("")}
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                `;

            case "columns": {
                const count = content.columns.length || 1;
                const colWidth = 100 / count;
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 20px 0;">
                        <tr>
                            ${content.columns.map((col: any) => `
                                <td width="${colWidth}%" valign="top" style="padding: 10px;">
                                    ${col.blocks.map((b: any) => renderBlock(b)).join("")}
                                </td>
                            `).join("")}
                        </tr>
                    </table>
                `;
            }

            case "product-recommendation":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 20px 0;">
                        <tr>
                            <td align="center" style="padding: 30px; background-color: #f9fafb; border-radius: 20px;">
                                <table width="200" border="0" cellspacing="0" cellpadding="0" role="presentation" bgcolor="#ffffff" style="border-radius: 15px; border-collapse: separate; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <img src="${content.image}" alt="${content.title}" width="200" style="width: 100%; height: auto; display: block; border: 0;" border="0" />
                                        </td>
                                    </tr>
                                </table>
                                <h4 style="margin: 15px 0 5px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #111827; font-weight: bold; line-height: 1.2;">${content.title}</h4>
                                <p style="margin: 0 0 15px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #2563eb; font-weight: bold;">${content.price}</p>
                                <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr>
                                        <td align="center" bgcolor="#2563eb" style="border-radius: 8px;">
                                            <a href="#" target="_blank" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #ffffff; text-decoration: none; padding: 10px 20px; display: inline-block; font-weight: bold; text-transform: uppercase;">
                                                ${content.ctaText || 'Buy Now'}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                `;

            case "order-summary":
                return `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 20px 0; border: 1px solid #f3f4f6; border-radius: 20px; background-color: #ffffff; border-collapse: separate;">
                        <tr>
                            <td style="padding: 25px;">
                                <h3 style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Order Summary</h3>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    ${content.items.map((item: any) => `
                                        <tr>
                                            <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #4b5563;">
                                                ${item.name} x${item.qty}
                                            </td>
                                            <td align="right" style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111827; font-weight: bold;">
                                                ${item.price}
                                            </td>
                                        </tr>
                                    `).join("")}
                                    <tr>
                                        <td colspan="2" style="padding-top: 20px; border-top: 1px solid #f3f4f6;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                <tr>
                                                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; color: #9ca3af; font-weight: bold; text-transform: uppercase;">Subtotal</td>
                                                    <td align="right" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; color: #9ca3af; font-weight: bold;">${content.subtotal}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #111827; font-weight: bold;">Total</td>
                                                    <td align="right" style="padding-top: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #2563eb; font-weight: bold;">${content.total}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                `;

            default:
                return "";
        }
    };

    const mainContent = blocks.map(renderBlock).join("");

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Email Template</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        
        @media screen and (max-width: 600px) {
            .main-table { width: 100% !important; }
            .content-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc;">
    <!--[if mso]>
    <style type="text/css">
        body, table, td, p, a { font-family: Arial, Helvetica, sans-serif !important; }
    </style>
    <![endif]-->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f6f9fc" role="presentation">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <!-- Main Container table -->
                <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation" class="main-table" style="width: 600px; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td class="content-padding" style="padding: 40px;">
                            ${mainContent}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f3f4f6" style="padding: 30px; text-align: center;">
                            <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #9ca3af; line-height: 1.5; mso-line-height-rule: exactly;">
                                Sent via <strong>Selixer Email Builder</strong><br />
                                Professional Email Solutions
                            </p>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-top: 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="${unsubscribeLink}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Unsubscribe</a>
                                        <span style="color: #d1d5db; margin: 0 10px;">|</span>
                                        <a href="#" style="color: #2563eb; text-decoration: none; font-size: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">View in Browser</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
