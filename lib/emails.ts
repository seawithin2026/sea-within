// ============================================
// SEA WITHIN — Automated Email System
// ============================================
// Uses Resend for transactional emails

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'hello@seawithinyourself.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Sea Within';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seawithinyourself.com';

/**
 * Send an email using Resend
 */
async function sendEmail({ to, subject, html }: EmailOptions) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${SITE_NAME} <${EMAIL_FROM}>`,
      to,
      subject,
      html: wrapInTemplate(html),
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send email: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Wrap email content in the Sea Within email template
 */
function wrapInTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#0a1628; font-family:'Georgia',serif;">
      <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center; padding:30px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
          <h1 style="color:#e5ad43; font-size:28px; font-weight:300; letter-spacing:3px; margin:0;">
            SEA WITHIN
          </h1>
          <p style="color:rgba(255,255,255,0.5); font-size:12px; letter-spacing:2px; margin-top:8px;">
            YOUR SANCTUARY AWAITS
          </p>
        </div>

        <!-- Content -->
        <div style="padding:40px 0; color:#d0f0f4; font-size:16px; line-height:1.8;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="text-align:center; padding:30px 0; border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:rgba(255,255,255,0.4); font-size:13px; margin:0;">
            With warmth and light,<br>
            <span style="color:#e5ad43;">Sea Within</span>
          </p>
          <p style="color:rgba(255,255,255,0.2); font-size:11px; margin-top:20px;">
            <a href="${SITE_URL}" style="color:rgba(255,255,255,0.3);">seawithinyourself.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================
// Pre-built Email Templates
// ============================================

/**
 * Welcome email — sent when a new user joins
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to Sea Within — Your journey begins now',
    html: `
      <h2 style="color:#e5ad43; font-weight:300; font-size:22px;">
        Welcome, ${name}.
      </h2>
      <p>
        Something in you knew it was time.
      </p>
      <p>
        You've just stepped into Sea Within — a sanctuary for the ones
        who are ready to feel again. To breathe deeper. To live truer.
        To come home to the part of themselves they left behind.
      </p>
      <p>
        This is your space. Your journey. Your awakening.
      </p>
      <p>
        Inside, you'll find:
      </p>
      <ul style="color:#a1e0e9; padding-left:20px;">
        <li style="margin-bottom:8px;">Guided rituals for your inner sanctuary</li>
        <li style="margin-bottom:8px;">A Wisdom Board to share and receive light</li>
        <li style="margin-bottom:8px;">A community of souls walking the same path</li>
        <li style="margin-bottom:8px;">Nature-infused meditations and practices</li>
      </ul>
      <p>
        Take a breath. You're home now.
      </p>
      <div style="text-align:center; padding:30px 0;">
        <a href="${SITE_URL}/sanctuary"
           style="background:linear-gradient(135deg, #e5ad43, #dd9527);
                  color:#0a1628; padding:14px 40px; text-decoration:none;
                  font-size:14px; letter-spacing:2px; border-radius:4px;">
          ENTER YOUR SANCTUARY
        </a>
      </div>
    `,
  });
}

/**
 * Membership confirmation email
 */
export async function sendMembershipConfirmation(
  to: string, name: string, tier: string, amount: number
) {
  return sendEmail({
    to,
    subject: `Your ${tier} membership is active — Sea Within`,
    html: `
      <h2 style="color:#e5ad43; font-weight:300; font-size:22px;">
        Beautiful soul, ${name}.
      </h2>
      <p>
        Your <strong style="color:#e5ad43;">${tier}</strong> membership
        is now active.
      </p>
      <p style="background:rgba(255,255,255,0.05); padding:20px; border-radius:8px; text-align:center;">
        <span style="font-size:12px; color:rgba(255,255,255,0.5); letter-spacing:2px;">AMOUNT</span><br>
        <span style="font-size:28px; color:#e5ad43;">$${amount.toFixed(2)} CAD</span>
      </p>
      <p>
        You now have full access to your sanctuary —
        the rituals, the wisdom board, the community,
        and everything that awaits you inside.
      </p>
      <div style="text-align:center; padding:30px 0;">
        <a href="${SITE_URL}/sanctuary"
           style="background:linear-gradient(135deg, #e5ad43, #dd9527);
                  color:#0a1628; padding:14px 40px; text-decoration:none;
                  font-size:14px; letter-spacing:2px; border-radius:4px;">
          ENTER YOUR SANCTUARY
        </a>
      </div>
    `,
  });
}

/**
 * Payment receipt email
 */
export async function sendPaymentReceipt(
  to: string, name: string, amount: number, description: string, transactionId: string
) {
  return sendEmail({
    to,
    subject: 'Payment receipt — Sea Within',
    html: `
      <h2 style="color:#e5ad43; font-weight:300; font-size:22px;">
        Payment Received
      </h2>
      <p>Thank you, ${name}.</p>
      <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:8px;">
        <table style="width:100%; color:#d0f0f4; font-size:14px;">
          <tr>
            <td style="padding:8px 0; color:rgba(255,255,255,0.5);">Description</td>
            <td style="padding:8px 0; text-align:right;">${description}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:rgba(255,255,255,0.5);">Amount</td>
            <td style="padding:8px 0; text-align:right; color:#e5ad43; font-size:18px;">$${amount.toFixed(2)} CAD</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:rgba(255,255,255,0.5);">Transaction ID</td>
            <td style="padding:8px 0; text-align:right; font-size:12px;">${transactionId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:rgba(255,255,255,0.5);">Date</td>
            <td style="padding:8px 0; text-align:right;">${new Date().toLocaleDateString('en-CA')}</td>
          </tr>
        </table>
      </div>
      <p style="font-size:13px; color:rgba(255,255,255,0.4); margin-top:20px;">
        Please keep this email for your records.
      </p>
    `,
  });
}

/**
 * Renewal reminder email
 */
export async function sendRenewalReminder(
  to: string, name: string, tier: string, renewalDate: string
) {
  return sendEmail({
    to,
    subject: 'Your membership renews soon — Sea Within',
    html: `
      <h2 style="color:#e5ad43; font-weight:300; font-size:22px;">
        A gentle reminder, ${name}.
      </h2>
      <p>
        Your <strong style="color:#e5ad43;">${tier}</strong> membership
        will renew on <strong>${renewalDate}</strong>.
      </p>
      <p>
        No action is needed — your journey continues seamlessly.
      </p>
      <p>
        If you'd like to make any changes to your membership,
        you can do so from your profile.
      </p>
      <div style="text-align:center; padding:30px 0;">
        <a href="${SITE_URL}/profile"
           style="background:rgba(255,255,255,0.1);
                  color:#d0f0f4; padding:14px 40px; text-decoration:none;
                  font-size:14px; letter-spacing:2px; border-radius:4px;
                  border:1px solid rgba(255,255,255,0.2);">
          MANAGE MEMBERSHIP
        </a>
      </div>
    `,
  });
}

/**
 * Password reset email
 */
export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  return sendEmail({
    to,
    subject: 'Reset your password — Sea Within',
    html: `
      <h2 style="color:#e5ad43; font-weight:300; font-size:22px;">
        Password Reset
      </h2>
      <p>Hello, ${name}.</p>
      <p>
        We received a request to reset your password.
        Click the button below to create a new one.
      </p>
      <div style="text-align:center; padding:30px 0;">
        <a href="${resetLink}"
           style="background:linear-gradient(135deg, #e5ad43, #dd9527);
                  color:#0a1628; padding:14px 40px; text-decoration:none;
                  font-size:14px; letter-spacing:2px; border-radius:4px;">
          RESET PASSWORD
        </a>
      </div>
      <p style="font-size:13px; color:rgba(255,255,255,0.4);">
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
  });
}
