'use client';

import React from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { User, ShieldCheck } from 'lucide-react';

export function RoleSwitch() {
  const { activeRole, setActiveRole } = useBrandProof();

  return (
    <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
      <button
        type="button"
        onClick={() => setActiveRole('creator')}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
          activeRole === 'creator'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={activeRole === 'creator'}
        title="Creator role: Edit drafts, apply or dismiss suggested corrections, and submit for review"
      >
        <User className="w-3.5 h-3.5 text-indigo-600" />
        <span>Creator</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveRole('reviewer')}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
          activeRole === 'reviewer'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={activeRole === 'reviewer'}
        title="Reviewer role: Inspect brand findings, request changes, and make final deliberate approval decisions"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
        <span>Reviewer</span>
      </button>
    </div>
  );
}
