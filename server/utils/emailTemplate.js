const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildEmailTemplate = ({
  preheader = 'CleanWash Laundry Hub',
  title,
  badge,
  introHtml,
  bodyHtml,
  ctaText,
  ctaUrl,
  accent = '#0891b2',
  footerNote = 'Need help? Reply to this email and our team will assist you.',
}) => {
  const ctaBlock = ctaText && ctaUrl
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 10px;">
        <tr>
          <td style="border-radius: 999px; background: ${accent};">
            <a href="${escapeHtml(ctaUrl)}" style="display:inline-block; padding: 14px 22px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 999px;">
              ${escapeHtml(ctaText)}
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0; padding:0; background:#e6f6f8; font-family: Arial, Helvetica, sans-serif; color:#0f172a;">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
          ${escapeHtml(preheader)}
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(180deg, #ecfeff 0%, #f8fafc 100%); padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0f172a 0%, #155e75 100%); padding: 28px 32px;">
                    <div style="color:#67e8f9; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">CleanWash Laundry Hub</div>
                    ${badge ? `<div style="display:inline-block; margin-top: 14px; padding: 6px 12px; border-radius: 999px; background: rgba(103, 232, 249, 0.14); color:#cffafe; font-size: 12px; font-weight: 700;">${escapeHtml(badge)}</div>` : ''}
                    <div style="color:#ffffff; font-size: 26px; line-height: 1.25; font-weight: 700; margin-top: 10px;">${escapeHtml(title)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <div style="font-size: 16px; line-height: 1.7; color: #334155;">
                      ${introHtml || ''}
                      ${bodyHtml}
                    </div>
                    ${ctaBlock}
                    <div style="margin-top: 30px; padding-top: 18px; border-top: 1px solid #e2e8f0; color:#64748b; font-size: 13px; line-height: 1.6;">
                      ${escapeHtml(footerNote)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

module.exports = { buildEmailTemplate, escapeHtml };
