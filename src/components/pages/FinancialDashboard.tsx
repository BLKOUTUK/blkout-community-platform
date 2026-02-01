import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Heart, Calendar, AlertTriangle, CheckCircle, Download, Plus, FolderOpen, Target } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Project {
  id: string;
  name: string;
  project_code: string;
  description: string;
  status: string;
  total_budget_gbp: number;
  funding_source: string;
  start_date: string;
  end_date: string;
  requires_funder_reporting: boolean;
  next_report_due: string;
  expected_income_gbp: number;
  actual_income_gbp: number;
  expected_expenses_gbp: number;
  actual_expenses_gbp: number;
  net_actual_gbp: number;
  budget_spent_percentage: number;
  remaining_budget_gbp: number;
}

interface BudgetLine {
  id: string;
  line_type: 'income' | 'expense';
  category: string;
  expected_amount_gbp: number;
  actual_amount_gbp: number;
  variance_gbp: number;
  variance_percentage: number;
  notes: string;
  project_id: string;
}

interface Transaction {
  id: string;
  transaction_date: string;
  type: 'income' | 'expense';
  category: string;
  amount_gbp: number;
  description: string;
  project_id: string;
}

export default function FinancialDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'projects' | 'overall'>('projects');

  useEffect(() => {
    loadFinancialData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails(selectedProject.id);
    }
  }, [selectedProject]);

  const loadFinancialData = async () => {
    try {
      // Load projects with budget summary
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_budget_summary')
        .select('*')
        .order('start_date', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Select first active project
      const activeProject = projectsData?.find(p => p.status === 'active') || projectsData?.[0];
      if (activeProject) {
        setSelectedProject(activeProject);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      // Load budget lines for project
      const { data: linesData, error: linesError } = await supabase
        .from('budget_lines')
        .select('*')
        .eq('project_id', projectId)
        .order('line_type', { ascending: false })
        .order('category');

      if (linesError) throw linesError;
      setBudgetLines(linesData || []);

      // Load transactions for project
      const { data: transData, error: transError } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('project_id', projectId)
        .order('transaction_date', { ascending: false });

      if (transError) throw transError;
      setTransactions(transData || []);
    } catch (error) {
      console.error('Error loading project details:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const calculateOverallTotals = () => {
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.total_budget_gbp?.toString() || '0')), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (parseFloat(p.actual_expenses_gbp?.toString() || '0')), 0);
    const totalIncome = projects.reduce((sum, p) => sum + (parseFloat(p.actual_income_gbp?.toString() || '0')), 0);
    const totalRemaining = totalBudget - totalSpent;

    return { totalBudget, totalSpent, totalIncome, totalRemaining };
  };

  const overall = calculateOverallTotals();

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
          <h1 className="text-4xl font-black mb-2 text-yellow-500 uppercase">FINANCIAL MANAGEMENT</h1>
          <p className="text-gray-400">Project-based budgeting, tracking, and funder reporting for BLKOUT UK</p>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setView('projects')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'projects'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <FolderOpen className="w-4 h-4 inline mr-2" />
            By Project
          </button>
          <button
            onClick={() => setView('overall')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'overall'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Overall Budget
          </button>
        </div>

        {view === 'overall' && (
          <>
            {/* Overall Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Budget (All Projects)</div>
                <div className="text-2xl font-bold text-blue-400">{formatCurrency(overall.totalBudget)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Income</div>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(overall.totalIncome)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(overall.totalSpent)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Remaining Budget</div>
                <div className="text-2xl font-bold text-purple-400">{formatCurrency(overall.totalRemaining)}</div>
              </div>
            </div>

            {/* Projects Overview Table */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4">All Projects Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="pb-2">Project</th>
                      <th className="pb-2">Funder</th>
                      <th className="pb-2 text-right">Budget</th>
                      <th className="pb-2 text-right">Spent</th>
                      <th className="pb-2 text-right">%</th>
                      <th className="pb-2 text-right">Remaining</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => {
                      const spentPercent = project.budget_spent_percentage || 0;
                      const isOverBudget = spentPercent > 100;

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                          onClick={() => { setSelectedProject(project); setView('projects'); }}
                        >
                          <td className="py-3">
                            <div className="text-white font-semibold">{project.name}</div>
                            <div className="text-xs text-gray-500">{project.project_code}</div>
                          </td>
                          <td className="py-3 text-gray-300">{project.funding_source || 'Unrestricted'}</td>
                          <td className="py-3 text-right text-white">{formatCurrency(project.total_budget_gbp)}</td>
                          <td className="py-3 text-right text-red-400 font-semibold">{formatCurrency(project.actual_expenses_gbp)}</td>
                          <td className={`py-3 text-right font-semibold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                            {spentPercent.toFixed(1)}%
                          </td>
                          <td className={`py-3 text-right font-semibold ${project.remaining_budget_gbp < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {formatCurrency(project.remaining_budget_gbp)}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {view === 'projects' && selectedProject && (
          <>
            {/* Project Selector */}
            <div className="mb-6 flex gap-2 overflow-x-auto">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    selectedProject?.id === project.id
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {project.name}
                  {project.requires_funder_reporting && <span className="ml-2 text-xs">📊</span>}
                </button>
              ))}
              <button className="px-4 py-2 rounded-lg font-semibold bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30">
                <Plus className="w-4 h-4 inline mr-1" />
                New Project
              </button>
            </div>

            {/* Project Header */}
            <div className="mb-6 bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Code: <span className="text-yellow-500 font-mono">{selectedProject.project_code}</span></span>
                    <span className="text-gray-400">
                      Period: {new Date(selectedProject.start_date).toLocaleDateString('en-GB')} -
                      {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString('en-GB') : 'Ongoing'}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedProject.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  selectedProject.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {selectedProject.status.toUpperCase()}
                </span>
              </div>

              {/* Funding Source */}
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Funding Source:</span>
                  <span className="ml-2 text-white font-semibold">{selectedProject.funding_source || 'Unrestricted'}</span>
                </div>
                {selectedProject.requires_funder_reporting && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-1">
                    <span className="text-blue-400 text-xs font-semibold">
                      📊 Funder Reporting Required
                      {selectedProject.next_report_due && ` - Due ${new Date(selectedProject.next_report_due).toLocaleDateString('en-GB')}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Budget Summary */}
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Budget</div>
                <div className="text-2xl font-bold text-blue-400">{formatCurrency(selectedProject.total_budget_gbp)}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Income Received</div>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(selectedProject.actual_income_gbp)}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Actual Spend</div>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(selectedProject.actual_expenses_gbp)}</div>
                <div className="text-xs text-gray-400 mt-1">{selectedProject.budget_spent_percentage.toFixed(1)}% of budget</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Remaining</div>
                <div className={`text-2xl font-bold ${selectedProject.remaining_budget_gbp >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {formatCurrency(selectedProject.remaining_budget_gbp)}
                </div>
              </div>
              <div className={`rounded-lg p-4 ${
                selectedProject.budget_spent_percentage <= 100
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className={`text-lg font-bold ${selectedProject.budget_spent_percentage <= 100 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedProject.budget_spent_percentage <= 100 ? '✓ On Budget' : '⚠ Over Budget'}
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
                      <th className="pb-2">Source</th>
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
                    {budgetLines.filter(l => l.line_type === 'income').length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-500 italic">No income budgeted</td></tr>
                    )}
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
                    {budgetLines.filter(l => l.line_type === 'expense').length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-500 italic">No expenses budgeted</td></tr>
                    )}
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
                    <h3 className="font-semibold text-yellow-400 mb-2">Budget Variance Alerts (&gt;20%)</h3>
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

            {/* Funder Reporting Alert */}
            {selectedProject.requires_funder_reporting && selectedProject.next_report_due && (
              <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-1">Funder Report Due</h3>
                    <p className="text-sm text-gray-300">
                      Next report for <strong>{selectedProject.funding_source}</strong> due on{' '}
                      <strong>{new Date(selectedProject.next_report_due).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </p>
                    <button className="mt-2 bg-blue-500/20 border border-blue-500 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30">
                      <Download className="w-3 h-3 inline mr-1" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Project Transactions */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  Project Transactions
                </h2>
                <button className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700">
                  <Download className="w-4 h-4" />
                  Export for Funder
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
                          No transactions recorded for this project yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Transparency Note */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">Financial Transparency & Funder Reporting:</strong> As a Community Benefit Society, all financial data is tracked by project for funder accountability and community transparency.
            This dashboard enables proper grant management and outcome reporting.
          </p>
        </div>
      </div>
    </div>
  );
}
