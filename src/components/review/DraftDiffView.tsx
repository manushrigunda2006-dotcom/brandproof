'use client';

import React, { useState } from 'react';
import { Finding } from '../../types/brandproof';
import { CheckCircle2 } from 'lucide-react';

interface DraftDiffViewProps {
  originalDraft: string;
  currentDraft: string;
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
}

export function DraftDiffView({
  originalDraft,
  currentDraft,
  findings,
  selectedFindingId,
  onSelectFinding,
}: DraftDiffViewProps) {
  const [viewMode, setViewMode] = useState<'interactive' | 'diff' | 'side-by-side'>('interactive');

  const hasChanges = originalDraft !== currentDraft;

  // Render interactive text with flagged highlights
  const renderInteractiveText = () => {
    // Find all open/applied findings that have exact match in currentDraft
    const matches: { start: number; end: number; finding: Finding }[] = [];

    findings.forEach(f => {
      // If applied, search for suggestedCorrection, else search for flaggedText
      const searchText = f.status === 'applied' && f.suggestedCorrection
        ? f.suggestedCorrection
        : f.flaggedText;

      let idx = 0;
      while ((idx = currentDraft.indexOf(searchText, idx)) !== -1) {
        matches.push({
          start: idx,
          end: idx + searchText.length,
          finding: f,
        });
        idx += searchText.length;
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build segment array
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (match.start < lastIndex) continue; // skip overlapping

      if (match.start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>{currentDraft.substring(lastIndex, match.start)}</span>
        );
      }

      const f = match.finding;
      const isSelected = selectedFindingId === f.id;
      const isApplied = f.status === 'applied';
      const isDismissed = f.status === 'dismissed';

      let bgClass = 'bg-amber-100 border-b-2 border-amber-500 text-amber-950';
      if (f.category === 'restricted_claim') {
        bgClass = 'bg-rose-100 border-b-2 border-rose-500 text-rose-950';
      } else if (f.category === 'terminology') {
        bgClass = 'bg-emerald-100 border-b-2 border-emerald-500 text-emerald-950';
      }

      if (isApplied) {
        bgClass = 'bg-emerald-50 border-b-2 border-emerald-400 text-emerald-900';
      } else if (isDismissed) {
        bgClass = 'bg-slate-100 line-through text-slate-500';
      }

      segments.push(
        <button
          key={`highlight-${match.start}`}
          type="button"
          onClick={() => onSelectFinding(f.id)}
          className={`inline px-1 py-0.5 rounded text-left font-medium transition-all ${bgClass} ${
            isSelected ? 'ring-2 ring-indigo-600 font-bold shadow-xs' : 'hover:opacity-80'
          }`}
          title={`Click to inspect finding: ${f.explanation}`}
        >
          {currentDraft.substring(match.start, match.end)}
        </button>
      );

      lastIndex = match.end;
    }

    if (lastIndex < currentDraft.length) {
      segments.push(
        <span key={`text-end`}>{currentDraft.substring(lastIndex)}</span>
      );
    }

    return (
      <div className="p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
        {segments}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Bar with Mode Switcher & Change Indicator */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'interactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Draft
          </button>
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'diff'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revision Diff {hasChanges && '• Changed'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {hasChanges ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Suggestions applied to draft
            </span>
          ) : (
            <span className="text-slate-500">Original draft unchanged</span>
          )}
        </div>
      </div>

      {/* Content Area Based on Mode */}
      <div className="min-h-[320px]">
        {viewMode === 'interactive' && (
          <div>
            {renderInteractiveText()}
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Click any highlighted phrase to inspect its brand guideline</span>
              <span>{findings.filter(f => f.status === 'open').length} open findings</span>
            </div>
          </div>
        )}

        {viewMode === 'diff' && (
          <div className="p-5 text-sm leading-relaxed space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Visualizing original submitted draft against current working draft:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded bg-rose-200 inline-block border border-rose-400" />
                  Original
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-200 inline-block border border-emerald-400" />
                  Current (Applied)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Original Draft:</h4>
                <div className="p-3 bg-rose-50/40 rounded-lg border border-rose-200 text-slate-800 text-sm whitespace-pre-wrap">
                  {originalDraft}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Working Draft:</h4>
                <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200 text-slate-800 text-sm whitespace-pre-wrap">
                  {currentDraft}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs sm:text-sm">
            <div className="p-4 sm:p-5 space-y-2">
              <span className="font-semibold text-slate-700 block pb-1 border-b border-slate-100">
                Original Draft (Preserved)
              </span>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {originalDraft}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-2 bg-slate-50/30">
              <span className="font-semibold text-slate-900 block pb-1 border-b border-slate-100">
                Current Working Draft
              </span>
              <div className="whitespace-pre-wrap text-slate-900 leading-relaxed font-medium">
                {currentDraft}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
