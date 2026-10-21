'use client';

import React, { useState } from 'react';
import { Finding, Role } from '../../types/brandproof';
import { SeverityBadge, CategoryBadge } from '../common/Badge';
import {
  Check,
  RotateCcw,
  EyeOff,
  MessageSquare,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
  isSelected: boolean;
  onSelect: () => void;
  onApply: () => void;
  onUndo: () => void;
  onDismiss: (reason?: string) => void;
  onReopen: () => void;
  onAddComment: (text: string) => void;
  activeRole?: Role;
}

export function FindingCard({
  finding,
  isSelected,
  onSelect,
  onApply,
  onUndo,
  onDismiss,
  onReopen,
  onAddComment,
}: FindingCardProps) {
  const [showDismissInput, setShowDismissInput] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showGuidelineDetails, setShowGuidelineDetails] = useState(false);

  const handleDismissSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDismiss(dismissReason.trim() || 'Reviewed and dismissed by creator');
    setShowDismissInput(false);
    setDismissReason('');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
    setShowCommentInput(false);
  };

  const isApplied = finding.status === 'applied';
  const isDismissed = finding.status === 'dismissed';

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border text-xs transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-600/10'
          : isDismissed
          ? 'border-slate-200 bg-slate-50/70 opacity-60 hover:opacity-90'
          : isApplied
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Header: Category, Severity, Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge category={finding.category} />
          <SeverityBadge severity={finding.severity} />
        </div>

        {isApplied && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3" />
            Applied
          </span>
        )}

        {isDismissed && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
            Dismissed
          </span>
        )}
      </div>

      {/* Flagged Item Quote */}
      <div className="mb-2">
        <span className="text-[11px] text-slate-500 font-medium">Flagged text:</span>
        <div className="mt-0.5 p-2 bg-slate-100 rounded border border-slate-200/80 font-mono text-[11px] text-slate-900 break-words">
          &quot;{finding.flaggedText}&quot;
        </div>
      </div>

      {/* Plain Language Explanation */}
      <p className="text-slate-700 leading-relaxed text-xs mb-3">
        {finding.explanation}
      </p>

      {/* Guideline / Fact Reference Citation */}
      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{finding.guidelineRef.title}</span>
          </div>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowGuidelineDetails(!showGuidelineDetails);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            title="Toggle source citation"
          >
            {showGuidelineDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate font-mono">Ref: {finding.guidelineRef.id}</span>
          <span className="font-medium text-slate-600">{finding.guidelineRef.version}</span>
        </div>

        {showGuidelineDetails && (
          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p>
              <span className="font-semibold text-slate-800">Source:</span> {finding.guidelineRef.source}
            </p>
            {finding.guidelineRef.reviewDate && (
              <p>
                <span className="font-semibold text-slate-800">Review Date:</span> {finding.guidelineRef.reviewDate}
              </p>
            )}
            <p className="italic text-slate-500">{finding.guidelineRef.ruleSummary}</p>
          </div>
        )}
      </div>

      {/* Suggested Correction Pill if available */}
      {finding.suggestedCorrection && (
        <div className="mb-3 p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-1">
          <span className="text-[11px] font-semibold text-indigo-900 block">Suggested Correction:</span>
          <p className="text-xs font-medium text-indigo-950 font-mono break-words">
            {finding.suggestedCorrection}
          </p>
        </div>
      )}

      {/* Dismissal Reason Note if dismissed */}
      {isDismissed && finding.dismissReason && (
        <div className="mb-3 p-2 bg-slate-100 rounded text-[11px] text-slate-600 italic">
          Dismissed reason: &quot;{finding.dismissReason}&quot;
        </div>
      )}

      {/* Existing Comments */}
      {finding.comments.length > 0 && (
        <div className="mb-3 space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-700 block">Notes & Discussion:</span>
          {finding.comments.map(c => (
            <div key={c.id} className="p-2 rounded bg-slate-50 border border-slate-200/60 text-[11px]">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                <span className="font-semibold text-slate-700">{c.author}</span>
                <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-slate-700">{c.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dismiss Input Box */}
      {showDismissInput && (
        <form onSubmit={handleDismissSubmit} onClick={e => e.stopPropagation()} className="mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <label className="block text-[11px] font-semibold text-slate-700">
            Dismissal Rationale (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Legal approved exception, or creative campaign context"
            value={dismissReason}
            onChange={e => setDismissReason(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowDismissInput(false)}
              className="px-2 py-1 rounded text-slate-600 hover:bg-slate-200 text-[11px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-slate-800 text-white font-medium text-[11px] hover:bg-slate-900"
            >
              Confirm Dismiss
            </button>
          </div>
        </form>
      )}

      {/* Comment Input Box */}
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} onClick={e => e.stopPropagation()} className="mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <label className="block text-[11px] font-semibold text-slate-700">
            Add Comment / Explanation
          </label>
          <input
            type="text"
            required
            placeholder="Add a question or note for the reviewer..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowCommentInput(false)}
              className="px-2 py-1 rounded text-slate-600 hover:bg-slate-200 text-[11px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium text-[11px] hover:bg-indigo-700"
            >
              Post Note
            </button>
          </div>
        </form>
      )}

      {/* Action Buttons */}
      <div
        className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {finding.suggestedCorrection && !isDismissed && (
            <>
              {!isApplied ? (
                <button
                  type="button"
                  onClick={onApply}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  <Check className="w-3 h-3" />
                  <span>Apply Suggestion</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onUndo}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Undo</span>
                </button>
              )}
            </>
          )}

          {!isDismissed ? (
            <button
              type="button"
              onClick={() => setShowDismissInput(!showDismissInput)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <EyeOff className="w-3 h-3" />
              <span>Dismiss</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReopen}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-indigo-600 hover:bg-indigo-50 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reopen</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}
