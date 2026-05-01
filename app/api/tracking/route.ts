import { NextRequest, NextResponse } from 'next/server';
import { getRevenueStats, exportRevenueCSV, getTaxSummary } from '@/lib/tracking';

// ============================================
// SEA WITHIN — Revenue & Tax Tracking API
// ============================================

// GET /api/tracking?year=2026
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

  try {
    const stats = await getRevenueStats(year);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
