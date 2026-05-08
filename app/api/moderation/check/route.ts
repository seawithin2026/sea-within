import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/lib/moderation';

/**
 * POST /api/moderation/check
 * Checks content against the Sea Within moderation system.
 * Used by Wisdom Board and Community Chat before publishing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, type } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { approved: false, message: 'Content is required.' },
        { status: 400 }
      );
    }

    // Run moderation
    const result = moderateContent(content);

    // Log moderation result for admin review
    console.log(
      `[Moderation] Type: ${type}, Approved: ${result.approved}, Reason: ${result.reason}`
    );

    return NextResponse.json({
      approved: result.approved,
      message: result.message,
    });
  } catch (error) {
    console.error('[Moderation Error]', error);
    return NextResponse.json(
      { approved: false, message: 'Moderation check failed. Please try again.' },
      { status: 500 }
    );
  }
}
