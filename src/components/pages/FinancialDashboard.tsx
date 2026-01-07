import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Heart, PieChart, Download, Calendar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Transaction {
  id: string;
  transaction_date: string;
  type: 'income' | 'expense';
  category: string;
  amount_cents: number;
  description: string;
}

interface MutualAidFund {
  current_balance_cents: number;
  total_contributions_cents: number;
  total_disbursed_cents: number;
  member_count: number;
}

export default function FinancialDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mutualAidFund, setMutualAidFund] = useState<MutualAidFund | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'year' | 'all'>('month');

  useEffect(() => {
    loadFinancialData();
  }, [timeRange]);

  const loadFinancialData = async () => {
    try {
      // Load transactions
      let query = supabase
        .from('financial_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('transaction_date', monthAgo.toISOString().split('T')[0]);
      } else if (timeRange === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        query = query.gte('transaction_date', yearAgo.toISOString().split('T')[0]);
      }

      const { data: transData, error: transError } = await query;
      if (transError) throw transError;
      setTransactions(transData || []);

      // Load mutual aid fund status
      const { data: fundData, error: fundError } = await supabase
        .from('mutual_aid_fund')
        .select('*')
        .single();

      if (fundError) throw fundError;
      setMutualAidFund(fundData);

      // Load shop orders for revenue
      const { data: ordersData } = await supabase
        .from('shop_orders')
        .select('total_amount_cents, status, created_at')
        .eq('status', 'completed');

      // Auto-create transactions for completed shop orders (if not already tracked)
      // This would ideally be done via trigger, but for MVP we can calculate on-the-fly

    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(cents / 100);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount_cents, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount_cents, 0);

    return { income, expenses, balance: income - expenses };
  };

  const getCategoryBreakdown = (type: 'income' | 'expense') => {
    const byCategory = transactions
      .filter(t => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount_cents;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 categories
  };

  const totals = calculateTotals();
  const incomeByCategory = getCategoryBreakdown('income');
  const expensesByCategory = getCategoryBreakdown('expense');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-500">Financial Transparency</h1>
          <p className="text-gray-400">Community-owned, community-controlled. Every pound tracked.</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(['month', 'year', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range === 'month' ? 'Last Month' : range === 'year' ? 'Last Year' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Total Income */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Income</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{formatCurrency(totals.income)}</div>
          </div>

          {/* Total Expenses */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Expenses</span>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">{formatCurrency(totals.expenses)}</div>
          </div>

          {/* Current Balance */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current Balance</span>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div className={`text-3xl font-bold ${totals.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {formatCurrency(totals.balance)}
            </div>
          </div>

          {/* Mutual Aid Fund */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Mutual Aid Fund</span>
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {mutualAidFund ? formatCurrency(mutualAidFund.current_balance_cents) : '£0.00'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Income Breakdown */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Income Sources
            </h2>
            <div className="space-y-3">
              {incomeByCategory.length > 0 ? (
                incomeByCategory.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{category.replace('_', ' ')}</span>
                    <span className="text-green-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No income recorded yet</div>
              )}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              Expenses
            </h2>
            <div className="space-y-3">
              {expensesByCategory.length > 0 ? (
                expensesByCategory.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{category.replace('_', ' ')}</span>
                    <span className="text-red-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No expenses recorded yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Mutual Aid Fund Details */}
        {mutualAidFund && (
          <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-400" />
              Community Mutual Aid Fund
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Balance</div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatCurrency(mutualAidFund.current_balance_cents)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Contributions</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(mutualAidFund.total_contributions_cents)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Disbursed</div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(mutualAidFund.total_disbursed_cents)}
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-2">
                The mutual aid fund receives 10% of all shop revenue automatically. Members can request financial support during hardship.
              </p>
              <button className="mt-2 bg-purple-500/20 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg font-semibold hover:bg-purple-500/30">
                Request Mutual Aid
              </button>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-yellow-500" />
              Recent Transactions
            </h2>
            <button className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map(trans => (
                    <tr key={trans.id} className="border-b border-gray-800/50">
                      <td className="py-3 text-gray-300 text-sm">
                        {new Date(trans.transaction_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3 text-white">{trans.description}</td>
                      <td className="py-3 text-gray-400 text-sm capitalize">
                        {trans.category.replace('_', ' ')}
                      </td>
                      <td className={`py-3 text-right font-semibold ${
                        trans.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trans.type === 'income' ? '+' : '-'}{formatCurrency(trans.amount_cents)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                      No transactions recorded yet. Financial tracking begins when shop sales are made.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparency Statement */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="font-bold text-blue-400 mb-2">Our Commitment to Transparency</h3>
          <p className="text-gray-300 text-sm">
            BLKOUT is a Community Benefit Society. All financial information is public and verified by our members.
            Every pound is accounted for and allocated according to community decisions through democratic governance.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Shop revenue allocation: 75% creators, 15% platform operations, 10% mutual aid fund
          </p>
        </div>
      </div>
    </div>
  );
}
