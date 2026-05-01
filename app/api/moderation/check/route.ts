import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/lib/moderation/moderator';

/**
 * POST /api/moderation/check
 * Checks content against the positive-vibe moderation system.
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
    console.log(`[Moderation] Type: ${type}, Approved: ${result.approved}, Score: ${result.score}`);

    return NextResponse.json({
      approved: result.approved,
      score: result.score,
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
