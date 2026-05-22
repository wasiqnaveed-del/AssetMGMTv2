import React, { useState } from 'react';
import { APIConfig, getAPIConfig, saveAPIConfig } from '../apiService';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data';
import {
  FileSpreadsheet,
  Link,
  ShieldCheck,
  Code,
  Copy,
  CheckCircle,
  Database,
  RefreshCw,
  Info
} from 'lucide-react';

interface IntegrationPanelProps {
  onConfigChanged: () => void;
}

export default function IntegrationPanel({ onConfigChanged }: IntegrationPanelProps) {
  const [config, setConfig] = useState<APIConfig>(getAPIConfig());
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'error' | null; msg: string }>({ status: null, msg: '' });

  const handleSave = (newConfig: APIConfig) => {
    saveAPIConfig(newConfig);
    setConfig(newConfig);
    onConfigChanged();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const testConnection = async () => {
    if (!config.appsScriptUrl) {
      setTestResult({ status: 'error', msg: 'Please provide a valid Apps Script Web App Endpoint URL above.' });
      return;
    }
    setIsUpdating(true);
    setTestResult({ status: null, msg: '' });

    try {
      const url = `${config.appsScriptUrl}?action=verifyToken&token=${config.customToken}`;
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      const data = await res.json();
      if (res.ok) {
        setTestResult({ status: 'success', msg: 'Database Handshake Successful! Connected to workbook.' });
      } else {
        setTestResult({ status: 'error', msg: `Server Rejected Check: ${data.error || 'Check access roles'}` });
      }
    } catch (e: any) {
      // Chrome/Fetch might block direct fetches without correct Apps Script deployments but we warn them
      setTestResult({ 
        status: 'error', 
        msg: `Pre-flight fetch checked: CORS or connection error. Make sure scripts are deployed as "Web App" with access set to "Anyone" (Anonymous): ${e.message}` 
      });
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-8" id="integration-panel-container">
      {/* Overview */}
      <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs" id="sheets-integration-specs">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Google Sheets REST-like Architecture</h3>
            <p className="text-xs text-slate-400">Expose spreadsheet databases securely. No direct firewalls exposure.</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed text-justify max-w-2xl">
          AssetOps operates on a highly scalable dual-mode database engine. By default, it runs instantly in **Interactive Demo Mode** utilizing localized sandbox caching. You can establish immediate live read/write tunnels to your personal **Google Sheets** spreadsheets using our custom Google Apps Script micro-API!
        </p>
      </div>

      {/* Inputs Configuration panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="integration-controls-layout">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between" id="bridge-credentials">
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-800">API Endpoint Tunnel</h4>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                config.isLocalOnly 
                  ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {config.isLocalOnly ? 'Local Demo Mode Active' : 'Live Sheets Tunnel Active'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Toggle switch */}
              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border rounded-xl">
                <div>
                  <span className="font-bold text-slate-700 block text-xs">Database Engine Mode</span>
                  <span className="text-[10px] text-slate-400">Toggle offline sandboxing or real sheet writing</span>
                </div>
                <button
                  onClick={() => handleSave({ ...config, isLocalOnly: !config.isLocalOnly })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                    config.isLocalOnly 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {config.isLocalOnly ? 'Switch to Live Sheets' : 'Switch to Local Sandbox'}
                </button>
              </div>

              {/* URL */}
              {!config.isLocalOnly && (
                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-slate-600">Google Apps Script Web App URL *</label>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={config.appsScriptUrl}
                    onChange={(e) => handleSave({ ...config, appsScriptUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 block leading-normal pt-0.5">
                    Paste the exact Web App URL generated when compiling Apps Script. Make sure to choose execute as: **Me** and access: **Anyone**.
                  </span>
                </div>
              )}

              {/* Token */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-600">Access Token Credentials Token *</label>
                <input
                  type="text"
                  placeholder="e.g., EAFA2026ADMIN or EAFA2026VIEW"
                  value={config.customToken}
                  onChange={(e) => handleSave({ ...config, customToken: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
                <div className="flex gap-2 mt-1.5 text-[10px] text-slate-400 text-left">
                  <span>Developer tests:</span>
                  <button 
                    onClick={() => handleSave({ ...config, customToken: 'EAFA2026ADMIN' })} 
                    className="font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    EAFA2026ADMIN
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => handleSave({ ...config, customToken: 'EAFA2026VIEW' })} 
                    className="font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    EAFA2026VIEW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {!config.isLocalOnly && config.appsScriptUrl && (
            <div className="mt-8 pt-4 border-t border-slate-50 space-y-3">
              <button
                onClick={testConnection}
                disabled={isUpdating}
                className="w-full bg-slate-900 border text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-75"
              >
                <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                Test Database Handshake
              </button>

              {testResult.status && (
                <div className={`p-3 rounded-lg border text-[11px] font-medium leading-relaxed ${
                  testResult.status === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                    : 'bg-rose-50 text-rose-800 border-rose-100 text-justify'
                }`}>
                  {testResult.msg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic setup handbook list progress */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4" id="sheets-setup-checklist">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-800">Deployment Checklists</h4>
          </div>

          <div className="space-y-3 text-xs leading-normal">
            <div className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center font-mono shrink-0">1</span>
              <div>
                <span className="font-bold text-slate-800 block">Create the Sheet workbook</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Register a Google Sheet titled **AssetOps_DB** on your account.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center font-mono shrink-0">2</span>
              <div>
                <span className="font-bold text-slate-800 block">Structure workbook tabs</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Create 9 exactly matching sheets: **Assets**, **Maintenance_Log**, **Breakdown_Log**, **Expenses**, **Schedule**, **Users**, **QR_Registry**, **Audit_Trail**, **Spares**.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center font-mono shrink-0">3</span>
              <div>
                <span className="font-bold text-slate-800 block">Mount the Apps Script Middleware</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Under workbook header click **Extensions &gt; Apps Script**, paste our template code shown below, and deploy as web app accessible by **Anyone**.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center font-mono shrink-0">4</span>
              <div>
                <span className="font-bold text-slate-800 block">Paste Web App URL</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Activate **Live Sheets Tunnel** in AssetOps and test connection handshake.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy-Paste Script Template block */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-inner" id="code-repository">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Google Apps Script Enterprise API Template</h4>
              <p className="text-xs text-slate-500">Prisinte Javascript engine handles transactions, auth validations and cascade status shifts.</p>
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isCopied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {isCopied ? 'Copied' : 'Copy API Code'}
          </button>
        </div>

        {/* Scrollable code window */}
        <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-850 p-4 bg-slate-950/80">
          <pre className="text-[10px] font-mono text-slate-300 whitespace-pre leading-relaxed select-all">
            {GOOGLE_APPS_SCRIPT_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
}
