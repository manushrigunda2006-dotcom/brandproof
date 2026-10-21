'use client';

import React, { useState } from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { StatusBadge } from '../common/Badge';
import { DraftDiffView } from './DraftDiffView';
import { FindingCard } from './FindingCard';
import { ReviewTimeline } from './ReviewTimeline';
import { ApprovalModal } from './ApprovalModal';
import { RequestChangesModal } from './RequestChangesModal';
import {
  ArrowLeft,
  RotateCw,
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  Trash2,
} from 'lucide-react';

export function ReviewDetailView() {
  const {
    currentReview,
    activeRole,
    setActiveScreen,
    applySuggestion,
    undoSuggestion,
    dismissFinding,
    reopenFinding,
    addFindingComment,
    addReviewComment,
    submitForReview,
    requestChanges,
    approveReview,
    rerunReviewEngine,
    deleteReview,
    selectedFindingId,
    setSelectedFindingId,
    isEngineAnalyzing,
  } = useBrandProof();

  // Modals state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Filter state for findings
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'applied' | 'dismissed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!currentReview) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
        <p className="text-slate-600 text-sm">No review selected or review was deleted.</p>
        <button
          type="button"
          onClick={() => setActiveScreen('dashboard')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const openFindings = currentReview.findings.filter(f => f.status === 'open');
  const appliedFindings = currentReview.findings.filter(f => f.status === 'applied');
  const dismissedFindings = currentReview.findings.filter(f => f.status === 'dismissed');

  const filteredFindings = currentReview.findings.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    return true;
  });

  const handlePostReviewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addReviewComment(currentReview.id, newCommentText.trim());
    setNewCommentText('');
  };

  const isApproved = currentReview.status === 'approved';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Review Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveScreen('reviews')}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Reviews</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-xs uppercase font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Channel: {currentReview.channel.replace('_', ' ')}
              </span>
              <StatusBadge status={currentReview.status} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentReview.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span>Submitted by <strong className="text-slate-700">{currentReview.submittedBy}</strong></span>
              <span>•</span>
              <span>Created {new Date(currentReview.createdAt).toLocaleDateString()}</span>
              {currentReview.reviewedBy && (
                <>
                  <span>•</span>
                  <span>Reviewer: <strong className="text-slate-700">{currentReview.reviewedBy}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons based on Role & State */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            {/* Re-run button */}
            <button
              type="button"
              disabled={isEngineAnalyzing}
              onClick={() => rerunReviewEngine(currentReview.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Re-run deterministic BrandProof checks against current draft"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isEngineAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isEngineAnalyzing ? 'Scanning...' : 'Re-run Checks'}</span>
            </button>

            {/* Creator Actions */}
            {activeRole === 'creator' && (
              <>
                {(currentReview.status === 'draft' || currentReview.status === 'changes_requested') && (
                  <button
                    type="button"
                    onClick={() => submitForReview(currentReview.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </button>
                )}
              </>
            )}

            {/* Reviewer Actions */}
            {activeRole === 'reviewer' && (
              <>
                {!isApproved && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRequestChangesModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve Content</span>
                    </button>
                  </>
                )}
              </>
            )}

            {/* Delete button */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this demo content review?')) {
                  deleteReview(currentReview.id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rejection / Changes requested note banner */}
        {currentReview.status === 'changes_requested' && currentReview.rejectionNote && (
          <div className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Reviewer Requested Revisions:</span>
            </div>
            <p className="pl-6 leading-relaxed">&quot;{currentReview.rejectionNote}&quot;</p>
          </div>
        )}

        {/* Approval note banner */}
        {currentReview.status === 'approved' && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Approved for Publication:</span>
            </div>
            <p className="pl-6 leading-relaxed">
              {currentReview.approvalNote || 'Certified compliant with AuraScale Brand Guidelines by Marcus Vance.'}
            </p>
          </div>
        )}
      </div>

      {/* 2. Main Split Area: Draft (Left 60%) + Findings (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Draft Viewer & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Draft Viewer & Diff */}
          <DraftDiffView
            originalDraft={currentReview.originalDraft}
            currentDraft={currentReview.currentDraft}
            findings={currentReview.findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={id => setSelectedFindingId(id)}
          />

          {/* Static Image Preview if attached */}
          {currentReview.image && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">Attached Visual Asset Preview</h3>
                </div>
                <span className="text-[11px] text-slate-400">Local Browser Preview</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="w-40 h-28 rounded border border-slate-200 bg-white overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentReview.image.dataUrl}
                    alt={currentReview.image.altText || currentReview.image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">{currentReview.image.name}</span>
                    <span className="font-mono text-[10px] bg-slate-200 px-1 rounded">
                      {(currentReview.image.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Alt text:</span>{' '}
                    <span className="italic text-slate-800">
                      {currentReview.image.altText ? `"${currentReview.image.altText}"` : '(None provided)'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Governance Note:</span> Visual asset checks evaluate minimum clear space and screen-reader accessibility.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Level Comments */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Review Comments & Collaboration</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{currentReview.comments.length} notes</span>
            </div>

            {currentReview.comments.length > 0 ? (
              <div className="space-y-2.5">
                {currentReview.comments.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{c.author}</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No general review comments yet.</p>
            )}

            <form onSubmit={handlePostReviewComment} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder={`Comment as ${activeRole === 'creator' ? 'Creator' : 'Reviewer'}...`}
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs"
              >
                Post
              </button>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <ReviewTimeline activities={currentReview.activities} />
          </div>
        </div>

        {/* Right Column: Findings List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Brand Governance Findings</h3>
                <p className="text-xs text-slate-500">
                  {openFindings.length} open • {appliedFindings.length} applied • {dismissedFindings.length} dismissed
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                {currentReview.findings.length} Total
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-1">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({currentReview.findings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('open')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'open'
                      ? 'bg-rose-700 text-white'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Open ({openFindings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('applied')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'applied'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Applied ({appliedFindings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('dismissed')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    statusFilter === 'dismissed'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dismissed ({dismissedFindings.length})
                </button>
              </div>

              <select
                aria-label="Filter findings by category"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="all">All Categories</option>
                <option value="restricted_claim">Restricted Claims</option>
                <option value="terminology">Terminology</option>
                <option value="fact_verification">Fact Verification</option>
                <option value="voice_tone">Voice & Tone</option>
                <option value="accessibility">Accessibility</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Findings explain the specific rule citation. Applying a suggestion updates your draft immediately with an undo option.
            </p>
          </div>

          {/* Findings List */}
          {filteredFindings.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No findings in this view.</p>
              <p className="text-slate-500 mt-1">All items in this category or status have been resolved.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFindings.map(finding => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  isSelected={selectedFindingId === finding.id}
                  onSelect={() => setSelectedFindingId(finding.id)}
                  onApply={() => applySuggestion(currentReview.id, finding.id)}
                  onUndo={() => undoSuggestion(currentReview.id, finding.id)}
                  onDismiss={reason => dismissFinding(currentReview.id, finding.id, reason)}
                  onReopen={() => reopenFinding(currentReview.id, finding.id)}
                  onAddComment={text => addFindingComment(currentReview.id, finding.id, text)}
                  activeRole={activeRole}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={note => approveReview(currentReview.id, note)}
        reviewTitle={currentReview.title}
        openFindingsCount={openFindings.length}
      />

      {/* Request Changes Modal */}
      <RequestChangesModal
        isOpen={showRequestChangesModal}
        onClose={() => setShowRequestChangesModal(false)}
        onSubmit={note => requestChanges(currentReview.id, note)}
        reviewTitle={currentReview.title}
      />
    </div>
  );
}
