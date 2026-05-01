/**
 * SEA WITHIN — Automated Email Templates
 * 
 * Beautiful, on-brand email templates that are sent automatically
 * when triggered by user actions (signup, payment, etc.)
 * 
 * Uses Resend for delivery.
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const brandStyles = `
  <style>
    body { font-family: 'Georgia', serif; background-color: #0a1628; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; padding: 40px 0; }
    .logo { font-family: 'Georgia', serif; font-size: 28px; color: #ffffff; letter-spacing: 2px; }
    .tagline { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 8px; letter-spacing: 3px; }
    .content { background: rgba(15, 35, 64, 0.6); border: 1px solid rgba(26, 58, 92, 0.3); border-radius: 16px; padding: 32px; margin: 24px 0; }
    .whisper { font-family: 'Georgia', serif; font-size: 20px; color: rgba(255,255,255,0.7); line-height: 1.6; text-align: center; font-style: italic; }
    .body-text { font-family: system-ui, sans-serif; font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.8; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #d4a574, #c8956c); color: #0a1628; text-decoration: none; border-radius: 50px; font-family: system-ui, sans-serif; font-size: 15px; font-weight: 500; letter-spacing: 1px; }
    .divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, rgba(77, 184, 201, 0.3), transparent); margin: 32px 0; }
    .footer { text-align: center; padding: 24px 0; font-family: system-ui, sans-serif; font-size: 12px; color: rgba(255,255,255,0.2); }
  </style>
`;

export function getWelcomeEmail(name: string): EmailTemplate {
  const firstName = name.split(' ')[0] || 'Beautiful Soul';
  
  return {
    subject: 'Welcome to Sea Within — Your Journey Begins 🌊',
    html: `
      <!DOCTYPE html>
      <html>
      <head>${brandStyles}</head>
      <body style="background-color: #0a1628;">
        <div class="container">
          <div class="header">
            <div class="logo">Sea Within</div>
            <div class="tagline">COME HOME TO YOURSELF</div>
          </div>
          
          <div class="content">
            <p class="whisper">Welcome home, ${firstName}.</p>
            <div class="divider"></div>
            <p class="body-text">
              You just took the most beautiful step — you said yes to yourself.
            </p>
            <p class="body-text">
              Sea Within is not just a platform. It is a sanctuary. A place where you can breathe deeper, 
              feel truer, and reconnect with the part of yourself you may have left behind.
            </p>
            <p class="body-text">
              Here is what awaits you inside:
            </p>
            <p class="body-text">
              🌊 <strong>Guided Rituals</strong> — Somatic practices, breathwork, and elemental journeys<br>
              💡 <strong>Wisdom Board</strong> — A sacred space for sharing reflections and insights<br>
              🤝 <strong>Community</strong> — Beautiful souls walking the same path, together
            </p>
            <div class="divider"></div>
            <p style="text-align: center; padding: 16px 0;">
              <a href="https://seawithinyourself.com/sanctuary" class="btn">Enter Your Sanctuary</a>
            </p>
            <div class="divider"></div>
            <p class="whisper" style="font-size: 16px;">
              Something in you is waking up.<br>
              It's time.
            </p>
          </div>
          
          <div class="footer">
            <p>Sea Within — New Brunswick, Canada</p>
            <p>You received this because you joined the movement.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome home, ${firstName}.

You just took the most beautiful step — you said yes to yourself.

Sea Within is not just a platform. It is a sanctuary. A place where you can breathe deeper, feel truer, and reconnect with the part of yourself you may have left behind.

Here is what awaits you inside:
- Guided Rituals — Somatic practices, breathwork, and elemental journeys
- Wisdom Board — A sacred space for sharing reflections and insights
- Community — Beautiful souls walking the same path, together

Enter your sanctuary: https://seawithinyourself.com/sanctuary

Something in you is waking up. It's time.

— Sea Within`,
  };
}

export function getPaymentReceiptEmail(name: string, amount: number, tier: string): EmailTemplate {
  const firstName = name.split(' ')[0] || 'Beautiful Soul';
  
  return {
    subject: `Your Sea Within Payment Receipt — ${tier} Membership`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>${brandStyles}</head>
      <body style="background-color: #0a1628;">
        <div class="container">
          <div class="header">
            <div class="logo">Sea Within</div>
            <div class="tagline">PAYMENT RECEIPT</div>
          </div>
          
          <div class="content">
            <p class="body-text">Thank you, ${firstName}.</p>
            <p class="body-text">Your ${tier} membership payment has been received.</p>
            <div class="divider"></div>
            <table style="width: 100%; font-family: system-ui, sans-serif;">
              <tr>
                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 8px 0;">Membership</td>
                <td style="color: rgba(255,255,255,0.7); font-size: 14px; padding: 8px 0; text-align: right;">${tier}</td>
              </tr>
              <tr>
                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 8px 0;">Amount</td>
                <td style="color: rgba(77, 184, 201, 1); font-size: 14px; padding: 8px 0; text-align: right;">$${amount.toFixed(2)} CAD</td>
              </tr>
              <tr>
                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 8px 0;">Date</td>
                <td style="color: rgba(255,255,255,0.7); font-size: 14px; padding: 8px 0; text-align: right;">${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 8px 0;">Status</td>
                <td style="color: rgba(168, 230, 207, 1); font-size: 14px; padding: 8px 0; text-align: right;">✓ Paid</td>
              </tr>
            </table>
            <div class="divider"></div>
            <p class="body-text" style="font-size: 13px; color: rgba(255,255,255,0.3);">
              This receipt is for your records. If you have questions, reply to this email.
            </p>
          </div>
          
          <div class="footer">
            <p>Sea Within — New Brunswick, Canada</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Payment Receipt — Sea Within

Thank you, ${firstName}. Your ${tier} membership payment has been received.

Membership: ${tier}
Amount: $${amount.toFixed(2)} CAD
Date: ${new Date().toLocaleDateString('en-CA')}
Status: Paid

— Sea Within`,
  };
}

export function getRenewalReminderEmail(name: string, tier: string, renewalDate: string): EmailTemplate {
  const firstName = name.split(' ')[0] || 'Beautiful Soul';
  
  return {
    subject: `Your Sea Within ${tier} Membership Renews Soon`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>${brandStyles}</head>
      <body style="background-color: #0a1628;">
        <div class="container">
          <div class="header">
            <div class="logo">Sea Within</div>
          </div>
          
          <div class="content">
            <p class="whisper">A gentle reminder, ${firstName}.</p>
            <div class="divider"></div>
            <p class="body-text">
              Your ${tier} membership will renew on <strong>${renewalDate}</strong>.
            </p>
            <p class="body-text">
              If you'd like to make any changes to your membership, you can do so from your profile page.
            </p>
            <p style="text-align: center; padding: 16px 0;">
              <a href="https://seawithinyourself.com/profile" class="btn">Manage Membership</a>
            </p>
            <div class="divider"></div>
            <p class="whisper" style="font-size: 16px;">
              Thank you for being part of this movement.
            </p>
          </div>
          
          <div class="footer">
            <p>Sea Within — New Brunswick, Canada</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `A gentle reminder, ${firstName}.

Your ${tier} membership will renew on ${renewalDate}.

If you'd like to make changes, visit: https://seawithinyourself.com/profile

Thank you for being part of this movement.

— Sea Within`,
  };
}

export function getWisdomApprovedEmail(name: string): EmailTemplate {
  const firstName = name.split(' ')[0] || 'Beautiful Soul';
  
  return {
    subject: 'Your wisdom has been shared ✨',
    html: `
      <!DOCTYPE html>
      <html>
      <head>${brandStyles}</head>
      <body style="background-color: #0a1628;">
        <div class="container">
          <div class="header">
            <div class="logo">Sea Within</div>
          </div>
          
          <div class="content">
            <p class="whisper">${firstName}, your reflection is now live on the Wisdom Board.</p>
            <div class="divider"></div>
            <p class="body-text">
              Thank you for sharing your light with the community. Your words may be exactly what someone needs to hear today.
            </p>
            <p style="text-align: center; padding: 16px 0;">
              <a href="https://seawithinyourself.com/wisdom-board" class="btn">View Wisdom Board</a>
            </p>
          </div>
          
          <div class="footer">
            <p>Sea Within — New Brunswick, Canada</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${firstName}, your reflection is now live on the Wisdom Board.

Thank you for sharing your light with the community.

View the Wisdom Board: https://seawithinyourself.com/wisdom-board

— Sea Within`,
  };
}
