import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeEmail,
  sendMembershipConfirmation,
  sendPaymentReceipt,
  sendRenewalReminder,
} from '@/lib/emails';

// ============================================
// SEA WITHIN — Automated Email API
// ============================================
// Handles all automated email sending.
// Called internally by other API routes.
// ============================================

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, to, name, tier, amount, description, transactionId, renewalDate } = body;

  try {
    switch (type) {
      case 'welcome':
        await sendWelcomeEmail(to, name);
        break;

      case 'membership':
        await sendMembershipConfirmation(to, name, tier, amount);
        break;

      case 'receipt':
        await sendPaymentReceipt(to, name, amount, description, transactionId);
        break;

      case 'renewal':
        await sendRenewalReminder(to, name, tier, renewalDate);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
