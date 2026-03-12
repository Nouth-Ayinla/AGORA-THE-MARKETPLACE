/**
 * ╔══════════════════════════════════════════════════════════╗
 *  AGORA MARKETPLACE — Waitlist Google Apps Script
 * ╠══════════════════════════════════════════════════════════╣
 *
 *  SETUP INSTRUCTIONS (read carefully — takes ~5 minutes):
 *
 *  1. Go to https://script.google.com → click "New project"
 *  2. Delete everything in the editor, paste this entire file
 *  3. Create a Google Sheet at https://sheets.google.com
 *     Copy its ID from the URL:
 *     https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
 *     Paste that ID into SPREADSHEET_ID below
 *  4. Click "Deploy" → "New deployment"
 *       Type: Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *     → Click "Deploy" → authorise the permissions
 *  5. Copy the Web App URL shown after deployment
 *     Paste it into script.js → replace APPS_SCRIPT_URL
 *
 *  That's it. The sheet and headers are created automatically
 *  on the first submission.
 *
 * ╚══════════════════════════════════════════════════════════╝
 */

// ─── CONFIG ────────────────────────────────────────────────
const SPREADSHEET_ID = '1cfA56cCWlTurF5MktQYPZww2WqX8c39tXcrl4WezkW4';
const SHEET_NAME     = 'Waitlist';
const SENDER_NAME    = 'Agora Marketplace';
const REPLY_TO       = 'hello@agora.ng';
// ───────────────────────────────────────────────────────────


