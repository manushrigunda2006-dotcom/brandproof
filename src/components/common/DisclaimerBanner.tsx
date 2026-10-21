'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export function DisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-800">Demo Prototype:</span> All metrics, guidelines, and organization data (AuraScale Cloud) are simulated. Findings are transparent suggestions for human review—content is never silently modified or published. Drafts and uploads remain strictly local to this browser session.
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition-colors shrink-0"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function DemoNoticeBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      Demo Data
    </span>
  );
}
