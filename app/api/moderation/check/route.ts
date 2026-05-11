// /app/api/moderation/check/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/lib/moderation';

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

    const result = moderateContent(content);

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
