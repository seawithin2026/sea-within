import { NextRequest, NextResponse } from 'next/server';
import { getTaxSummary } from '@/lib/tracking';

// ============================================
// SEA WITHIN — Tax Summary API
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

  try {
    const summary = await getTaxSummary(year);
    return NextResponse.json(summary);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate tax summary' },
      { status: 500 }
    );
  }
}
