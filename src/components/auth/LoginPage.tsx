import React, { useState } from 'react';
import { soundFX } from '../../utils/soundEffects';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Radio,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Terminal,
  Fingerprint
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [analystId, setAnalystId] = useState('ANALYST-RATHORE-08');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [clearanceLevel, setClearanceLevel] = useState('LEVEL-4-FORENSICS');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playScan();
    setIsAuthenticating(true);
    setAuthStage('Verifying cryptographic token...');

    setTimeout(() => {
      setAuthStage('Validating Level 4 clearance...');
    }, 400);

    setTimeout(() => {
      setAuthStage('Establishing encrypted session...');
      soundFX.playSuccess();
    }, 800);

    setTimeout(() => {
      onLogin();
    }, 1100);
  };

  return (
    <div className="min-h-screen w-screen bg-[#030712] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#030712] to-[#02050b] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Security Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-cyan-950/70 pb-3 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-2 text-cyan-400">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-widest">CENTRAL CYBER CRIME & FORENSIC INTELLIGENCE COMMAND</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px]">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>FIPS 140-3 COMPLIANT // RESTRICTED ACCESS</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-[#080e1a]/95 border border-cyan-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl relative space-y-6">
          {/* System Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-950 via-[#091526] to-[#040810] border border-cyan-500/50 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/80">
              <Shield className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight pt-1">
              AI-Powered Criminal Network Analysis System
            </h1>

            <p className="text-xs text-cyan-400/90 font-mono tracking-wider font-semibold">
              INVESTIGATOR AUTHENTICATION GATEWAY
            </p>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Analyst ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Analyst Identifier / Badge No.</span>
              </label>
              <input
                type="text"
                value={analystId}
                onChange={(e) => setAnalystId(e.target.value)}
                required
                className="w-full bg-[#040811] border border-slate-800 hover:border-cyan-500/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-lg px-3.5 py-2.5 text-white text-xs outline-none transition-all font-mono"
                placeholder="e.g. INSP-88210-CYBER"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Secure Passphrase</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#040811] border border-slate-800 hover:border-cyan-500/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-lg pl-3.5 pr-10 py-2.5 text-white text-xs outline-none transition-all font-mono"
                  placeholder="Enter cryptographic passphrase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Clearance Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Clearance Level</span>
              </label>
              <select
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(e.target.value)}
                className="w-full bg-[#040811] border border-slate-800 text-cyan-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                <option value="LEVEL-4-FORENSICS">LEVEL 4 // FORENSIC INTELLIGENCE SPECIALIST</option>
                <option value="LEVEL-3-INVESTIGATOR">LEVEL 3 // SENIOR CYBER INVESTIGATOR</option>
                <option value="DIRECTORATE">COMMAND // CHIEF SUPERINTENDENT DIRECTIVE</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold tracking-wider rounded-lg text-xs uppercase transition-all shadow-lg shadow-cyan-950/80 cursor-pointer flex items-center justify-center gap-2 ring-1 ring-cyan-400/50 disabled:opacity-70"
              >
                {isAuthenticating ? (
                  <>
                    <Fingerprint className="w-4 h-4 animate-pulse text-white" />
                    <span>{authStage}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>AUTHENTICATE & ENTER CONSOLE</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Access Helper */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <button
              onClick={onLogin}
              className="text-[11px] text-cyan-400/90 hover:text-cyan-300 font-mono underline decoration-cyan-500/40 cursor-pointer transition-colors"
            >
              &bull; Instant One-Click Investigator Entry &bull;
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Legal Disclaimer */}
      <footer className="relative z-10 border-t border-cyan-950/70 pt-3 text-center font-mono text-[10px] text-slate-500">
        AUTHORIZED LAW ENFORCEMENT & JUDICIAL PERSONNEL ONLY. ALL ACTIVITIES ARE RECORDED IN AN AUDIT LOG.
      </footer>
    </div>
  );
};
