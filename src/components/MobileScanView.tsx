import React, { useState, useEffect } from 'react';
import { Asset, MaintenanceLog, BreakdownLog } from '../types';
import { AssetOpsAPI } from '../apiService';
import {
  ShieldAlert,
  Loader2,
  Wrench,
  AlertOctagon,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Compass,
  FileText,
  MapPin,
  HelpCircle,
  X
} from 'lucide-react';

interface MobileScanViewProps {
  assetId: string;
  token: string;
  api: AssetOpsAPI;
}

export default function MobileScanView({ assetId, token, api }: MobileScanViewProps) {
  const [loading, setLoading] = useState(true);
  const [assetDetails, setAssetDetails] = useState<Asset | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [breakdowns, setBreakdowns] = useState<BreakdownLog[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Breakdown log submission states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formReporter, setFormReporter] = useState('');
  const [formRootCause, setFormRootCause] = useState('');
  const [formImpact, setFormImpact] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchAssetNode = async () => {
    setLoading(true);
    const result = await api.fetchScannedAsset(assetId);
    if (result.success && result.details) {
      setAssetDetails(result.details);
      setMaintenance(result.maintenance || []);
      setBreakdowns(result.breakdowns || []);
    } else {
      setErrorMsg(result.error || 'Scanned asset ID not found in database or authorization token invalid/expired.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssetNode();
  }, [assetId]);

  const handleReportBreakdown = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetId) return;

    const breakdownPayload = {
      Asset_ID: assetId,
      Date_Reported: new Date().toISOString().split('T')[0],
      Date_Resolved: '',
      Reported_By: formReporter,
      Root_Cause: formRootCause,
      Impact: formImpact,
      Downtime_Hours: 0,
      Repair_Cost: 0,
      Parts_Used: '',
      Resolution_Notes: 'Incident logged via QR Scanner Portal.',
      Linked_Log_ID: ''
    };

    const success = await api.reportAssetBreakdown(breakdownPayload);
    if (success) {
      setIsFormOpen(false);
      setFormReporter('');
      setFormRootCause('');
      setSubmitError(null);
      // Reload details to reflect new breakdown and status
      fetchAssetNode();
    } else {
      setSubmitError('Error logging breakdown. Check system integration or permission credentials.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-sans" id="mobile-loading-view">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wider font-mono">LOADING ENCRYPTED SCAN TARGET...</span>
      </div>
    );
  }

  if (errorMsg || !assetDetails) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans" id="mobile-error-view">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 mb-6 max-w-sm">
          <ShieldAlert className="h-12 w-12 mx-auto mb-3" />
          <h2 className="text-base font-extrabold text-rose-900 leading-tight">Access Authorization Rejected</h2>
          <p className="text-xs text-rose-700/90 mt-2 leading-relaxed">{errorMsg || 'Token is invalid'}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm"
        >
          Retry Scan Connection
        </button>
      </div>
    );
  }

  let statusBadgeStyle = 'bg-slate-50 text-slate-600 border-slate-200';
  if (assetDetails.Status === 'Active') statusBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (assetDetails.Status === 'Under Maintenance') statusBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-100';
  if (assetDetails.Status === 'Broken') statusBadgeStyle = 'bg-red-50 text-red-700 border-red-100 animate-pulse';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 flex flex-col items-center" id="mobile-scan-dashboard">
      {/* Dynamic branding header */}
      <header className="sticky top-0 z-10 w-full max-w-md bg-white border-b border-slate-100 py-3.5 px-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black font-sans">A</span>
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">AssetOps Mobile</span>
        </div>
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase border">QR Portal</span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md p-4 space-y-6">
        
        {/* Main Specs Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="aspect-video relative w-full bg-slate-100">
            <img 
              src={assetDetails.Photo_URL} 
              alt={assetDetails.Name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full">
              ID: {assetDetails.Asset_ID}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{assetDetails.Category} / {assetDetails.Sub_Category}</span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{assetDetails.Name}</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{assetDetails.Manufacturer} — {assetDetails.Model}</p>
            </div>

            {/* Current status indicator */}
            <div className="flex items-center justify-between border-t border-b border-slate-50 py-3">
              <span className="text-xs font-semibold text-slate-500">Asset Fitness Status:</span>
              <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${statusBadgeStyle}`}>
                {assetDetails.Status.toUpperCase()}
              </span>
            </div>

            {/* Space coordinate info */}
            <div className="space-y-2.5 text-xs">
              <h3 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Placement Location</h3>
              <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">COMPLEX</span>
                  <span className="font-semibold block">{assetDetails.Location_Name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PLACEMENT LEVEL</span>
                  <span className="font-semibold block">{assetDetails.Block} {assetDetails.Floor && `| Floor ${assetDetails.Floor}`}</span>
                </div>
              </div>
            </div>

            {/* Manufacturer Details block */}
            <div className="space-y-2.5 text-xs">
              <h3 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg border">
                <div>
                  <span className="text-slate-400 text-[10px]">SERIAL</span>
                  <span className="font-mono text-slate-900 block font-bold">{assetDetails.Serial_No || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">WARRANTY EXPIRY</span>
                  <span className="font-mono text-slate-900 block">{assetDetails.Warranty_Expiry || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Google Doc file link */}
            {assetDetails.Drive_Doc_URL && (
              <a 
                href={assetDetails.Drive_Doc_URL} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-indigo-50/20 border border-indigo-100 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">SOP & Calibration Manual</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Access template SOPs hosted on Google Drive</span>
                </div>
              </a>
            )}

            {/* CRITICAL CALL TO ACTION TRIGGER - Report breakdown on the spot */}
            {assetDetails.Status !== 'Broken' && (
              <button
                onClick={() => { setSubmitError(null); setIsFormOpen(true); }}
                id="btn-report-breakdown-mobile"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm tracking-wider cursor-pointer mt-4"
              >
                <AlertOctagon className="h-4 w-4" />
                Report breakdown on the spot
              </button>
            )}
          </div>
        </div>

        {/* Maintenance Logs (stripped down detail list) */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Recent Service History</h3>
          <div className="space-y-2">
            {maintenance.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-white p-4 border rounded-xl text-center">No historic service records on file</p>
            ) : (
              maintenance.map(l => (
                <div key={l.Log_ID} className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] bg-slate-100 font-bold px-1.5 py-0.2 rounded text-slate-500">{l.Log_ID}</span>
                    <span className="font-extrabold text-slate-800 block mt-1">{l.Type} Service</span>
                    <p className="text-slate-500 leading-normal">{l.Description}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">By: {l.Technician} — {l.Date}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">COMPLETED</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Breakdowns logged */}
        {breakdowns.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Recent Breakdown Tickets</h3>
            <div className="space-y-2">
              {breakdowns.map(b => (
                <div key={b.Breakdown_ID} className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 text-xs text-rose-900">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] bg-rose-100 font-extrabold px-1.5 py-0.2 rounded text-rose-700">{b.Breakdown_ID}</span>
                    <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-widest">{b.Impact} Impact</span>
                  </div>
                  <p className="font-bold">{b.Root_Cause}</p>
                  <p className="text-slate-500 mt-1 leading-normal">Resolution notes: {b.Resolution_Notes || 'Incidents pending repair crew.'}</p>
                  <span className="text-[9px] text-slate-400 block mt-1.5 font-mono">Reported by {b.Reported_By}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating reporting popup drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center p-0 md:p-4">
          <form 
            onSubmit={handleReportBreakdown}
            className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-rose-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-[14px]">Report Asset Failure</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="p-1 bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitError && (
              <div className="bg-rose-50 border border-rose-250/50 p-3 rounded-lg text-xs text-rose-800 font-semibold flex items-center gap-2">
                <span>⚠️</span> {submitError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Reporter Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Insert field technician full name..."
                  value={formReporter}
                  onChange={(e) => setFormReporter(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Dynamic Problem details / Root cause *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain diagnostic failure, leakages, power-offs..."
                  value={formRootCause}
                  onChange={(e) => setFormRootCause(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Operational Level Impact *</label>
                <select
                  value={formImpact}
                  onChange={(e) => setFormImpact(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                >
                  <option value="Low">Low (System runs with slight degradation)</option>
                  <option value="Medium">Medium (Partial performance bottlenecks)</option>
                  <option value="High">⚠️ High (Key operation suspended)</option>
                  <option value="Critical">🚨 Critical (Whole facility offline!)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-1/2 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel reporting
              </button>
              <button
                type="submit"
                className="w-1/2 p-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-transform active:scale-98 shadow-sm cursor-pointer"
              >
                Declare Breakdown
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
