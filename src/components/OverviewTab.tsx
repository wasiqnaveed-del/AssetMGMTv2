import React from 'react';
import { DatabaseState, Asset, MaintenanceLog, BreakdownLog, Expense, PMSchedule } from '../types';
import {
  Wrench,
  AlertTriangle,
  Activity,
  DollarSign,
  Layers,
  CalendarCheck,
  Percent,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface OverviewTabProps {
  state: DatabaseState;
  onNavigateToTab: (tabId: string) => void;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function OverviewTab({ state, onNavigateToTab }: OverviewTabProps) {
  // Current date for 2026-05-22 reference
  const todayStr = '2026-05-22';
  const today = new Date(todayStr);

  // 1. Calculate 8 KPIs
  const totalAssetsNum = state.assets.length;
  
  const activeAssets = state.assets.filter(a => a.Status !== 'Decommissioned');
  const brokenAssetsCount = state.assets.filter(a => a.Status === 'Broken').length;
  const maintAssetsCount = state.assets.filter(a => a.Status === 'Under Maintenance').length;
  
  const operationalRate = totalAssetsNum > 0 
    ? Math.round(((totalAssetsNum - brokenAssetsCount) / totalAssetsNum) * 100) 
    : 100;

  const schedulesCount = state.pmSchedules.filter(s => s.Active).length;
  
  const overdueSchedules = state.pmSchedules.filter(s => {
    if (!s.Active || !s.Next_Due) return false;
    return new Date(s.Next_Due) < today;
  });
  const overdueCount = overdueSchedules.length;

  const totalYtdSpend = state.expenses
    .filter(e => e.Date.startsWith('2026'))
    .reduce((val, e) => val + Number(e.Amount), 0) + 
    state.maintenanceLogs
      .filter(l => l.Date.startsWith('2026'))
      .reduce((val, l) => val + Number(l.Total_Cost), 0);

  const totalAssetValue = state.assets.reduce((val, a) => val + Number(a.Current_Value), 0);

  const kpiList = [
    {
      id: 'kpi-1',
      title: 'Active Assets',
      value: totalAssetsNum,
      desc: 'Registered fleet + stationary',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      tab: 'assets'
    },
    {
      id: 'kpi-2',
      title: 'Operational Rate',
      value: `${operationalRate}%`,
      desc: 'Assets currently online',
      icon: Percent,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tab: 'assets'
    },
    {
      id: 'kpi-3',
      title: 'Under Maintenance',
      value: maintAssetsCount,
      desc: 'Active overhauls/inspections',
      icon: Wrench,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      tab: 'maintenance'
    },
    {
      id: 'kpi-4',
      title: 'Critical Breakdowns',
      value: brokenAssetsCount,
      desc: 'Awaiting urgent repairs',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-100',
      tab: 'maintenance'
    },
    {
      id: 'kpi-5',
      title: 'Active PM Schedules',
      value: schedulesCount,
      desc: 'Recurrent preventive cycles',
      icon: CalendarCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      tab: 'maintenance'
    },
    {
      id: 'kpi-6',
      title: 'Overdue Inspections',
      value: overdueCount,
      desc: 'Passed schedule thresholds',
      icon: Clock,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      tab: 'maintenance'
    },
    {
      id: 'kpi-7',
      title: 'YTD Operational Spend',
      value: `$${totalYtdSpend.toLocaleString()}`,
      desc: 'Maint. labor, parts, & expenses',
      icon: DollarSign,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      tab: 'financials'
    },
    {
      id: 'kpi-8',
      title: 'Asset Net Worth',
      value: `$${totalAssetValue.toLocaleString()}`,
      desc: 'Cumulative depreciated value',
      icon: DollarSign,
      color: 'bg-slate-50 text-slate-600 border-slate-100',
      tab: 'financials'
    }
  ];

  // 2. Prepare Chart Data
  // Chart A: Monthly Cost Split (Expense Amount vs. Maintenance Logs Cost in 2026)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyDataMap: { [key: string]: { Month: string; Expenses: number; Maintenance: number } } = {};
  
  monthNames.forEach((month, idx) => {
    monthlyDataMap[idx + 1] = { Month: month, Expenses: 0, Maintenance: 0 };
  });

  state.expenses.forEach(e => {
    const d = new Date(e.Date);
    if (d.getFullYear() === 2026) {
      const m = d.getMonth() + 1;
      if (monthlyDataMap[m]) monthlyDataMap[m].Expenses += Number(e.Amount);
    }
  });

  state.maintenanceLogs.forEach(l => {
    const d = new Date(l.Date);
    if (d.getFullYear() === 2026) {
      const m = d.getMonth() + 1;
      if (monthlyDataMap[m]) monthlyDataMap[m].Maintenance += Number(l.Total_Cost);
    }
  });

  const monthlyCostSplitData = Object.values(monthlyDataMap).slice(0, 6); // show Jan to Jun 2026 for readability

  // Chart B: Asset Status by Category
  const categories = ['Electrical', 'HVAC/Mech', 'IT/Servers', 'Vehicles', 'Other'] as const;
  const assetStatusByCategoryData = categories.map(cat => {
    const catAssets = state.assets.filter(a => a.Category === cat);
    return {
      Category: cat,
      Active: catAssets.filter(a => a.Status === 'Active').length,
      Maintenance: catAssets.filter(a => a.Status === 'Under Maintenance').length,
      Broken: catAssets.filter(a => a.Status === 'Broken').length
    };
  });

  // Chart C: Breakdown Trend (Aggregate reported breakdowns over last 6 months)
  // Let's bucket Breakdown logs by month in 2026
  const breakdownTrendData = Object.keys(monthlyDataMap).slice(0, 6).map(mKey => {
    const count = state.breakdownLogs.filter(b => {
      const d = new Date(b.Date_Reported);
      return d.getFullYear() === 2026 && (d.getMonth() + 1) === Number(mKey);
    }).length;
    return {
      Month: monthlyDataMap[mKey].Month,
      'Breakdown Incidents': count
    };
  });

  // Chart D: Cost Distribution Donut (Sum expenses grouped by Expense_Type/Category)
  const expenseTypes = ['Operational', 'Capital', 'Maintenance', 'Other'] as const;
  const costDistributionDonutData = expenseTypes.map(type => {
    const amount = state.expenses
      .filter(e => e.Expense_Type === type)
      .reduce((sum, e) => sum + Number(e.Amount), 0);
    return { name: type, value: amount };
  }).filter(item => item.value > 0);

  // Activity Feed formatting
  const recentActivities = [
    ...state.maintenanceLogs.map(l => ({
      id: `act-${l.Log_ID}`,
      type: 'maintenance',
      title: `Maintenance: ${l.Type}`,
      desc: `${l.Description} (Asset: ${l.Asset_ID})`,
      time: l.Logged_At,
      user: l.Logged_By,
      status: l.Status
    })),
    ...state.breakdownLogs.map(b => ({
      id: `act-${b.Breakdown_ID}`,
      type: 'breakdown',
      title: `Breakdown Reported: ${b.Impact} Impact`,
      desc: `${b.Root_Cause || 'Incident logged.'} (Asset: ${b.Asset_ID})`,
      time: b.Logged_At,
      user: b.Reported_By,
      status: b.Date_Resolved ? 'Resolved' : 'Critical'
    })),
    ...state.auditTrails.map(a => ({
      id: `act-${a.Audit_ID}`,
      type: 'audit',
      title: `${a.Action}: ${a.Sheet_Tab}`,
      desc: `Field: ${a.Field_Changed || 'Row'} of Asset ${a.Asset_ID}`,
      time: a.Timestamp,
      user: a.User_Email,
      status: 'Trail Logged'
    }))
  ]
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  .slice(0, 8); // top 8 activities

  return (
    <div className="space-y-8" id="overview-tab-container">
      {/* 8 KPIs Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {kpiList.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              onClick={() => onNavigateToTab(kpi.tab)}
              className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs hover:shadow-md cursor-pointer transition-all hover:border-slate-300 relative group overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{kpi.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg border ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{kpi.desc}</span>
                <span className="text-indigo-600 opacity-0 group-hover:opacity-100 flex items-center transition-all bg-indigo-50/50 px-1.5 py-0.5 rounded gap-0.5">
                  View <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Live Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="charts-grid">
        {/* Chart A: Monthly Cost Split */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs" id="chart-monthly-split">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Operational Spend Breakdown</h3>
              <p className="text-xs text-slate-500">Comparing maintenance repairs against purchase transactions in 2026 YTD</p>
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">2026 (Jan–Jun)</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCostSplitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Maintenance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Maintenance Diagnostics & Overhauls" />
                <Bar dataKey="Expenses" fill="#10b981" radius={[4, 4, 0, 0]} name="Operational Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Asset Status by Category */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs" id="chart-asset-categories">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Asset Health & Status by Category</h3>
              <p className="text-xs text-slate-500">Active vs under maintenance vs broken systems</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetStatusByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Active" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Active & Calibrated" />
                <Bar dataKey="Maintenance" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Maintenance / Inspection" />
                <Bar dataKey="Broken" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Unscheduled Breakdown" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart C: Breakdown Trend */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs" id="chart-breakdown-trend">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Unscheduled Breakdown Trend</h3>
              <p className="text-xs text-slate-500">Monthly breakdown tickets logged by plant technicians</p>
            </div>
            <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">Alert Radar</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={breakdownTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBreakdowns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="Month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} precision={0} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Breakdown Incidents" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBreakdowns)" name="Breakdown Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: Cost Distribution Donut */}
        <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs" id="chart-cost-distribution">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Expense Type Distribution</h3>
              <p className="text-xs text-slate-500">Cumulative transactional allocation across cost classifications</p>
            </div>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`]}
                  />
                  <Pie
                    data={costDistributionDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costDistributionDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5 text-xs">
              {costDistributionDonutData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center justify-between border-b border-slate-50 pb-1.5Last">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="font-semibold text-slate-700">{entry.name}</span>
                  </div>
                  <span className="font-mono text-slate-900 font-bold">${entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-xs" id="activity-feed-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Audit & Operation Activity Feed</h3>
              <p className="text-xs text-slate-500">Real-time dynamic system logs synced from Google Sheets</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Synced just now</span>
        </div>

        <div className="divide-y divide-slate-100" id="activity-feed-list">
          {recentActivities.map((act) => {
            let badgeStyle = 'bg-slate-50 text-slate-600 border-slate-200';
            if (act.status === 'Completed' || act.status === 'Resolved') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
            if (act.status === 'In Progress') badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';
            if (act.status === 'Critical') badgeStyle = 'bg-red-50 text-red-700 border-red-100 animate-pulse';
            if (act.type === 'audit') badgeStyle = 'bg-purple-50 text-purple-700 border-purple-100';

            return (
              <div key={act.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-1.5 ${
                    act.type === 'breakdown' ? 'bg-red-500' :
                    act.type === 'maintenance' ? 'bg-indigo-500' : 'bg-slate-400'
                  }`} />
                  <div>
                    <h4 className="font-bold text-slate-800">{act.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-slate-400">By {act.user}</span>
                      <span className="h-1 w-1 bg-slate-300 rounded-full" />
                      <span className="text-xs text-slate-400 font-mono">{new Date(act.time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-end md:self-center">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeStyle}`}>
                    {act.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