/**
 * Handles POST requests from the website forms.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    sendConfirmationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error(err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Simple health-check for GET requests (open URL in browser to test).
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Agora Waitlist API is live 🚀' }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ─── SHEET ─────────────────────────────────────────────────

function saveToSheet(data) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet + styled headers on first run
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'University', 'Role', 'Source'];
    sheet.appendRow(headers);

    const headerRow = sheet.getRange(1, 1, 1, headers.length);
    headerRow.setBackground('#FF6B35');
    headerRow.setFontColor('#FFFFFF');
    headerRow.setFontWeight('bold');
    headerRow.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(4, 220); // Email
  }

  sheet.appendRow([
    new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
    data.name        || '',
    data.phone       || '',
    data.email       || '',
    data.university  || '',
    data.role        || '',
    data.source      || 'website',
  ]);
}


// ─── EMAIL ─────────────────────────────────────────────────

function sendConfirmationEmail(data) {
  if (!data.email) return;

  const firstName = data.name ? data.name.split(' ')[0] : 'Hustler';
  const subject   = `You're on the Agora waitlist! 🎉`;

  const plainText =
    `Hey ${firstName}! 🎉\n\n` +
    `You're officially on the Agora waitlist — Nigeria's first marketplace built for student hustlers.\n\n` +
    `WHAT'S NEXT:\n` +
    `✅ Your spot is secured. No action needed right now.\n` +
    `📧 We'll email you the moment beta access opens — waitlist members get in first.\n` +
    `🏆 Your early bird perks are locked: 0% commission for 3 months + Founding Member badge.\n\n` +
    `WHAT YOU'RE GETTING:\n` +
    `💸 Only 10% commission (vs 20% on Jumia/Konga)\n` +
    `⚡ 3-day payouts — not the usual 30-day wait\n` +
    `🎓 Exam Mode — pause your shop with one tap\n` +
    `🪪 No CAC registration needed — just your student ID\n\n` +
    `Questions? Reply to this email or reach us at hello@agora.ng\n\n` +
    `— The Agora Team 🇳🇬`;

  const htmlBody = buildEmailHtml(firstName);

  GmailApp.sendEmail(data.email, subject, plainText, {
    htmlBody:  htmlBody,
    name:      SENDER_NAME,
    replyTo:   REPLY_TO,
  });
}

function buildEmailHtml(firstName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Welcome to Agora</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Helvetica Neue',Arial,sans-serif;-webkit-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- ── HEADER ── -->
    <tr>
      <td style="background:linear-gradient(135deg,#FF6B35 0%,#FF8C5A 100%);padding:36px 40px 32px;text-align:center;">
        <div style="margin-bottom:20px;">
          <span style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:14px;padding:10px 18px;">
            <span style="font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;">🏪 Agora</span>
          </span>
        </div>
        <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">🎉</div>
        <h1 style="margin:0;font-size:26px;font-weight:900;color:#FFFFFF;line-height:1.25;">
          You're officially on<br/>the waitlist!
        </h1>
      </td>
    </tr>

    <!-- ── BODY ── -->
    <tr>
      <td style="padding:36px 40px 28px;">

        <p style="margin:0 0 18px;font-size:16px;color:#4A5568;line-height:1.6;">
          Hey <strong style="color:#0F172A;">${firstName}</strong> 👋
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#4A5568;line-height:1.7;">
          Welcome to <strong style="color:#FF6B35;">Agora</strong> — Nigeria's first marketplace built for student hustlers like you. You're now part of a growing community of students who've decided they don't have to choose between their books and their bag. 💪
        </p>

        <!-- What's next -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7F4;border-radius:14px;border:1px solid #FFD4C2;margin:0 0 24px;">
          <tr><td style="padding:22px 24px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:800;color:#FF6B35;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:7px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:26px;font-size:16px;vertical-align:top;padding-top:1px;">✅</td>
                  <td style="font-size:14px;color:#4A5568;line-height:1.55;padding-left:8px;"><strong style="color:#0F172A;">Your spot is secured.</strong> No action needed from you right now.</td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:7px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:26px;font-size:16px;vertical-align:top;padding-top:1px;">📧</td>
                  <td style="font-size:14px;color:#4A5568;line-height:1.55;padding-left:8px;"><strong style="color:#0F172A;">Watch your inbox.</strong> Beta invites go to waitlist members first — we'll email you the moment access opens.</td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:7px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:26px;font-size:16px;vertical-align:top;padding-top:1px;">🏆</td>
                  <td style="font-size:14px;color:#4A5568;line-height:1.55;padding-left:8px;"><strong style="color:#0F172A;">Early bird perks locked in.</strong> First 1,000 waitlisters get 0% commission for 3 months + a Founding Member badge.</td>
                </tr></table>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <!-- Perks grid -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
          <tr>
            <td width="50%" style="padding:0 6px 12px 0;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border-radius:12px;border:1px solid #BBF7D0;">
                <tr><td style="padding:16px;text-align:center;">
                  <div style="font-size:28px;margin-bottom:6px;">💸</div>
                  <p style="margin:0;font-size:12px;font-weight:800;color:#15803D;">Only 10% commission</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#6B7280;">vs 20% on Jumia/Konga</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding:0 0 12px 6px;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border-radius:12px;border:1px solid #BFDBFE;">
                <tr><td style="padding:16px;text-align:center;">
                  <div style="font-size:28px;margin-bottom:6px;">⚡</div>
                  <p style="margin:0;font-size:12px;font-weight:800;color:#1D4ED8;">3-day payouts</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#6B7280;">Not the usual 30-day wait</p>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding:0 6px 0 0;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7F4;border-radius:12px;border:1px solid #FFD4C2;">
                <tr><td style="padding:16px;text-align:center;">
                  <div style="font-size:28px;margin-bottom:6px;">🎓</div>
                  <p style="margin:0;font-size:12px;font-weight:800;color:#FF6B35;">Exam Mode</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#6B7280;">Pause your shop anytime</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding:0 0 0 6px;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;border-radius:12px;border:1px solid #DDD6FE;">
                <tr><td style="padding:16px;text-align:center;">
                  <div style="font-size:28px;margin-bottom:6px;">🪪</div>
                  <p style="margin:0;font-size:12px;font-weight:800;color:#7C3AED;">No CAC needed</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#6B7280;">Just your student ID</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding-bottom:8px;">
            <a href="https://www.agora.ng"
               style="display:inline-block;background:linear-gradient(135deg,#FF6B35,#FF8C5A);color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;padding:15px 44px;border-radius:50px;box-shadow:0 4px 16px rgba(255,107,53,0.35);">
              Visit Agora →
            </a>
          </td></tr>
        </table>
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:#F8FAFC;padding:22px 40px;border-top:1px solid #E2E8F0;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0F172A;">Agora Marketplace</p>
        <p style="margin:0 0 10px;font-size:12px;color:#94A3B8;">Nigeria's marketplace for student hustlers 🇳🇬</p>
        <p style="margin:0 0 6px;font-size:11px;color:#CBD5E1;">
          Questions? Reply to this email or reach us at
          <a href="mailto:hello@agora.ng" style="color:#FF6B35;text-decoration:none;">hello@agora.ng</a>
        </p>
        <p style="margin:0;font-size:11px;color:#CBD5E1;">
          You received this because you joined the Agora waitlist.
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}
