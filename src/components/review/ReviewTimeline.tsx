'use client';

import React from 'react';
import { ReviewActivity } from '../../types/brandproof';
import { User, ShieldCheck } from 'lucide-react';

interface ReviewTimelineProps {
  activities: ReviewActivity[];
}

export function ReviewTimeline({ activities }: ReviewTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No recorded activities yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
          Governance Activity & Audit Trail
        </h4>
        <span className="text-[11px] text-slate-400 font-mono">{activities.length} events</span>
      </div>

      <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act, index) => {
          const isApproval = act.action.toLowerCase().includes('approved');
          const isRejection = act.action.toLowerCase().includes('change');
          const isEngine = act.author.includes('Engine');

          return (
            <div key={act.id || index} className="relative group text-xs">
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                  isApproval
                    ? 'bg-emerald-600'
                    : isRejection
                    ? 'bg-amber-600'
                    : isEngine
                    ? 'bg-indigo-600'
                    : 'bg-slate-400'
                }`}
              />

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-800">{act.action}</span>
                  <span className="text-slate-400 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  {act.role === 'reviewer' ? (
                    <ShieldCheck className="w-3 h-3 text-teal-700 shrink-0" />
                  ) : (
                    <User className="w-3 h-3 text-indigo-600 shrink-0" />
                  )}
                  <span className="font-medium text-slate-700">{act.author}</span>
                </div>

                {act.details && (
                  <p className="text-[11px] text-slate-600 pt-0.5 leading-relaxed">
                    {act.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
