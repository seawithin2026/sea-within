// ============================================
// SEA WITHIN — Revenue & Tax Tracking System
// ============================================

import { createServerSupabase } from './supabase';

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalMembers: number;
  activeMembers: number;
  revenueByMonth: { month: string; amount: number }[];
  revenueByCategory: { category: string; amount: number }[];
  recentPayments: any[];
}

/**
 * Get comprehensive revenue statistics for the admin dashboard
 */
export async function getRevenueStats(year?: number): Promise<RevenueStats> {
  const supabase = createServerSupabase();
  const currentYear = year || new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Total revenue (all time)
  const { data: allPayments } = await supabase
    .from('payments')
    .select('amount, created_at, type, status')
    .eq('status', 'completed');

  const totalRevenue = (allPayments || []).reduce(
    (sum, p) => sum + p.amount, 0
  );

  // Monthly revenue (current month)
  const monthStart = new Date(currentYear, currentMonth - 1, 1).toISOString();
  const monthEnd = new Date(currentYear, currentMonth, 0).toISOString();

  const { data: monthPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd);

  const monthlyRevenue = (monthPayments || []).reduce(
    (sum, p) => sum + p.amount, 0
  );

  // Yearly revenue
  const yearStart = new Date(currentYear, 0, 1).toISOString();
  const yearEnd = new Date(currentYear, 11, 31).toISOString();

  const { data: yearPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', yearStart)
    .lte('created_at', yearEnd);

  const yearlyRevenue = (yearPayments || []).reduce(
    (sum, p) => sum + p.amount, 0
  );

  // Member counts
  const { count: totalMembers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: activeMembers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('membership_tier', 'free');

  // Revenue by month (for charts)
  const revenueByMonth: { month: string; amount: number }[] = [];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  for (let m = 0; m < 12; m++) {
    const mStart = new Date(currentYear, m, 1).toISOString();
    const mEnd = new Date(currentYear, m + 1, 0).toISOString();

    const { data: mPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', mStart)
      .lte('created_at', mEnd);

    revenueByMonth.push({
      month: monthNames[m],
      amount: (mPayments || []).reduce((sum, p) => sum + p.amount, 0),
    });
  }

  // Revenue by category
  const categories = ['membership', 'product', 'donation'];
  const revenueByCategory = await Promise.all(
    categories.map(async (category) => {
      const { data } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .eq('type', category)
        .gte('created_at', yearStart)
        .lte('created_at', yearEnd);

      return {
        category,
        amount: (data || []).reduce((sum, p) => sum + p.amount, 0),
      };
    })
  );

  // Recent payments
  const { data: recentPayments } = await supabase
    .from('payments')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(20);

  return {
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalMembers: totalMembers || 0,
    activeMembers: activeMembers || 0,
    revenueByMonth,
    revenueByCategory,
    recentPayments: recentPayments || [],
  };
}

/**
 * Export revenue data as CSV for tax season
 */
export async function exportRevenueCSV(year: number): Promise<string> {
  const supabase = createServerSupabase();

  const yearStart = new Date(year, 0, 1).toISOString();
  const yearEnd = new Date(year, 11, 31).toISOString();

  const { data: payments } = await supabase
    .from('payments')
    .select('*, profiles(full_name, email)')
    .eq('status', 'completed')
    .gte('created_at', yearStart)
    .lte('created_at', yearEnd)
    .order('created_at', { ascending: true });

  // Build CSV
  const headers = [
    'Date', 'Transaction ID', 'Customer Name', 'Customer Email',
    'Type', 'Amount', 'Currency', 'Status', 'Description'
  ];

  const rows = (payments || []).map(p => [
    new Date(p.created_at).toLocaleDateString('en-CA'),
    p.id,
    p.profiles?.full_name || 'N/A',
    p.profiles?.email || 'N/A',
    p.type,
    p.amount.toFixed(2),
    p.currency,
    p.status,
    p.description || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

/**
 * Generate a tax summary for a given fiscal year
 */
export async function getTaxSummary(year: number) {
  const supabase = createServerSupabase();

  const yearStart = new Date(year, 0, 1).toISOString();
  const yearEnd = new Date(year, 11, 31).toISOString();

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, type, created_at, status')
    .gte('created_at', yearStart)
    .lte('created_at', yearEnd);

  const completed = (payments || []).filter(p => p.status === 'completed');
  const refunded = (payments || []).filter(p => p.status === 'refunded');

  return {
    fiscalYear: year,
    grossRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
    totalRefunds: refunded.reduce((sum, p) => sum + p.amount, 0),
    netRevenue: completed.reduce((sum, p) => sum + p.amount, 0) -
                refunded.reduce((sum, p) => sum + p.amount, 0),
    transactionCount: completed.length,
    refundCount: refunded.length,
    byCategory: {
      membership: completed.filter(p => p.type === 'membership')
        .reduce((sum, p) => sum + p.amount, 0),
      product: completed.filter(p => p.type === 'product')
        .reduce((sum, p) => sum + p.amount, 0),
      donation: completed.filter(p => p.type === 'donation')
        .reduce((sum, p) => sum + p.amount, 0),
    },
    generatedAt: new Date().toISOString(),
  };
}
