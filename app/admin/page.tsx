'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Link from 'next/link';

// ============================================
// SEA WITHIN — Admin Dashboard
// ============================================
// Your command center for Sea Within.
// Revenue tracking, member management,
// tax-season reports, and community oversight.
// ============================================

interface Stats {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalMembers: number;
  activeMembers: number;
  revenueByMonth: { month: string; amount: number }[];
  revenueByCategory: { category: string; amount: number }[];
  recentPayments: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [selectedYear]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tracking?year=${selectedYear}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/tracking/export?year=${selectedYear}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sea-within-revenue-${selectedYear}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const currentMonth = new Date().toLocaleString('en-CA', { month: 'long' });

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24">
        {/* Header */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <p className="font-whisper text-sm tracking-[6px] uppercase text-golden-400/40 mb-3">
                command center
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-light text-sea-100">
                Admin Dashboard
              </h1>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-4">
              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                         font-body text-sm text-sea-100 focus:outline-none
                         focus:border-golden-400/40 transition-all cursor-pointer"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year} className="bg-sanctuary-dark">
                    {year}
                  </option>
                ))}
              </select>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="btn-ghost text-[11px] px-5 py-2.5 disabled:opacity-40"
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>

              {/* Tax Report Link */}
              <Link
                href="/admin/tracking"
                className="btn-golden text-[11px] px-5 py-2.5"
              >
                Tax Report
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal delay={300}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Revenue */}
            <div className="stat-card">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                Total Revenue (All Time)
              </p>
              <p className="font-display text-3xl font-light text-golden-400">
                {stats ? formatCurrency(stats.totalRevenue) : '—'}
              </p>
            </div>

            {/* Monthly Revenue */}
            <div className="stat-card">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                Revenue ({currentMonth})
              </p>
              <p className="font-display text-3xl font-light text-sea-300">
                {stats ? formatCurrency(stats.monthlyRevenue) : '—'}
              </p>
            </div>

            {/* Yearly Revenue */}
            <div className="stat-card">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                Revenue ({selectedYear})
              </p>
              <p className="font-display text-3xl font-light text-sea-200">
                {stats ? formatCurrency(stats.yearlyRevenue) : '—'}
              </p>
            </div>

            {/* Members */}
            <div className="stat-card">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                Total Members
              </p>
              <p className="font-display text-3xl font-light text-sea-100">
                {stats ? stats.totalMembers : '—'}
              </p>
              <p className="font-body text-[11px] text-golden-400/50 mt-1">
                {stats ? `${stats.activeMembers} active` : ''}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Revenue by Month Chart */}
        <ScrollReveal delay={400}>
          <div className="sanctuary-card p-8 mb-8">
            <h3 className="font-display text-xl font-light text-sea-100 mb-6">
              Revenue by Month — {selectedYear}
            </h3>
            <div className="flex items-end gap-2 h-48">
              {stats?.revenueByMonth.map((month) => {
                const maxAmount = Math.max(
                  ...stats.revenueByMonth.map((m) => m.amount),
                  1
                );
                const height = (month.amount / maxAmount) * 100;
                return (
                  <div
                    key={month.month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="font-body text-[10px] text-golden-400/60">
                      {month.amount > 0 ? formatCurrency(month.amount) : ''}
                    </span>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-sea-600/60 to-sea-400/40 transition-all duration-500 hover:from-golden-600/60 hover:to-golden-400/40"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <span className="font-body text-[10px] text-white/30">
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Revenue by Category */}
        <ScrollReveal delay={450}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats?.revenueByCategory.map((cat) => (
              <div key={cat.category} className="stat-card text-center">
                <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                  {cat.category}
                </p>
                <p className="font-display text-2xl font-light text-sea-200">
                  {formatCurrency(cat.amount)}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Recent Payments Table */}
        <ScrollReveal delay={500}>
          <div className="sanctuary-card p-8">
            <h3 className="font-display text-xl font-light text-sea-100 mb-6">
              Recent Payments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="font-body text-[10px] tracking-[2px] uppercase text-white/30 text-left pb-3 pr-4">
                      Date
                    </th>
                    <th className="font-body text-[10px] tracking-[2px] uppercase text-white/30 text-left pb-3 pr-4">
                      Member
                    </th>
                    <th className="font-body text-[10px] tracking-[2px] uppercase text-white/30 text-left pb-3 pr-4">
                      Type
                    </th>
                    <th className="font-body text-[10px] tracking-[2px] uppercase text-white/30 text-right pb-3">
                      Amount
                    </th>
                    <th className="font-body text-[10px] tracking-[2px] uppercase text-white/30 text-center pb-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentPayments.map((payment: any) => (
                    <tr
                      key={payment.id}
                      className="border-b border-white/3 hover:bg-white/2 transition-colors"
                    >
                      <td className="font-body text-sm text-white/50 py-3 pr-4">
                        {new Date(payment.created_at).toLocaleDateString('en-CA')}
                      </td>
                      <td className="font-body text-sm text-sea-100 py-3 pr-4">
                        {payment.profiles?.full_name || 'Unknown'}
                      </td>
                      <td className="font-body text-[11px] tracking-[1px] uppercase text-white/40 py-3 pr-4">
                        {payment.type}
                      </td>
                      <td className="font-body text-sm text-golden-400 py-3 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`font-body text-[10px] tracking-[1px] uppercase px-2 py-1 rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-sea-400/10 text-sea-300'
                              : payment.status === 'refunded'
                              ? 'bg-golden-400/10 text-golden-400'
                              : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {(!stats?.recentPayments || stats.recentPayments.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="font-body text-sm text-white/20 text-center py-12"
                      >
                        No payments yet. Your first member is on the way.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
