'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ============================================
// SEA WITHIN — Tax Tracking & Reports
// ============================================
// Your tax-season command center.
// View summaries, export CSVs, and generate
// tax-ready reports for your accountant.
// ============================================

interface TaxSummary {
  fiscalYear: number;
  grossRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  transactionCount: number;
  refundCount: number;
  byCategory: {
    membership: number;
    product: number;
    donation: number;
  };
  generatedAt: string;
}

export default function TaxTrackingPage() {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTaxSummary();
  }, [selectedYear]);

  const fetchTaxSummary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tracking/tax-summary?year=${selectedYear}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch tax summary');
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
      a.download = `sea-within-tax-report-${selectedYear}.csv`;
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

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-28 pb-24">
        {/* Header */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <a
                href="/admin"
                className="font-body text-[11px] tracking-[2px] uppercase text-white/30 hover:text-golden-400 transition-colors mb-4 inline-block"
              >
                &larr; Back to Dashboard
              </a>
              <h1 className="font-display text-3xl md:text-4xl font-light text-sea-100">
                Tax Report — {selectedYear}
              </h1>
              <p className="font-body text-sm text-white/30 mt-2">
                Your tax-season summary, ready for your accountant.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-3">
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
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="btn-golden text-[11px] px-5 py-2.5 disabled:opacity-40"
              >
                {isExporting ? 'Exporting...' : 'Export CSV for Accountant'}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tax Summary */}
        {summary && (
          <>
            {/* Main Numbers */}
            <ScrollReveal delay={300}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card text-center">
                  <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                    Gross Revenue
                  </p>
                  <p className="font-display text-3xl font-light text-golden-400">
                    {formatCurrency(summary.grossRevenue)}
                  </p>
                  <p className="font-body text-[11px] text-white/20 mt-1">
                    {summary.transactionCount} transactions
                  </p>
                </div>

                <div className="stat-card text-center">
                  <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-2">
                    Refunds
                  </p>
                  <p className="font-display text-3xl font-light text-sea-300">
                    {formatCurrency(summary.totalRefunds)}
                  </p>
                  <p className="font-body text-[11px] text-white/20 mt-1">
                    {summary.refundCount} refunds
                  </p>
                </div>

                <div className="stat-card text-center border-golden-400/20">
                  <p className="font-body text-[11px] tracking-[2px] uppercase text-golden-400/60 mb-2">
                    Net Revenue
                  </p>
                  <p className="font-display text-3xl font-light text-golden-400 golden-glow">
                    {formatCurrency(summary.netRevenue)}
                  </p>
                  <p className="font-body text-[11px] text-golden-400/30 mt-1">
                    Tax-reportable income
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Revenue by Category */}
            <ScrollReveal delay={400}>
              <div className="sanctuary-card p-8 mb-8">
                <h3 className="font-display text-xl font-light text-sea-100 mb-6">
                  Revenue by Category
                </h3>
                <div className="space-y-4">
                  {Object.entries(summary.byCategory).map(([category, amount]) => {
                    const maxCat = Math.max(...Object.values(summary.byCategory), 1);
                    const width = (amount / maxCat) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="font-body text-[11px] tracking-[2px] uppercase text-white/40">
                            {category}
                          </span>
                          <span className="font-body text-sm text-golden-400">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sea-400/60 to-golden-400/60 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.max(width, 1)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Tax Notes */}
            <ScrollReveal delay={500}>
              <div className="sanctuary-card p-8">
                <h3 className="font-display text-xl font-light text-sea-100 mb-4">
                  Tax Season Notes
                </h3>
                <div className="space-y-3 font-body text-sm text-white/40 leading-relaxed">
                  <p>
                    <span className="text-golden-400/60">1.</span> Export the CSV file above and send it to your accountant.
                  </p>
                  <p>
                    <span className="text-golden-400/60">2.</span> The CSV includes: date, transaction ID, customer name, email, type, amount, currency, and status.
                  </p>
                  <p>
                    <span className="text-golden-400/60">3.</span> Net revenue ({formatCurrency(summary.netRevenue)}) is your gross income minus refunds for {selectedYear}.
                  </p>
                  <p>
                    <span className="text-golden-400/60">4.</span> All amounts are in Canadian Dollars (CAD).
                  </p>
                  <p>
                    <span className="text-golden-400/60">5.</span> Keep this report for your records. It was generated on{' '}
                    {new Date(summary.generatedAt).toLocaleDateString('en-CA', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    .
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}

        {isLoading && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-white/20 font-light animate-breathe">
              Loading your report...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
