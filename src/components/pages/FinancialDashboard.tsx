import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Heart, Calendar, AlertTriangle, CheckCircle, Download, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface BudgetLine {
  id: string;
  line_type: 'income' | 'expense';
  category: string;
  expected_amount_gbp: number;
  actual_amount_gbp: number;
  variance_gbp: number;
  variance_percentage: number;
  notes: string;
}

interface BudgetPeriod {
  id: string;
  name: string;
  period_type: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  status: string;
}

interface Transaction {
  id: string;
  transaction_date: string;
  type: 'income' | 'expense';
  category: string;
  amount_gbp: number;
  description: string;
}

export default function FinancialDashboard() {
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod | null>(null);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadBudgetLines(selectedPeriod.id);
      loadTransactions(selectedPeriod.start_date, selectedPeriod.end_date);
    }
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      // Load budget periods
      const { data: periodsData, error: periodsError } = await supabase
        .from('budget_periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (periodsError) throw periodsError;
      setBudgetPeriods(periodsData || []);

      // Select first period (most recent)
      if (periodsData && periodsData.length > 0) {
        setSelectedPeriod(periodsData[0]);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBudgetLines = async (periodId: string) => {
    try {
      const { data, error } = await supabase
        .from('budget_lines')
        .select('*')
        .eq('period_id', periodId)
        .order('line_type', { ascending: false })
        .order('category');

      if (error) throw error;
      setBudgetLines(data || []);
    } catch (error) {
      console.error('Error loading budget lines:', error);
    }
  };

  const loadTransactions = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotals = (type: 'income' | 'expense') => {
    const lines = budgetLines.filter(l => l.line_type === type);
    const expected = lines.reduce((sum, l) => sum + parseFloat(l.expected_amount_gbp.toString()), 0);
    const actual = lines.reduce((sum, l) => sum + parseFloat(l.actual_amount_gbp.toString()), 0);
    const variance = actual - expected;
    const variancePercent = expected > 0 ? (variance / expected * 100) : 0;

    return { expected, actual, variance, variancePercent };
  };

  const incomeTotals = calculateTotals('income');
  const expenseTotals = calculateTotals('expense');
  const netActual = incomeTotals.actual - expenseTotals.actual;
  const netExpected = incomeTotals.expected - expenseTotals.expected;
  const netVariance = netActual - netExpected;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading financial dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-500">Financial Management</h1>
          <p className="text-gray-400">Budget planning, tracking, and transparency for BLKOUT UK</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {budgetPeriods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedPeriod?.id === period.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period.name}
            </button>
          ))}
          <button className="px-4 py-2 rounded-lg font-semibold bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30">
            <Plus className="w-4 h-4 inline mr-1" />
            New Period
          </button>
        </div>

        {selectedPeriod && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {/* Expected Income */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Expected Income</div>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(incomeTotals.expected)}</div>
              </div>

              {/* Actual Income */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Actual Income</div>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(incomeTotals.actual)}</div>
                <div className={`text-xs mt-1 ${incomeTotals.variance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {incomeTotals.variance >= 0 ? '+' : ''}{formatCurrency(incomeTotals.variance)} ({incomeTotals.variancePercent.toFixed(1)}%)
                </div>
              </div>

              {/* Expected Expenses */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Budgeted Expenses</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(expenseTotals.expected)}</div>
              </div>

              {/* Actual Expenses */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Actual Expenses</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(expenseTotals.actual)}</div>
                <div className={`text-xs mt-1 ${expenseTotals.variance <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {expenseTotals.variance >= 0 ? '+' : ''}{formatCurrency(expenseTotals.variance)} ({expenseTotals.variancePercent.toFixed(1)}%)
                </div>
              </div>
            </div>

            {/* Net Position */}
            <div className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Expected Net</div>
                  <div className={`text-3xl font-bold ${netExpected >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatCurrency(netExpected)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Actual Net</div>
                  <div className={`text-3xl font-bold ${netActual >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatCurrency(netActual)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Variance</div>
                  <div className={`text-3xl font-bold ${netVariance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netVariance >= 0 ? '+' : ''}{formatCurrency(netVariance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget vs Actual Tables */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Income Budget */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  Income Budget
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-right">Expected</th>
                      <th className="pb-2 text-right">Actual</th>
                      <th className="pb-2 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetLines.filter(l => l.line_type === 'income').map(line => (
                      <tr key={line.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-gray-300 capitalize">{line.category.replace('_', ' ')}</td>
                        <td className="py-2 text-right text-white">{formatCurrency(parseFloat(line.expected_amount_gbp.toString()))}</td>
                        <td className="py-2 text-right text-green-400 font-semibold">{formatCurrency(parseFloat(line.actual_amount_gbp.toString()))}</td>
                        <td className={`py-2 text-right font-semibold ${line.variance_gbp >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {line.variance_gbp >= 0 ? '+' : ''}{formatCurrency(parseFloat(line.variance_gbp.toString()))}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t-2 border-gray-700">
                      <td className="py-2 text-white">Total Income</td>
                      <td className="py-2 text-right text-white">{formatCurrency(incomeTotals.expected)}</td>
                      <td className="py-2 text-right text-green-400">{formatCurrency(incomeTotals.actual)}</td>
                      <td className={`py-2 text-right ${incomeTotals.variance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {incomeTotals.variance >= 0 ? '+' : ''}{formatCurrency(incomeTotals.variance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expense Budget */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  Expense Budget
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-right">Budgeted</th>
                      <th className="pb-2 text-right">Actual</th>
                      <th className="pb-2 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetLines.filter(l => l.line_type === 'expense').map(line => (
                      <tr key={line.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-gray-300 capitalize">{line.category.replace('_', ' ')}</td>
                        <td className="py-2 text-right text-white">{formatCurrency(parseFloat(line.expected_amount_gbp.toString()))}</td>
                        <td className="py-2 text-right text-red-400 font-semibold">{formatCurrency(parseFloat(line.actual_amount_gbp.toString()))}</td>
                        <td className={`py-2 text-right font-semibold ${line.variance_gbp <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {line.variance_gbp >= 0 ? '+' : ''}{formatCurrency(parseFloat(line.variance_gbp.toString()))}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t-2 border-gray-700">
                      <td className="py-2 text-white">Total Expenses</td>
                      <td className="py-2 text-right text-white">{formatCurrency(expenseTotals.expected)}</td>
                      <td className="py-2 text-right text-red-400">{formatCurrency(expenseTotals.actual)}</td>
                      <td className={`py-2 text-right ${expenseTotals.variance <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {expenseTotals.variance >= 0 ? '+' : ''}{formatCurrency(expenseTotals.variance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variance Alerts */}
            {budgetLines.some(l => Math.abs(l.variance_percentage) > 20) && (
              <div className="mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-400 mb-2">Budget Variance Alerts</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {budgetLines
                        .filter(l => Math.abs(l.variance_percentage) > 20)
                        .map(line => (
                          <li key={line.id}>
                            <strong className="capitalize">{line.category.replace('_', ' ')}</strong>:
                            {' '}{line.variance_percentage > 0 ? 'Over' : 'Under'} budget by{' '}
                            <span className={line.variance_percentage > 0 ? 'text-red-400' : 'text-green-400'}>
                              {Math.abs(line.variance_percentage).toFixed(1)}%
                            </span>
                            {' '}({formatCurrency(Math.abs(parseFloat(line.variance_gbp.toString())))})
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  Recent Transactions
                </h2>
                <button className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map(trans => (
                        <tr key={trans.id} className="border-b border-gray-800/50">
                          <td className="py-2 text-gray-300">
                            {new Date(trans.transaction_date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-2 text-white">{trans.description}</td>
                          <td className="py-2 text-gray-400 capitalize">{trans.category.replace('_', ' ')}</td>
                          <td className={`py-2 text-right font-semibold ${
                            trans.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {trans.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(trans.amount_gbp))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                          No transactions recorded for this period yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Budget Health Indicators */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${
                netActual >= netExpected
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {netActual >= netExpected ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-semibold ${netActual >= netExpected ? 'text-green-400' : 'text-red-400'}`}>
                    {netActual >= netExpected ? 'On Track' : 'Under Budget'}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {netActual >= netExpected
                    ? `Actual net position exceeds expectations by ${formatCurrency(Math.abs(netVariance))}`
                    : `Need ${formatCurrency(Math.abs(netVariance))} more income or expense reduction to meet budget`
                  }
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-purple-400">Mutual Aid Allocation</span>
                </div>
                <p className="text-sm text-gray-300">
                  10% of shop income automatically allocated to mutual aid fund for community support
                </p>
                <div className="mt-2 text-purple-400 font-bold">
                  {formatCurrency(incomeTotals.actual * 0.10)} allocated this period
                </div>
              </div>
            </div>
          </>
        )}

        {/* Transparency Note */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">Financial Transparency:</strong> As a Community Benefit Society, all financial data is public and accessible to members.
            This dashboard provides real-time budget tracking for organizational planning and community accountability.
          </p>
        </div>
      </div>
    </div>
  );
}
