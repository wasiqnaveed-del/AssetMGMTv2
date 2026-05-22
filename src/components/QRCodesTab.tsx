import React, { useState } from 'react';
import { DatabaseState, QRRegistry, Asset } from '../types';
import {
  QrCode,
  Printer,
  PlusCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Grid,
  CheckSquare,
  Square,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';

interface QRCodesTabProps {
  state: DatabaseState;
  role: 'Admin' | 'Viewer' | 'QR_Scan';
  onAddQRRegistry: (qr: QRRegistry) => Promise<boolean>;
}

export default function QRCodesTab({ state, role, onAddQRRegistry }: QRCodesTabProps) {
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(state.assets.map(a => a.Asset_ID));
  const [isPrintLayoutMode, setIsPrintLayoutMode] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form states
  const [formAssetId, setFormAssetId] = useState('');
  const [formTokenCode, setFormTokenCode] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Host/app origin to build scanning URLs
  // This constructs the full scanning URL directed straight to our active app scan route!
  const appOrigin = window.location.origin + window.location.pathname;

  const handleToggleSelectAsset = (assetId: string) => {
    if (selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds(selectedAssetIds.filter(id => id !== assetId));
    } else {
      setSelectedAssetIds([...selectedAssetIds, assetId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === state.assets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(state.assets.map(a => a.Asset_ID));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formAssetId) return;

    const matchedAsset = state.assets.find(a => a.Asset_ID === formAssetId);
    if (!matchedAsset) {
      setSubmitError('Asset ID not found.');
      return;
    }

    const nextTokenNum = Math.floor(100 + Math.random() * 900);
    const generatedToken = formTokenCode || `${formAssetId}_QR_TOKEN_${nextTokenNum}`;
    const scanUrl = `${appOrigin}?token=${generatedToken}&assetId=${formAssetId}`;

    const newRow: QRRegistry = {
      QR_ID: `QR-${Math.floor(450 + Math.random() * 100)}`,
      Asset_ID: formAssetId,
      Token: generatedToken,
      Full_URL: scanUrl,
      Generated_Date: new Date().toISOString().split('T')[0],
      Generated_By: 'wasiq.naveed@gmail.com',
      Active: true,
      Last_Scanned: '',
      Scan_Count: 0
    };

    const success = await onAddQRRegistry(newRow);
    if (success) {
      setIsRegisterOpen(false);
      setFormAssetId('');
      setFormTokenCode('');
      setSubmitError(null);
    } else {
      setSubmitError('Error creating QR registry row.');
    }
  };

  return (
    <div className="space-y-8" id="qr-registry-tab-container">
      {/* Printable Sheet View Toggle Cover (If active, show elegant print page) */}
      {isPrintLayoutMode ? (
        <div className="bg-slate-50 p-6 border border-slate-200 rounded-3xl" id="print-sheet-layout">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-xl gap-4 mb-8 print:hidden">
            <div>
              <h3 className="text-base font-bold text-slate-800">Printable QR Labels Selection</h3>
              <p className="text-xs text-slate-500">Optimized grid for labels printout. Align margins to fit standard adhesive paper sheet grids.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPrintLayoutMode(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer"
              >
                Exit Print Mode
              </button>
              <button
                onClick={() => window.print()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Trigger Print Dialogue
              </button>
            </div>
          </div>

          {/* Printable Labels Sheet Grid (Standard A4 Grid cards with dotted cutting limits) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans p-2 bg-white rounded-2xl border print:border-none print:p-0" id="printable-grid-sheet">
            {state.assets
              .filter(a => selectedAssetIds.includes(a.Asset_ID))
              .map(asset => {
                // Find matching token, generate custom fallback if not registered yet
                const matchRegistry = state.qrRegistries.find(r => r.Asset_ID === asset.Asset_ID);
                const fallbackToken = matchRegistry ? matchRegistry.Token : `${asset.Asset_ID}_QR_FALLBACK`;
                const scanUrl = `${appOrigin}?token=${fallbackToken}&assetId=${asset.Asset_ID}`;
                
                // Load high quality dynamic QR code from QRServer Server
                const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(scanUrl)}`;

                return (
                  <div 
                    key={`label-${asset.Asset_ID}`} 
                    className="border-2 border-dashed border-slate-300 p-5 rounded-xl flex flex-col justify-between items-center text-center h-84 relative bg-white/50 print:border-slate-800"
                  >
                    {/* Brand Header */}
                    <div className="w-full border-b pb-2 flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-indigo-900 tracking-wider font-sans">ASSETOPS HARDWARE LABEL</span>
                      <span className="text-[8px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-1 py-0.2 rounded font-bold">{asset.Asset_ID}</span>
                    </div>

                    {/* Middle: QR Server image */}
                    <div className="h-36 w-36 bg-slate-50 border border-slate-200 p-1 rounded-lg flex items-center justify-center">
                      <img 
                        src={qrCodeSrc} 
                        alt={`QR Code for asset ${asset.Asset_ID}`} 
                        className="h-full w-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Footer Specifications details */}
                    <div className="w-full space-y-1 mt-2 text-xs">
                      <h4 className="font-extrabold text-slate-800 truncate">{asset.Name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate">Category: {asset.Category} ({asset.Sub_Category || 'Generic'})</p>
                      
                      <div className="bg-slate-50 border rounded p-1.5 text-[8px] font-mono text-slate-400 mt-1 flex flex-col items-center">
                        <span className="text-slate-500 font-bold tracking-wider">SCANNER TOKEN CODE</span>
                        <span className="text-indigo-600 tracking-normal font-bold line-clamp-1 break-all select-all">{fallbackToken}</span>
                      </div>
                    </div>

                    {/* Tiny watermark */}
                    <div className="absolute bottom-1 right-2 text-[6px] text-slate-300 font-semibold uppercase">Powered by Google Workspace</div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {/* Top Panel: Selector Grid for labels sheets */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs" id="qr-generator-panel">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Grid className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">QR Sheet Generator Module</h3>
                  <p className="text-xs text-slate-400">Select active hardware assets to compile into printable adhesive sheets</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
                <button
                  onClick={handleSelectAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer"
                >
                  {selectedAssetIds.length === state.assets.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  disabled={selectedAssetIds.length === 0}
                  onClick={() => setIsPrintLayoutMode(true)}
                  id="btn-preview-printable-sheets"
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Compile Printable Sheet ({selectedAssetIds.length})
                </button>
              </div>
            </div>

            {/* Quick multi-selector box */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 border-t border-slate-50 pt-6">
              {state.assets.map(asset => {
                const isChecked = selectedAssetIds.includes(asset.Asset_ID);
                return (
                  <div
                    key={`select-item-${asset.Asset_ID}`}
                    onClick={() => handleToggleSelectAsset(asset.Asset_ID)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col justify-between h-20 transition-all select-none hover:shadow-2xs ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/20 text-indigo-950 font-semibold'
                        : 'border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold">{asset.Asset_ID}</span>
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300 shrink-0" />
                      )}
                    </div>
                    <span className="truncate block font-semibold mt-1" title={asset.Name}>{asset.Name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Panel: Token Registry table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs" id="qr-registry-log">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">QR Security & Tracking Registry</h3>
                <p className="text-xs text-slate-400">Cryptographically isolated scanning links registered in Sheet</p>
              </div>

              {role === 'Admin' && (
                <button
                  onClick={() => { setSubmitError(null); setIsRegisterOpen(true); }}
                  id="btn-register-qr-token"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="h-4 w-4" />
                  Register Security QR Token Row
                </button>
              )}
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Registry ID</th>
                    <th className="py-3.5 px-5">Asset</th>
                    <th className="py-3.5 px-5">Authorization token</th>
                    <th className="py-3.5 px-5">Active Scanner URL</th>
                    <th className="py-3.5 px-5 font-mono text-center">Scan count</th>
                    <th className="py-3.5 px-5">Last Scanned Date</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {state.qrRegistries.map((qr) => {
                    const matchedAsset = state.assets.find(a => a.Asset_ID === qr.Asset_ID);
                    const finalScanUrl = `${appOrigin}?token=${qr.Token}&assetId=${qr.Asset_ID}`;

                    return (
                      <tr key={qr.QR_ID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-900">
                          {qr.QR_ID}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="text-xs">
                            <span className="font-bold text-slate-700 block">{matchedAsset?.Name || 'N/A'}</span>
                            <span className="text-slate-400 font-mono text-[10px] block mt-0.5">{qr.Asset_ID}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-xs text-indigo-600 font-bold select-all">
                          {qr.Token}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-500 max-w-xs truncate" title={finalScanUrl}>
                          <a 
                            href={finalScanUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-mono text-[11px] text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            {finalScanUrl}
                          </a>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-xs text-center font-bold text-slate-800">
                          {qr.Scan_Count}
                        </td>
                        <td className="py-3.5 px-5 text-xs font-mono text-slate-500">
                          {qr.Last_Scanned ? new Date(qr.Last_Scanned).toLocaleString() : 'Never Scanned'}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            qr.Active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {qr.Active ? 'Active' : 'Disabled'}
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

      {/* Admin QR Registry row modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 md:p-6" id="qr-registry-modal">
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white w-full max-w-md h-full md:h-[65vh] rounded-none md:rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Configure Security QR Scanner Link</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsRegisterOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-55"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200/50 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <span className="font-bold">Error:</span> {submitError}
                </div>
              )}

              {/* Configure elements */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Secure Asset Source ID *</label>
                  <select
                    required
                    value={formAssetId}
                    onChange={(e) => setFormAssetId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">-- Choose Asset from Master Database --</option>
                    {state.assets.map(a => (
                      <option key={a.Asset_ID} value={a.Asset_ID}>
                        {a.Asset_ID} - {a.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Custom Scanning Token Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if left blank"
                    value={formTokenCode}
                    onChange={(e) => setFormTokenCode(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 leading-normal block">
                    Security isolated tokens prevent QR scanners from viewing unrelated assets or browsing administrative pages.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-lg border text-center cursor-pointer"
              >
                Cancel Configuration
              </button>
              <button
                type="submit"
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer"
              >
                Register QR Token Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
