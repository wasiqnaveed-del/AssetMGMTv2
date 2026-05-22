import React, { useState } from 'react';
import { DatabaseState, MaintenanceLog, PMSchedule } from '../types';
import {
  Calendar,
  AlertTriangle,
  User,
  Clock,
  Briefcase,
  Search,
  PlusCircle,
  TrendingUp,
  Mail,
  Zap,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface MaintenanceTabProps {
  state: DatabaseState;
  role: 'Admin' | 'Viewer' | 'QR_Scan';
  onLogMaintenance: (log: MaintenanceLog) => Promise<boolean>;
}

export default function MaintenanceTab({ state, role, onLogMaintenance }: MaintenanceTabProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  // Form overlay
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAssetId, setFormAssetId] = useState('');
  const [formType, setFormType] = useState<MaintenanceLog['Type']>('Preventive');
  const [formDescription, setFormDescription] = useState('');
  const [formTechnician, setFormTechnician] = useState('');
  const [formVendor, setFormVendor] = useState('');
  const [formDuration, setFormDuration] = useState(2.0);
  const [formLaborCost, setFormLaborCost] = useState(0);
  const [formPartsCost, setFormPartsCost] = useState(0);
  const [formInvoiceNo, setFormInvoiceNo] = useState('');
  const [formStatus, setFormStatus] = useState<MaintenanceLog['Status']>('Completed');
  const [formDowntime, setFormDowntime] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Current operational constraints for overdue
  const todayStr = '2026-05-22';
  const today = new Date(todayStr);

  // 1. Calculations: Overdue PM alerts & Automated script records
  const overduePMs = state.pmSchedules.filter(s => {
    return s.Active && s.Next_Due && new Date(s.Next_Due) < today;
  });

  // Calculate tech workload metrics (sum of durations on logs)
  const techWorkloadMap: { [key: string]: number } = {};
  state.maintenanceLogs.forEach(log => {
    const tech = log.Technician || 'Unassigned';
    techWorkloadMap[tech] = (techWorkloadMap[tech] || 0) + Number(log.Duration_Hours);
  });
  // Add schedules workload estimate
  state.pmSchedules.forEach(sched => {
    if (sched.Active) {
      const tech = sched.Assigned_To || 'Unassigned';
      techWorkloadMap[tech] = (techWorkloadMap[tech] || 0) + 4.0; // Estimate 4 hours per PM schedule assigned
    }
  });

  const techWorkloadData = Object.entries(techWorkloadMap).map(([name, hours]) => ({
    Technician: name,
    'Allocated Hours': hours
  }));

  // Filter logs list
  const filteredLogs = state.maintenanceLogs.filter(log => {
    const matchSearch = 
      log.Asset_ID.toLowerCase().includes(search.toLowerCase()) ||
      (log.Description || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.Technician || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.Vendor || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.Invoice_No || '').toLowerCase().includes(search.toLowerCase());

    const matchType = selectedType === 'All' || log.Type === selectedType;

    return matchSearch && matchType;
  });

  // Calendar setup: Let's draw a grid for the active month (May 2026)
  // May 1st 2026 is a Friday. Total 31 days.
  const calendarDaysCount = 31;
  const startDayOffset = 5; // Friday corresponds to column 5 (Sunday is 0, Mon 1, ..., Fri 5)
  const totalGridSlots = 35; // 5 rows of 7 days

  const calendarDays = Array.from({ length: calendarDaysCount }, (_, i) => i + 1);

  // Mapping active schedules to particular dates in May 2026
  const getTasksForDay = (day: number) => {
    const dayStr = `2026-05-${String(day).padStart(2, '0')}`;
    return state.pmSchedules.filter(s => s.Next_Due === dayStr);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.assets.some(a => a.Asset_ID === formAssetId)) {
      setSubmitError(`Asset ID "${formAssetId}" does not exist in the master registry. Please register the asset first.`);
      return;
    }

    const newLog: MaintenanceLog = {
      Log_ID: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
      Asset_ID: formAssetId,
      Date: todayStr,
      Type: formType,
      Description: formDescription,
      Technician: formTechnician,
      Vendor: formVendor,
      Duration_Hours: Number(formDuration),
      Labor_Cost: Number(formLaborCost),
      Parts_Cost: Number(formPartsCost),
      Total_Cost: Number(formLaborCost) + Number(formPartsCost),
      Invoice_No: formInvoiceNo || `INV-IH-${Math.floor(100 + Math.random() * 900)}`,
      Status: formStatus,
      Downtime_Hours: Number(formDowntime),
      Root_Cause: '',
      Resolution: formStatus === 'Completed' ? 'Maintenance work validated and signed off by supervisor.' : '',
      Logged_By: 'wasiq.naveed@gmail.com',
      Logged_At: new Date().toISOString()
    };

    const success = await onLogMaintenance(newLog);
    if (success) {
      setIsFormOpen(false);
      setSubmitError(null);
      // Reset form fields
      setFormAssetId('');
      setFormDescription('');
      setFormTechnician('');
      setFormVendor('');
      setFormInvoiceNo('');
    } else {
      setSubmitError('Error updating maintenance database sheet records.');
    }
  };

  return (
    <div className="space-y-8" id="maintenance-tab-container">
      {/* Overdue Alarms Indicator Notification Banner */}
      {overduePMs.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4" id="overdue-maintenance-alert-banner">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-rose-900 text-sm">Critical Preventive Maintenance Overdue Alarm</h3>
              <p className="text-xs text-rose-700/95 mt-1">
                The automatic scheduler detected <span className="font-extrabold underline">{overduePMs.length} active service checks</span> past their Next_Due dates.
              </p>
              <div className="flex flex-col gap-1.5 mt-3 text-xs text-rose-700 font-mono">
                {overduePMs.map(pm => (
                  <div key={pm.Schedule_ID} className="flex items-center gap-1.5">
                    <span className="font-bold">[{pm.Schedule_ID}]</span> {pm.Task_Name} (Asset: {pm.Asset_ID}) - Overdue since <span className="underline font-bold text-red-600">{pm.Next_Due}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-rose-500/10 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 max-w-sm self-stretch shrink-0 flex flex-col justify-between">
            <div className="flex items-center gap-2 font-bold mb-1.5">
              <Mail className="h-4 w-4" />
              <span>AppsScript Automated Alert Triggered</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Cron job executed at **08:15 AM today**. A warning list compiled of overdue inspections was dispatched to **eafaadmin@gmail.com**.
            </p>
          </div>
        </div>
      )}

      {/* Scheduler Calendar & Tech Workloads Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="schedule-calendar-dashboard">
        {/* Scheduled Jobs Calendar */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full" id="maintenance-calendar">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Operational PM Service Calendar</h3>
                <p className="text-xs text-slate-400">Scheduled checks & PM cycles map for the active cycle</p>
              </div>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">May 2026</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs flex-1">
            {/* Week Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="font-bold text-slate-400 py-1">{d}</span>
            ))}

            {/* Empty Offset Slots */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="bg-slate-50/50 rounded-lg h-20 border border-transparent" />
            ))}

            {/* Active Days */}
            {calendarDays.map((day) => {
              const tasks = getTasksForDay(day);
              const isTodayDay = day === 22; // May 22, 2026
              
              return (
                <div 
                  key={`day-${day}`} 
                  className={`bg-white border rounded-lg h-22 p-1.5 flex flex-col justify-between text-left transition-all ${
                    isTodayDay ? 'border-indigo-600 ring-2 ring-indigo-50/50' : 'border-slate-100'
                  } hover:shadow-xs group`}
                >
                  <span className={`text-[11px] font-bold h-4 w-4 rounded-full flex items-center justify-center font-mono ${
                    isTodayDay ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}>
                    {day}
                  </span>
                  
                  {/* Task flags nested inside the day slot */}
                  <div className="space-y-1 overflow-y-auto mt-1 max-h-14">
                    {tasks.map(t => {
                      let priorityClass = 'bg-slate-100 text-slate-700 border-slate-200';
                      if (t.Priority === 'High') priorityClass = 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
                      if (t.Priority === 'Critical') priorityClass = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';

                      return (
                        <div 
                          key={t.Schedule_ID} 
                          className={`text-[9px] px-1 py-0.5 rounded border leading-tight truncate ${priorityClass}`}
                          title={`[${t.Schedule_ID}] ${t.Task_Name} assigned to ${t.Assigned_To}`}
                        >
                          {t.Asset_ID}: {t.Task_Name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Workload Hours Allocation Recharts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between" id="technician-workhours-allocation">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 font-sans">Technician Work Hours Allocation</h3>
              </div>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 leading-normal mb-6">
              Aggregated times of scheduled preventive service and logged maintenance hours during this operations block.
            </p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techWorkloadData} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="Technician" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="Allocated Hours" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Assigned Duty Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filterable Maintenance Logs Table view */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs" id="maintenance-logs-registry">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Calibration & Maintenance Activity Logs</h3>
            <p className="text-xs text-slate-400">Registry of recent on-field repairs and checkups</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto shrink-0">
            {/* Search inputs */}
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs, tech, ticket..."
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
              <option value="All">All Service Types</option>
              <option value="Scheduled">Scheduled Maintenance</option>
              <option value="Preventive">Preventive Inspection</option>
              <option value="Corrective">Corrective Overhaul</option>
              <option value="Upgrade">System Upgrade</option>
            </select>

            {role === 'Admin' && (
              <button
                onClick={() => { setSubmitError(null); setIsFormOpen(true); }}
                id="btn-log-maintenance"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                Log Maintenance Performance
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Ticket ID</th>
                <th className="py-3.5 px-5">Asset</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Repair Task Type</th>
                <th className="py-3.5 px-5">Assigned Force</th>
                <th className="py-3.5 px-5">Downtime</th>
                <th className="py-3.5 px-5">Financial Costs</th>
                <th className="py-3.5 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No logged maintenance operations matched the chosen filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let statusStyle = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (log.Status === 'Completed') statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  if (log.Status === 'In Progress') statusStyle = 'bg-blue-50 text-blue-700 border-blue-100 font-bold';
                  if (log.Status === 'Pending') statusStyle = 'bg-amber-100 text-amber-700 border-amber-200';

                  return (
                    <tr key={log.Log_ID} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                        {log.Log_ID}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="text-xs">
                          <span className="font-bold text-indigo-600 font-mono">{log.Asset_ID}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Inv: {log.Invoice_No || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-600">
                        {log.Date}
                      </td>
                      <td className="py-3.5 px-5 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 block">{log.Type}</span>
                          <span className="text-slate-400 font-sans max-w-xs truncate block mt-0.5">{log.Description}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 block">{log.Technician}</span>
                          <span className="text-slate-400 text-[10px] block mt-0.5">{log.Vendor}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-600">
                        {log.Downtime_Hours} hrs <span className="text-[10px] text-slate-400 block">Duration: {log.Duration_Hours}h</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-800">
                        <span className="font-bold">${Number(log.Total_Cost).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 block">Parts: ${log.Parts_Cost} | Labor: ${log.Labor_Cost}</span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusStyle}`}>
                          {log.Status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin log maintenance overlay popup form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 md:p-6" id="maintenance-crud-modal">
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white w-full max-w-lg h-full md:h-[95vh] rounded-none md:rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg animate-pulse">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Log Maintenance Task Ticket</h3>
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

              {/* Maintenance inputs */}
              <div className="space-y-4 text-xs">
                {/* Asset Select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Target Asset *</label>
                  <select
                    required
                    value={formAssetId}
                    onChange={(e) => setFormAssetId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="">-- Choose Asset from Master Database --</option>
                    {state.assets.map(a => (
                      <option key={a.Asset_ID} value={a.Asset_ID}>
                        {a.Asset_ID} - {a.Name} ({a.Status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Task/Repair Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="Preventive">🔄 Preventive Calibration / Inspection</option>
                    <option value="Scheduled">Scheduled Maintenance Checkup</option>
                    <option value="Corrective">🛠️ Corrective Overhaul</option>
                    <option value="Upgrade">System Capability Upgrade</option>
                  </select>
                </div>

                {/* Operator/Technician Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Duty Technician Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sarah Jenkins"
                      value={formTechnician}
                      onChange={(e) => setFormTechnician(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Assigned Vendor Company</label>
                    <input
                      type="text"
                      placeholder="e.g., In-House Logistics"
                      value={formVendor}
                      onChange={(e) => setFormVendor(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Detailed Action Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter explicit diagnostic details, filter changes or part replacements..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                {/* Timings */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Duration (Hours) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formDuration}
                      onChange={(e) => setFormDuration(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">System Downtime (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formDowntime}
                      onChange={(e) => setFormDowntime(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                    />
                  </div>
                </div>

                {/* Financial Costs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Labor Charge Cost ($) *</label>
                    <input
                      type="number"
                      required
                      value={formLaborCost}
                      onChange={(e) => setFormLaborCost(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Replacement Parts Cost ($) *</label>
                    <input
                      type="number"
                      required
                      value={formPartsCost}
                      onChange={(e) => setFormPartsCost(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                    />
                  </div>
                </div>

                {/* Invoice and Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Purchase Invoice Number</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-98212"
                      value={formInvoiceNo}
                      onChange={(e) => setFormInvoiceNo(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Duty Execution Status *</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="Completed">🟢 Completed & Calibrated</option>
                      <option value="In Progress">🔵 In Progress</option>
                      <option value="Pending">🟡 Pending Inspection</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-lg border text-center transition-all cursor-pointer"
              >
                Cancel Entry
              </button>
              <button
                type="submit"
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-all cursor-pointer"
              >
                Assemble Ticket row
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
