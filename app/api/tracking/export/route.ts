import { NextRequest, NextResponse } from 'next/server';
import { exportRevenueCSV } from '@/lib/tracking';

// ============================================
// SEA WITHIN — CSV Export for Tax Season
// ============================================
// Downloads a CSV file of all completed payments
// for a given fiscal year. Send this to your accountant.
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

  try {
    const csv = await exportRevenueCSV(year);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sea-within-revenue-${year}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to export CSV' },
      { status: 500 }
    );
  }
}
