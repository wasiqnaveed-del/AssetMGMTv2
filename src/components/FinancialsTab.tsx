import React, { useState } from 'react';
import { DatabaseState, Expense } from '../types';
import {
  DollarSign,
  TrendingUp,
  Award,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  TrendingDown,
  PlusCircle,
  Search,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface FinancialsTabProps {
  state: DatabaseState;
  role: 'Admin' | 'Viewer' | 'QR_Scan';
  onAddExpense: (expense: Expense) => Promise<boolean>;
}

export default function FinancialsTab({ state, role, onAddExpense }: FinancialsTabProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAssetId, setFormAssetId] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState<number | string>(0);
  const [formVendor, setFormVendor] = useState('');
  const [formInvoiceNo, setFormInvoiceNo] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<Expense['Expense_Type']>('Operational');
  const [formReceiptUrl, setFormReceiptUrl] = useState('');
  const [formApprovedBy, setFormApprovedBy] = useState('');
  const [formExpenseId, setFormExpenseId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const todayStr = '2026-05-22';

  // 1. Calculations: YTD Spend Groupings
  const totalYtdSpend = state.expenses
    .filter(e => e.Date.startsWith('2026'))
    .reduce((sum, e) => sum + Number(e.Amount), 0) +
    state.maintenanceLogs
      .filter(l => l.Date.startsWith('2026'))
      .reduce((sum, l) => sum + Number(l.Total_Cost), 0);

  const opexYtdSpend = state.expenses
    .filter(e => e.Date.startsWith('2026') && e.Expense_Type === 'Operational')
    .reduce((sum, e) => sum + Number(e.Amount), 0);

  const capexYtdSpend = state.expenses
    .filter(e => e.Date.startsWith('2026') && e.Expense_Type === 'Capital')
    .reduce((sum, e) => sum + Number(e.Amount), 0);

  const maintenanceYtdSpend = state.maintenanceLogs
    .filter(l => l.Date.startsWith('2026'))
    .reduce((sum, l) => sum + Number(l.Total_Cost), 0) +
    state.expenses
      .filter(e => e.Date.startsWith('2026') && e.Expense_Type === 'Maintenance')
      .reduce((sum, e) => sum + Number(e.Amount), 0);

  // 2. Planned vs Unplanned Cost Trend comparison in 2026
  // Planned = Scheduled + Preventive Maintenance Log costs
  // Unplanned = Corrective Maintenance + Breakdown repair costs
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const trendDataMap: { [key: number]: { Month: string; Planned: number; Unplanned: number } } = {
    1: { Month: 'Jan', Planned: 0, Unplanned: 0 },
    2: { Month: 'Feb', Planned: 0, Unplanned: 0 },
    3: { Month: 'Mar', Planned: 0, Unplanned: 0 },
    4: { Month: 'Apr', Planned: 0, Unplanned: 0 },
    5: { Month: 'May', Planned: 0, Unplanned: 0 },
    6: { Month: 'Jun', Planned: 0, Unplanned: 0 }
  };

  state.maintenanceLogs.forEach(l => {
    const d = new Date(l.Date);
    if (d.getFullYear() === 2026) {
      const m = d.getMonth() + 1;
      if (trendDataMap[m]) {
        if (l.Type === 'Scheduled' || l.Type === 'Preventive') {
          trendDataMap[m].Planned += Number(l.Total_Cost);
        } else {
          trendDataMap[m].Unplanned += Number(l.Total_Cost);
        }
      }
    }
  });

  state.breakdownLogs.forEach(b => {
    const d = new Date(b.Date_Reported);
    if (d.getFullYear() === 2026) {
      const m = d.getMonth() + 1;
      if (trendDataMap[m]) {
        trendDataMap[m].Unplanned += Number(b.Repair_Cost || 0);
      }
    }
  });

  const costTrendData = Object.values(trendDataMap);

  // 3. Top 5 Costliest Assets
  // Cumulative = Purchase Cost + Expenses logged against Asset_ID + Maintenance Logs against Asset_ID
  const assetCostMap: { [key: string]: { id: string; name: string; category: string; cost: number; originalCost: number } } = {};
  
  state.assets.forEach(a => {
    assetCostMap[a.Asset_ID] = {
      id: a.Asset_ID,
      name: a.Name,
      category: a.Category,
      cost: Number(a.Purchase_Cost),
      originalCost: Number(a.Purchase_Cost)
    };
  });

  state.expenses.forEach(e => {
    if (assetCostMap[e.Asset_ID]) {
      assetCostMap[e.Asset_ID].cost += Number(e.Amount);
    }
  });

  state.maintenanceLogs.forEach(l => {
    if (assetCostMap[l.Asset_ID]) {
      assetCostMap[l.Asset_ID].cost += Number(l.Total_Cost);
    }
  });

  const topCostliestAssets = Object.values(assetCostMap)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const highestAssetCost = topCostliestAssets[0]?.cost || 1;

  // Filter expenses list
  const filteredExpenses = state.expenses.filter(exp => {
    const matchSearch =
      (exp.Asset_ID || '').toLowerCase().includes(search.toLowerCase()) ||
      (exp.Description || '').toLowerCase().includes(search.toLowerCase()) ||
      (exp.Vendor || '').toLowerCase().includes(search.toLowerCase()) ||
      (exp.Invoice_No || '').toLowerCase().includes(search.toLowerCase()) ||
      (exp.Approved_By || '').toLowerCase().includes(search.toLowerCase());

    const matchType = selectedType === 'All' || exp.Expense_Type === selectedType;

    return matchSearch && matchType;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.assets.some(a => a.Asset_ID === formAssetId)) {
      setSubmitError(`Asset ID "${formAssetId}" does not exist in the master registry. Kindly verify.`);
      return;
    }

    const newExpense: Expense = {
      Expense_ID: formExpenseId || `EXP-${Math.floor(8000 + Math.random() * 999)}`,
      Asset_ID: formAssetId,
      Date: todayStr,
      Category: formCategory || 'General Maintenance',
      Vendor: formVendor,
      Invoice_No: formInvoiceNo || `INV-EXP-${Math.floor(100 + Math.random() * 900)}`,
      Description: formDescription,
      Amount: Number(formAmount),
      Currency: 'USD',
      Expense_Type: formType,
      Linked_Log_ID: '',
      Receipt_URL: formReceiptUrl || 'https://drive.google.com/file/d/receipt-template',
      Approved_By: formApprovedBy || 'Accounting Procurement Office',
      Logged_By: 'wasiq.naveed@gmail.com',
      Logged_At: new Date().toISOString()
    };

    const success = await onAddExpense(newExpense);
    if (success) {
      setIsFormOpen(false);
      setSubmitError(null);
      // Reset
      setFormAssetId('');
      setFormCategory('');
      setFormAmount(0);
      setFormVendor('');
      setFormInvoiceNo('');
      setFormDescription('');
      setFormReceiptUrl('');
      setFormApprovedBy('');
    } else {
      setSubmitError('Error writing transaction row. Please check sync configurations.');
    }
  };

  return (
    <div className="space-y-8" id="financials-tab-container">
      {/* 4 Spend Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="spend-groupings-grid">
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">YTD Consolidated Spend</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-sans">${totalYtdSpend.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Operational block 2026</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CapEx YTD Assets Addition</span>
          <p className="text-2xl font-extrabold text-[#1e1b4b] mt-1 font-sans">${capexYtdSpend.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-indigo-600 font-semibold">
            <Layers className="h-4 w-4" />
            <span>Heavy system investments</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">OpEx Diagnostics & Consumables</span>
          <p className="text-2xl font-extrabold text-indigo-800 mt-1 font-sans">${opexYtdSpend.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 font-medium">
            <span>Corporate facilities budget</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Repairs Overhauls cost</span>
          <p className="text-2xl font-extrabold text-indigo-950 mt-1 font-sans">${maintenanceYtdSpend.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-amber-600 font-semibold">
            <TrendingDown className="h-4 w-4" />
            <span>Scheduled & remedial parts</span>
          </div>
        </div>
      </div>

      {/* Planned vs Unplanned cost trend Recharts LineChart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="financial-charts-layout">
        {/* Planned vs Unplanned Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full" id="planned-vs-unplanned-chart">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Planned vs. Unplanned Cost Comparison</h3>
              <p className="text-xs text-slate-400">Comparing routine preventive PM cycles against unscheduled remediation breakdowns</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Cost Analysis</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} formatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Planned" stroke="#10b981" strokeWidth={2.5} name="Planned Routine Maintenance" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Unplanned" stroke="#ef4444" strokeWidth={2.5} name="Unplanned Breakdown Outlays" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Costliest Assets list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between" id="top-5-costliest-rank">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 font-sans">Top 5 Costliest Assets</h3>
              </div>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 leading-normal mb-6">
              Total aggregated lifecycle costs including original purchase CapEx and dynamic repair logs.
            </p>
          </div>

          {/* Asset ranking with visual sliders */}
          <div className="space-y-4" id="costliest-assets-ranks">
            {topCostliestAssets.map((asset, index) => {
              const pct = Math.round((asset.cost / highestAssetCost) * 100);
              return (
                <div key={`${asset.id || 'costly'}-${index}`} className="space-y-1">
                  <div className="flex justify-between text-xs items-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-slate-400 font-bold shrink-0">#{index + 1}</span>
                      <span className="font-bold text-slate-700 truncate min-w-0" title={asset.name}>{asset.name}</span>
                    </div>
                    <span className="font-mono text-slate-900 font-extrabold shrink-0">${asset.cost.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 border rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-indigo-600' :
                        index === 1 ? 'bg-indigo-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block">ID: {asset.id} | Purchase: ${asset.originalCost.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expense Registry list log */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs" id="expenses-registry-logs">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Full Operations Purchase & Expense Ledger</h3>
            <p className="text-xs text-slate-400">Chronological ledger of facilities costs, hardware investments and invoices</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto shrink-0">
            {/* Search filter */}
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ledger ID, vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-auto"
            >
              <option value="All">All Expense Types</option>
              <option value="Operational">OpEx Consumables</option>
              <option value="Capital">CapEx Assets purchases</option>
              <option value="Maintenance">Maintenance repairs</option>
              <option value="Other">Other Miscellaneous</option>
            </select>

            {role === 'Admin' && (
              <button
                onClick={() => { 
                  setSubmitError(null); 
                  setFormExpenseId(`EXP-${Math.floor(8000 + Math.random() * 999)}`);
                  setIsFormOpen(true); 
                }}
                id="btn-add-expense"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                Add Expense Entry
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Expense Ticket ID</th>
                <th className="py-3.5 px-5">Target Asset</th>
                <th className="py-3.5 px-5">Date Logged</th>
                <th className="py-3.5 px-5">Invoice No.</th>
                <th className="py-3.5 px-5">Category & Description</th>
                <th className="py-3.5 px-5">Supplier Vendor</th>
                <th className="py-3.5 px-5">Cost Class</th>
                <th className="py-3.5 px-5 text-right">Amount (USD)</th>
                <th className="py-3.5 px-5 text-center">Receipt File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No expense record logs matched the active filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp, index) => (
                  <tr key={`${exp.Expense_ID || 'exp'}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                      {exp.Expense_ID}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-indigo-600">
                      {exp.Asset_ID}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-600">
                      {exp.Date}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-700">
                      {exp.Invoice_No || 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{exp.Category}</span>
                        <span className="text-slate-400 truncate max-w-xs block mt-0.5">{exp.Description}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-700">
                      {exp.Vendor}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                        exp.Expense_Type === 'Capital' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        exp.Expense_Type === 'Maintenance' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {exp.Expense_Type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-extrabold text-slate-900">
                      ${Number(exp.Amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      {exp.Receipt_URL && (
                        <a 
                          href={exp.Receipt_URL} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          View Receipt
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Log financial purchase modal popup */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 md:p-6" id="expense-crud-modal">
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white w-full max-w-lg h-full md:h-[95vh] rounded-none md:rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Add Operational Purchase Expense</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200/50 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <span className="font-bold">Error:</span> {submitError}
                </div>
              )}

              {/* Form entries */}
              <div className="space-y-4 text-xs">
                {/* ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Generated Expense Ticket ID</label>
                  <input
                    type="text"
                    readOnly
                    value={formExpenseId}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 cursor-not-allowed opacity-100"
                  />
                </div>

                {/* Target Asset */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Purchase Linked Asset ID *</label>
                  <select
                    required
                    value={formAssetId}
                    onChange={(e) => setFormAssetId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Asset from Master Database --</option>
                    {state.assets.map((a, idx) => (
                      <option key={a.Asset_ID || `asset-opt-${idx}`} value={a.Asset_ID}>
                        {a.Asset_ID} - {a.Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Transactional Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    value={isNaN(Number(formAmount)) ? '' : formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Expense Type Class */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Cost classification *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Operational">OpEx (Consumables, parts, tool hire)</option>
                    <option value="Capital">CapEx (Major hardware/equipment acquisition)</option>
                    <option value="Maintenance">Maintenance Repairs Labor invoice</option>
                    <option value="Other">Other Non-operational</option>
                  </select>
                </div>

                {/* Category & Vendor */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 font-sans">Budget Category </label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Spare Part"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 font-sans">Supplier / Vendor Operator *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siemens Supplies"
                      value={formVendor}
                      onChange={(e) => setFormVendor(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Invoice No & Approved By */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Invoice Number</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-88212"
                      value={formInvoiceNo}
                      onChange={(e) => setFormInvoiceNo(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Approved By Signatory</label>
                    <input
                      type="text"
                      placeholder="e.g. Procurement Office"
                      value={formApprovedBy}
                      onChange={(e) => setFormApprovedBy(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Purchase Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter concrete accounting description of physical nodes purchased..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Receipt Drive URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Google Drive Invoice PDF Link</label>
                  <input
                    type="url"
                    placeholder="e.g. https://drive.google.com/file/d/..."
                    value={formReceiptUrl}
                    onChange={(e) => setFormReceiptUrl(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-lg border text-center transition-colors cursor-pointer"
              >
                Cancel Ledger Entry
              </button>
              <button
                type="submit"
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-all cursor-pointer"
              >
                Verify & Sync Purchase
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
