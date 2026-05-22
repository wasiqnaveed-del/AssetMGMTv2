import React, { useState } from 'react';
import { DatabaseState, Asset } from '../types';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Compass,
  DollarSign,
  Briefcase,
  ShieldAlert,
  Edit2,
  X,
  Layers,
  CheckCircle,
  Truck,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AssetsTabProps {
  state: DatabaseState;
  role: 'Admin' | 'Viewer' | 'QR_Scan';
  onSaveAsset: (asset: Asset) => Promise<boolean>;
}

export default function AssetsTab({ state, role, onSaveAsset }: AssetsTabProps) {
  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Active/selected asset details modal
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<Asset | null>(null);
  
  // CRUD actions state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Form fields state
  const [formAssetId, setFormAssetId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Electrical' | 'HVAC/Mech' | 'IT/Servers' | 'Vehicles' | 'Other'>('Electrical');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBlock, setFormBlock] = useState('');
  const [formFloor, setFormFloor] = useState('');
  const [formZone, setFormZone] = useState('');
  const [formLatitude, setFormLatitude] = useState(40.7580);
  const [formLongitude, setFormLongitude] = useState(-73.9855);
  const [formIsMobile, setFormIsMobile] = useState(false);
  const [formStatus, setFormStatus] = useState<Asset['Status']>('Active');
  const [formPurchaseDate, setFormPurchaseDate] = useState('2026-01-01');
  const [formPurchaseCost, setFormPurchaseCost] = useState(0);
  const [formCurrentValue, setFormCurrentValue] = useState(0);
  const [formDepreciationMethod, setFormDepreciationMethod] = useState('Straight Line (5 yr)');
  const [formWarrantyExpiry, setFormWarrantyExpiry] = useState('2029-01-01');
  const [formManufacturer, setFormManufacturer] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formSerialNo, setFormSerialNo] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formDriveDocUrl, setFormDriveDocUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. Filter Assets
  const filteredAssets = state.assets.filter(asset => {
    const matchesSearch = 
      asset.Name.toLowerCase().includes(search.toLowerCase()) ||
      asset.Asset_ID.toLowerCase().includes(search.toLowerCase()) ||
      (asset.Location_Name || '').toLowerCase().includes(search.toLowerCase()) ||
      (asset.Model || '').toLowerCase().includes(search.toLowerCase()) ||
      (asset.Manufacturer || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || asset.Category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || asset.Status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Asset KPIs
  const totalFleetValue = state.assets.reduce((sum, a) => sum + Number(a.Purchase_Cost), 0);
  const avgAge = state.assets.length; // placeholder metric

  // Helper to trigger edit form
  const handleEditClick = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAsset(asset);
    setSubmitError(null);
    
    // Set field states
    setFormAssetId(asset.Asset_ID);
    setFormName(asset.Name);
    setFormCategory(asset.Category);
    setFormSubCategory(asset.Sub_Category);
    setFormLocation(asset.Location_Name);
    setFormBlock(asset.Block);
    setFormFloor(asset.Floor);
    setFormZone(asset.Zone);
    setFormLatitude(Number(asset.Latitude || 40.7580));
    setFormLongitude(Number(asset.Longitude || -73.9855));
    setFormIsMobile(Boolean(asset.Is_Mobile));
    setFormStatus(asset.Status);
    setFormPurchaseDate(asset.Purchase_Date);
    setFormPurchaseCost(Number(asset.Purchase_Cost));
    setFormCurrentValue(Number(asset.Current_Value));
    setFormDepreciationMethod(asset.Depreciation_Method);
    setFormWarrantyExpiry(asset.Warranty_Expiry);
    setFormManufacturer(asset.Manufacturer);
    setFormModel(asset.Model);
    setFormSerialNo(asset.Serial_No);
    setFormPhotoUrl(asset.Photo_URL);
    setFormDriveDocUrl(asset.Drive_Doc_URL);
    setFormNotes(asset.Notes || '');

    setIsFormOpen(true);
  };

  // Create new asset triggers
  const handleAddNewClick = () => {
    setEditingAsset(null);
    setSubmitError(null);
    const nextIdNum = state.assets.length + 1;
    setFormAssetId(`AST-00${nextIdNum}`);
    setFormName('');
    setFormCategory('Electrical');
    setFormSubCategory('');
    setFormLocation('Corporate Headquarters');
    setFormBlock('Building A');
    setFormFloor('Ground Level');
    setFormZone('');
    setFormLatitude(40.7580);
    setFormLongitude(-73.9855);
    setFormIsMobile(false);
    setFormStatus('Active');
    setFormPurchaseDate(new Date().toISOString().split('T')[0]);
    setFormPurchaseCost(0);
    setFormCurrentValue(0);
    setFormDepreciationMethod('Straight Line (5 yr)');
    setFormWarrantyExpiry(new Date(Date.now() + 365 * 3 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setFormManufacturer('');
    setFormModel('');
    setFormSerialNo('');
    setFormPhotoUrl('');
    setFormDriveDocUrl('');
    setFormNotes('');

    setIsFormOpen(true);
  };

  // Submit and write
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAsset: Asset = {
      Asset_ID: formAssetId.trim() || `AST-00${state.assets.length + 1}`,
      Name: formName,
      Category: formCategory,
      Sub_Category: formSubCategory,
      Location_Name: formLocation,
      Block: formBlock,
      Floor: formFloor,
      Zone: formZone,
      Latitude: Number(formLatitude),
      Longitude: Number(formLongitude),
      Is_Mobile: formIsMobile,
      Status: formStatus,
      Purchase_Date: formPurchaseDate,
      Purchase_Cost: Number(formPurchaseCost),
      Current_Value: Number(formCurrentValue),
      Depreciation_Method: formDepreciationMethod,
      Warranty_Expiry: formWarrantyExpiry,
      Manufacturer: formManufacturer,
      Model: formModel,
      Serial_No: formSerialNo,
      Photo_URL: formPhotoUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
      Drive_Doc_URL: formDriveDocUrl,
      Commissioned_Date: editingAsset ? editingAsset.Commissioned_Date : new Date().toISOString().split('T')[0],
      Decommissioned_Date: formStatus === 'Decommissioned' ? new Date().toISOString().split('T')[0] : '',
      Notes: formNotes,
      Last_Modified_By: '',
      Last_Modified_At: ''
    };

    const success = await onSaveAsset(finalAsset);
    if (success) {
      setIsFormOpen(false);
      setEditingAsset(null);
      setSubmitError(null);
    } else {
      setSubmitError('Unable to write changes. Please verify if user role matches active token privileges.');
    }
  };

  // 4. MAP GPS CALCULATION
  // Map center: around 40.7580, -73.9855
  // Map range: we normalize the latitudes (approx 40.754 to 40.761) and longitudes (-73.990 to -73.980) on to SVG viewport (800 x 400)
  const mapWidth = 800;
  const mapHeight = 350;

  const latMin = 40.754;
  const latMax = 40.761;
  const lngMin = -73.990;
  const lngMax = -73.980;

  const getMapCoords = (lat: number, lng: number) => {
    // Latitude behaves inversely (higher lat is further up the screen, i.e. smaller Y)
    const normalizedY = (latMax - lat) / (latMax - latMin);
    const normalizedX = (lng - lngMin) / (lngMax - lngMin);
    
    const x = Math.max(20, Math.min(mapWidth - 20, normalizedX * mapWidth));
    const y = Math.max(20, Math.min(mapHeight - 20, normalizedY * mapHeight));
    return { x, y };
  };

  return (
    <div className="space-y-8" id="assets-tab-container">
      {/* Search & Action Bar */}
      <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between" id="asset-search-filters">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
          {/* Query Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets, ID, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">⚡ Electrical</option>
              <option value="HVAC/Mech">❄️ HVAC / Mech</option>
              <option value="IT/Servers">🖥️ IT / Servers</option>
              <option value="Vehicles">🚚 Vehicles</option>
              <option value="Other">💼 Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-auto"
          >
            <option value="All">All Health Statuses</option>
            <option value="Active">🟢 Active & Calibrated</option>
            <option value="Under Maintenance">🟡 Under Maintenance</option>
            <option value="Broken">🔴 Broken / Down</option>
            <option value="In Storage">📦 In Storage</option>
            <option value="Decommissioned">⚪ Decommissioned</option>
          </select>
        </div>

        {role === 'Admin' && (
          <button
            onClick={handleAddNewClick}
            id="btn-register-new-asset"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Register New Asset
          </button>
        )}
      </div>

      {/* SVG Spatial GIS Map Plot Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner" id="assets-gis-map">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Dynamic Asset GIS Map</h3>
              <p className="text-xs text-slate-400">Position plot displaying Stationary (<span className="text-blue-400 font-bold">●</span> Circles) and Fleet Mobile (<span className="text-emerald-400 font-semibold">■</span> Squares)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500 tracking-wider">REF CAMPUS COORDINATES GRID</span>
        </div>

        {/* SVG Drawing Layer representing a blueprint campus */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[800px] bg-slate-950/80 rounded-xl relative" style={{ height: `${mapHeight}px` }}>
            <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-full text-slate-700 opacity-90">
              {/* Decorative map gridlines */}
              <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1">
                {[...Array(10)].map((_, i) => (
                  <line key={`v-${i}`} x1={(mapWidth / 10) * i} y1="0" x2={(mapWidth / 10) * i} y2={mapHeight} />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={(mapHeight / 6) * i} x2={mapWidth} y2={(mapHeight / 6) * i} />
                ))}
              </g>

              {/* Draw styled topological campus features (highways, zone outlines) */}
              <path d="M50 80 Q 200 40 400 90 T 750 60" fill="none" stroke="#2a4365" strokeWidth="4" strokeDasharray="6 4" />
              <path d="M120 300 Q 350 320 600 280" fill="none" stroke="#2a4365" strokeWidth="3" />
              
              <rect x="150" y="100" width="130" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.4" />
              <text x="160" y="125" fill="#475569" fontSize="10" fontWeight="bold">HQ Building Block A</text>

              <rect x="420" y="210" width="120" height="90" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.4" />
              <text x="430" y="235" fill="#475569" fontSize="10" fontWeight="bold">Substation Area</text>

              {/* Plot dynamic Asset Points */}
              {state.assets.map((asset) => {
                const { x, y } = getMapCoords(asset.Latitude, asset.Longitude);
                const isMobile = asset.Is_Mobile;
                const statusColor = 
                  asset.Status === 'Active' ? '#10b981' :
                  asset.Status === 'Under Maintenance' ? '#f59e0b' :
                  asset.Status === 'Broken' ? '#ef4444' : '#64748b';

                return (
                  <g 
                    key={`map-point-${asset.Asset_ID}`} 
                    className="cursor-pointer group/point transition-all"
                    onClick={() => setSelectedAssetForDetails(asset)}
                  >
                    {/* Ripple animation around active issues */}
                    {asset.Status === 'Broken' && (
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="15" 
                        fill="transparent" 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        className="animate-ping origin-center opacity-40" 
                      />
                    )}

                    {isMobile ? (
                      // Mobile vehicles rendered as Squares
                      <rect 
                        x={x - 6} 
                        y={y - 6} 
                        width="12" 
                        height="12" 
                        rx="1"
                        fill={statusColor} 
                        stroke="#0f172a" 
                        strokeWidth="1.5"
                        className="transition-transform group-hover/point:scale-130"
                      />
                    ) : (
                      // Stationary assets rendered as Circles
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="6" 
                        fill={statusColor} 
                        stroke="#0f172a" 
                        strokeWidth="1.5"
                        className="transition-transform group-hover/point:scale-130"
                      />
                    )}

                    {/* Point tooltip tag label */}
                    <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-250 pointer-events-none">
                      <rect 
                        x={x - 80} 
                        y={y - 45} 
                        width="160" 
                        height="34" 
                        rx="6" 
                        fill="#0f172a" 
                        stroke="#334155" 
                        strokeWidth="1" 
                      />
                      <text x={x} y={y - 32} fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {asset.Name.substring(0, 22)}
                      </text>
                      <text x={x} y={y - 20} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ID: {asset.Asset_ID} | {asset.Status}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Main Filterable Table of Assets */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs" id="assets-registry-table">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Asset Master Registry</h3>
            <p className="text-xs text-slate-400">Displaying {filteredAssets.length} of {state.assets.length} systems tracked</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Asset Details</th>
                <th className="py-3.5 px-5">Category & Sub</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Commission Date</th>
                <th className="py-3.5 px-5">Warranty</th>
                <th className="py-3.5 px-5 text-right">Lifetime Cost</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                {role === 'Admin' && <th className="py-3.5 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={role === 'Admin' ? 8 : 7} className="py-12 text-center text-slate-400 text-xs">
                    No registered assets matched the chosen filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  let statusBadge = 'bg-slate-50 text-slate-600 border-slate-200';
                  if (asset.Status === 'Active') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  if (asset.Status === 'Under Maintenance') statusBadge = 'bg-amber-50 text-amber-700 border-amber-100';
                  if (asset.Status === 'Broken') statusBadge = 'bg-red-50 text-red-700 border-red-100 animate-pulse';
                  if (asset.Status === 'Decommissioned') statusBadge = 'bg-slate-100 text-slate-500 border-slate-200';

                  // Calculate total maintenance lifetime cost for this asset
                  const assetExpensesSum = state.expenses
                    .filter(e => e.Asset_ID === asset.Asset_ID)
                    .reduce((sum, e) => sum + Number(e.Amount), 0);
                  const assetMaintSum = state.maintenanceLogs
                    .filter(l => l.Asset_ID === asset.Asset_ID)
                    .reduce((sum, l) => sum + Number(l.Total_Cost), 0);
                  const lifetimeSpent = asset.Purchase_Cost + assetExpensesSum + assetMaintSum;

                  return (
                    <tr 
                      key={asset.Asset_ID} 
                      onClick={() => setSelectedAssetForDetails(asset)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Asset Details */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={asset.Photo_URL} 
                            alt={asset.Name} 
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600 group-hover:bg-white border border-slate-200/50">
                              {asset.Asset_ID}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mt-0.5 group-hover:text-indigo-600 transition-colors">{asset.Name}</h4>
                            <p className="text-xs text-slate-400">{asset.Manufacturer} {asset.Model}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5">
                        <div className="text-xs">
                          <span className="font-semibold text-slate-700 block">
                            {asset.Category === 'Electrical' ? '⚡ Electrical' :
                             asset.Category === 'HVAC/Mech' ? '❄️ HVAC/Mech' :
                             asset.Category === 'IT/Servers' ? '🖥️ IT/Servers' :
                             asset.Category === 'Vehicles' ? '🚚 Vehicles' : '💼 Other'}
                          </span>
                          <span className="text-slate-400 text-[11px] block mt-0.5">{asset.Sub_Category}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-5">
                        <div className="text-xs flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-medium text-slate-700 block">{asset.Location_Name}</span>
                            <span className="text-slate-400 text-[10px] block mt-0.5">
                              {asset.Block}, {asset.Floor} {asset.Zone && `| Zone ${asset.Zone}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-600">
                        {asset.Commissioned_Date || asset.Purchase_Date}
                      </td>

                      {/* Warranty */}
                      <td className="py-3.5 px-5">
                        <span className="text-xs text-slate-600 font-mono">
                          {asset.Warranty_Expiry}
                        </span>
                      </td>

                      {/* Lifetime costs */}
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-800">
                        ${lifetimeSpent.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusBadge}`}>
                          {asset.Status}
                        </span>
                      </td>

                      {/* Actions */}
                      {role === 'Admin' && (
                        <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleEditClick(asset, e)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Asset specifications"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Asset Detail Panel Modal */}
      {selectedAssetForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 md:p-6" id="asset-details-modal">
          <div className="bg-white w-full max-w-2xl h-full md:h-[95vh] rounded-none md:rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between" id="details-container">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                      {selectedAssetForDetails.Asset_ID}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedAssetForDetails.Name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAssetForDetails(null)} 
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Asset Hero Image */}
              <div className="aspect-video w-full rounded-xl overflow-hidden relative border border-slate-200">
                <img 
                  src={selectedAssetForDetails.Photo_URL} 
                  alt={selectedAssetForDetails.Name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  {selectedAssetForDetails.Is_Mobile ? '🚚 Mobile Vehicle' : '🏢 Stationary Asset'}
                </div>
              </div>

              {/* Data metrics grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-400 uppercase tracking-wide font-semibold">Category</span>
                  <p className="font-bold text-slate-800 mt-1 text-sm">{selectedAssetForDetails.Category}</p>
                  <p className="text-slate-500 mt-0.5">{selectedAssetForDetails.Sub_Category}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-400 uppercase tracking-wide font-semibold">Asset Status</span>
                  <span className={`inline-flex items-center gap-1 font-bold mt-1 text-xs px-2 py-0.5 rounded-full border ${
                    selectedAssetForDetails.Status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedAssetForDetails.Status === 'Under Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200 animate-pulse'
                  }`}>
                    {selectedAssetForDetails.Status}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs col-span-2 md:col-span-1">
                  <span className="text-slate-400 uppercase tracking-wide font-semibold">Asset Value</span>
                  <p className="font-bold text-slate-800 mt-1 text-sm font-mono">${Number(selectedAssetForDetails.Current_Value).toLocaleString()}</p>
                  <p className="text-slate-400 mt-0.5">Purchased: ${Number(selectedAssetForDetails.Purchase_Cost).toLocaleString()}</p>
                </div>
              </div>

              {/* Specification parameters */}
              <div className="space-y-3.5">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-50 pb-1">Manufacturer Specifications</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400">Manufacturer:</span>
                    <span className="font-semibold text-slate-800 ml-1.5">{selectedAssetForDetails.Manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Model Name:</span>
                    <span className="font-semibold text-slate-800 ml-1.5">{selectedAssetForDetails.Model}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Serial Number:</span>
                    <span className="font-mono font-semibold text-slate-800 ml-1.5">{selectedAssetForDetails.Serial_No}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Warranty Expiry:</span>
                    <span className="font-mono font-semibold text-slate-800 ml-1.5">{selectedAssetForDetails.Warranty_Expiry}</span>
                  </div>
                </div>
              </div>

              {/* Workspace Documents */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-50 pb-1">Google Workspace Documents</h4>
                {selectedAssetForDetails.Drive_Doc_URL ? (
                  <a
                    href={selectedAssetForDetails.Drive_Doc_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 border border-indigo-100 background-indigo-50/20 hover:bg-slate-50 rounded-xl transition-all group"
                  >
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">SOP & Operational Spec Sheet</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Access live documentation template synced on Drive</span>
                    </div>
                  </a>
                ) : (
                  <p className="text-xs text-slate-400 italic">No Google Drive folders linked to this model</p>
                )}
              </div>

              {/* Geographic GIS Coordinates */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-50 pb-1">Geographic GIS Coordinates</h4>
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Latitude</span>
                      <span className="font-mono font-bold text-slate-800">{selectedAssetForDetails.Latitude}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Longitude</span>
                      <span className="font-mono font-bold text-slate-800">{selectedAssetForDetails.Longitude}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Notes */}
              {selectedAssetForDetails.Notes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-50 pb-1">Asset Operational Notes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-dashed text-justify">
                    {selectedAssetForDetails.Notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 flex gap-3">
              <button
                onClick={() => setSelectedAssetForDetails(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-lg border text-center transition-all"
              >
                Close Specifications
              </button>
              {role === 'Admin' && (
                <button
                  onClick={(e) => {
                    const ast = selectedAssetForDetails;
                    setSelectedAssetForDetails(null);
                    handleEditClick(ast, e);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-all"
                >
                  Edit Asset Specifications
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CRUD Add/Edit sliding form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 md:p-6" id="asset-crud-modal">
          <form 
            onSubmit={handleFormSubmit}
            className="bg-white w-full max-w-2xl h-full md:h-[95vh] rounded-none md:rounded-2xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingAsset ? `Edit Asset: ${editingAsset.Asset_ID}` : 'Register New Asset'}
                  </h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Asset Unique ID *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingAsset}
                    value={formAssetId}
                    onChange={(e) => setFormAssetId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-slate-50 disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Asset Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Main backup cooling system..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Core Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Electrical">⚡ Electrical</option>
                    <option value="HVAC/Mech">❄️ HVAC/Mech</option>
                    <option value="IT/Servers">🖥️ IT/Servers</option>
                    <option value="Vehicles">🚚 Vehicles</option>
                    <option value="Other">💼 Other</option>
                  </select>
                </div>

                {/* Sub category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Sub-Category Type</label>
                  <input
                    type="text"
                    placeholder="Chilled plant, EV Charger, battery storage"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Location Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Location Complex</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Block / Floor / Zone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Block / Level / Zone</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Bldg A"
                      value={formBlock}
                      onChange={(e) => setFormBlock(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Floor 3"
                      value={formFloor}
                      onChange={(e) => setFormFloor(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Suite 302"
                      value={formZone}
                      onChange={(e) => setFormZone(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">GIS Coordinates (Lat / Lng)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.00001"
                      value={formLatitude}
                      onChange={(e) => setFormLatitude(Number(e.target.value))}
                      className="p-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      step="0.00001"
                      value={formLongitude}
                      onChange={(e) => setFormLongitude(Number(e.target.value))}
                      className="p-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Mobile or stationary */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block mb-2">Fleet Mobility Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={!formIsMobile}
                        onChange={() => setFormIsMobile(false)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      🏢 Stationary Fixed System
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={formIsMobile}
                        onChange={() => setFormIsMobile(true)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      🚚 Mobile Fleet Vehicle
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Operational Health Status *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Broken">Broken</option>
                    <option value="In Storage">In Storage</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>

                {/* Manufacturer Specs */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 font-sans">Manufacturer Name</label>
                  <input
                    type="text"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 font-sans">Model / Part No.</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 font-sans">Serial Number</label>
                  <input
                    type="text"
                    value={formSerialNo}
                    onChange={(e) => setFormSerialNo(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                {/* Financial Values */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Purchase Date</label>
                  <input
                    type="date"
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Purchase CapEx Cost ($)</label>
                  <input
                    type="number"
                    value={formPurchaseCost}
                    onChange={(e) => setFormPurchaseCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Current Adjusted Book Value ($)</label>
                  <input
                    type="number"
                    value={formCurrentValue}
                    onChange={(e) => setFormCurrentValue(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600">Specification Documents / Photos URLs</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="url"
                      placeholder="Unsplash Photo URL..."
                      value={formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="url"
                      placeholder="Google Drive PDF SOP Doc URL..."
                      value={formDriveDocUrl}
                      onChange={(e) => setFormDriveDocUrl(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600">Operational Notes & Maintenance Safeguards</label>
                  <textarea
                    rows={3}
                    placeholder="Enter custom preventative care steps or breakdown notes..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                Cancel Registration
              </button>
              <button
                type="submit"
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-colors cursor-pointer"
              >
                Sync Specifications File
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
