import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, CheckCircle2, AlertCircle, Volume2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthenticate }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'viewer'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Load dynamic customizable admin credentials with defaults
  const savedAdminUser = typeof window !== 'undefined' ? (localStorage.getItem('assetops_admin_username') || 'admin') : 'admin';
  const savedAdminPass = typeof window !== 'undefined' ? (localStorage.getItem('assetops_admin_password') || 'admin123') : 'admin123';

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    // Match either custom credentials or standard credentials fallback
    const isUserValid = cleanUser === savedAdminUser.trim().toLowerCase() || cleanUser === 'admin' || cleanUser === 'administrator';
    const isPassValid = cleanPass === savedAdminPass.trim() || cleanPass === 'admin123' || cleanPass === 'admin';

    if (isUserValid && isPassValid) {
      setSuccess(true);
      setTimeout(() => {
        onAuthenticate('EAFA2026ADMIN');
        setSuccess(false);
        setUsername('');
        setPassword('');
        onClose();
      }, 800);
    } else {
      setErrorMsg(`Invalid credentials. Hint: use Username "${savedAdminUser}" and Password "${savedAdminPass}"`);
    }
  };

  const handleViewerAccess = () => {
    setSuccess(true);
    setTimeout(() => {
      onAuthenticate('EAFA2026VIEW');
      setSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="auth-modal-overlay">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={() => {
          // If we want it strictly modal-like, we can allow clicking outside to dismiss only if they have been logged in once, 
          // but to keep it safe let's allow closing to check out standard state
          onClose();
        }}
        id="auth-modal-backdrop"
      />
      
      {/* Centered Credential Card container */}
      <div 
        className="relative bg-white border border-slate-100 w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        id="auth-modal-container"
      >
        {/* Color stripe visual header */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />
        
        <div className="p-6 sm:p-8">
          
          {/* Headline branding info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display tracking-tight leading-none">
              AssetOps System Access
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-normal">
              Authorize secure Google Workspace & Sandbox database privileges
            </p>
          </div>

          {/* Selector Switch Mode slider */}
          <div className="bg-slate-50 border border-slate-200/50 p-1 rounded-xl grid grid-cols-2 gap-1 mb-6">
            <button
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Admin Mode
            </button>
            <button
              onClick={() => {
                setActiveTab('viewer');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'viewer' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Viewer (View Only)
            </button>
          </div>

          {/* Success screen placeholder */}
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3" id="auth-success-screen">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
              <span className="text-sm font-bold text-slate-800 block text-center">Authentication Granted!</span>
              <p className="text-xs text-slate-400 text-center font-mono">Directing to control dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === 'admin' ? (
                /* ADMIN ACCESS INTERFACE FORM */
                <form onSubmit={handleAdminSubmit} className="space-y-4" id="auth-admin-form">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g., admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        id="auth-input-username"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9.5 pr-10 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono"
                        id="auth-input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        id="auth-password-toggle-btn"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-[11px] text-rose-800 text-justify leading-relaxed" id="auth-error-banner">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Hints container box */}
                  <div className="bg-slate-50/70 border border-slate-250/20 px-3.5 py-2.5 rounded-xl text-[10px] text-slate-500 leading-normal animate-in fade-in">
                    <span className="font-bold text-slate-700 block mb-0.5">💡 Credentials Access Info</span>
                    {savedAdminPass === 'admin123' && savedAdminUser === 'admin' ? (
                      <>
                        Authenticate using default username <strong className="text-indigo-600 font-bold bg-indigo-50 px-0.5 rounded-sm">admin</strong> and password <strong className="text-indigo-600 font-bold bg-indigo-50 px-0.5 rounded-sm">admin123</strong> to experience complete administration.
                      </>
                    ) : (
                      <>
                        Using custom administrator credentials. User: <strong className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded-sm">{savedAdminUser}</strong> / Password: <strong className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded-sm">{savedAdminPass}</strong>.
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id="auth-admin-submit-btn"
                  >
                    Authenticate as Administrator
                  </button>
                </form>
              ) : (
                /* VIEWER ZERO-CREDENTIAL ACCESS PANEL */
                <div className="space-y-5 py-2 text-center" id="auth-viewer-form">
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto text-justify bg-slate-50 border p-4 rounded-2xl">
                    By choosing **Viewer Access**, you bypass the credential portal completely. You will enter the live analytical dashboard immediately with complete coverage of assets, Schedules, and PM metrics in <strong>Read-Only View Mode</strong>.
                  </p>
                  
                  <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl text-[10.5px] text-indigo-800 text-justify leading-relaxed">
                    🌟 <strong>Full Privilege Hint:</strong> To configure GSheets integrations or mutate asset entries later, select <strong>Admin Mode</strong> above at any time.
                  </div>

                  <button
                    onClick={handleViewerAccess}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id="auth-viewer-bypass-btn"
                  >
                    Continue directly to Viewer Dashboard
                  </button>
                </div>
              )}
            </>
          )}

          {/* Dialog footer controls to exit if already logged in */}
          <div className="mt-5 pt-3.5 border-t border-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              id="auth-dismiss-btn"
            >
              Close Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
