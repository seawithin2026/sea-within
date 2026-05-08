/**
 * SEA WITHIN — Automated Email Sender
 * 
 * Sends beautiful, branded emails automatically using Resend.
 * Triggered by user actions: signup, payment, renewal, etc.
 */

import { Resend } from 'resend';
import {
  getWelcomeEmail,
  getPaymentReceiptEmail,
  getRenewalReminderEmail,
  getWisdomApprovedEmail,
} from './templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'hello@seawithinyourself.com';

interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendWelcomeEmail(toEmail: string, name: string): Promise<SendResult> {
  try {
    const template = getWelcomeEmail(name);
    const { data, error } = await resend.emails.send({
      from: `Sea Within <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('[Email] Welcome email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Welcome email sent to ${toEmail}, ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Welcome email error:', err);
    return { success: false, error: 'Failed to send welcome email' };
  }
}

export async function sendPaymentReceipt(
  toEmail: string,
  name: string,
  amount: number,
  tier: string
): Promise<SendResult> {
  try {
    const template = getPaymentReceiptEmail(name, amount, tier);
    const { data, error } = await resend.emails.send({
      from: `Sea Within <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('[Email] Payment receipt failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    return { success: false, error: 'Failed to send payment receipt' };
  }
}

export async function sendRenewalReminder(
  toEmail: string,
  name: string,
  tier: string,
  renewalDate: string
): Promise<SendResult> {
  try {
    const template = getRenewalReminderEmail(name, tier, renewalDate);
    const { data, error } = await resend.emails.send({
      from: `Sea Within <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    return { success: false, error: 'Failed to send renewal reminder' };
  }
}

export async function sendWisdomApprovedEmail(toEmail: string, name: string): Promise<SendResult> {
  try {
    const template = getWisdomApprovedEmail(name);
    const { data, error } = await resend.emails.send({
      from: `Sea Within <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    return { success: false, error: 'Failed to send wisdom approved email' };
  }
}
