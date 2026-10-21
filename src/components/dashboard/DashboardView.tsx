'use client';

import React from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import {
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function DashboardView() {
  const { reviews, setActiveScreen, setSelectedReviewId, brandKit } = useBrandProof();

  const pendingReviews = reviews.filter(
    r => r.status === 'in_review' || r.status === 'changes_requested'
  );

  const approvedReviews = reviews.filter(r => r.status === 'approved');

  // Compute small recurring issues summary
  const issueCounts: Record<string, { count: number; name: string }> = {
    restricted_claim: { count: 0, name: 'Restricted Claims & Superlatives' },
    terminology: { count: 0, name: 'Deprecated Product Terminology' },
    fact_verification: { count: 0, name: 'Unverified SLA & Audit Facts' },
    voice_tone: { count: 0, name: 'Colloquial Slang & Tone' },
    accessibility: { count: 0, name: 'Missing Image Alt Text' },
  };

  reviews.forEach(r => {
    r.findings.forEach(f => {
      if (issueCounts[f.category]) {
        issueCounts[f.category].count += 1;
      }
    });
  });

  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  const handleOpenReview = (id: string) => {
    setSelectedReviewId(id);
    setActiveScreen('review-detail', id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome Area */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Pre-Publication Governance
              </span>
              <span className="text-xs text-slate-500 font-medium">Organization: {brandKit.organizationName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Review draft content against approved guidelines and facts
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              BrandProof flags potential compliance issues and explains each one using approved brand standards. Findings are transparent suggestions—content is never silently rewritten or approved without deliberate human review.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveScreen('brandkit')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Inspect Brand Kit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen('new-review')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New review</span>
            </button>
          </div>
        </div>

        {/* Small Metric Badges with clear Demo marker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Reviews</span>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">{pendingReviews.length}</p>
            <span className="text-[11px] text-slate-400">Awaiting creator / reviewer</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approved Reviews</span>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">{approvedReviews.length}</p>
            <span className="text-[11px] text-slate-400">Deliberate human sign-off</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Active Guidelines</span>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {brandKit.restrictedClaims.length + brandKit.terminology.length + brandKit.approvedFacts.length}
            </p>
            <span className="text-[11px] text-slate-400">Deterministic checks</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
              <span>Open Findings</span>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {reviews.reduce((acc, r) => acc + r.findings.filter(f => f.status === 'open').length, 0)}
            </p>
            <span className="text-[11px] text-slate-400">Simulated demo dataset</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Pending Reviews (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Reviews Requiring Attention</h3>
                <p className="text-xs text-slate-500 mt-0.5">Content drafts in review or with change requests</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveScreen('reviews')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
                No pending reviews. Submit a new draft to test the brand governance workflow.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingReviews.map(review => {
                  const openFindings = review.findings.filter(f => f.status === 'open');
                  return (
                    <div
                      key={review.id}
                      onClick={() => handleOpenReview(review.id)}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs uppercase font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {review.channel.replace('_', ' ')}
                          </span>
                          <StatusBadge status={review.status} />
                          {openFindings.length > 0 && (
                            <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {openFindings.length} open {openFindings.length === 1 ? 'issue' : 'issues'}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {review.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Submitted by {review.submittedBy} • Updated {new Date(review.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-xs font-medium text-indigo-600 group-hover:underline flex items-center gap-1">
                          Inspect findings
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Reviews List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Recent Content Reviews</h3>
                <p className="text-xs text-slate-500 mt-0.5">All submitted materials with governance state</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {reviews.slice(0, 4).map(review => (
                <div
                  key={review.id}
                  onClick={() => handleOpenReview(review.id)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-600">
                      {review.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize">{review.channel.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.findings.length > 0 ? (
                        <>
                          <span>•</span>
                          <span>{review.findings.length} findings checked</span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600">Clean</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={review.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recurring Issues Summary (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-sm">Recurring Brand Issues</h3>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Demo Summary</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Most frequent issues detected across sample reviews in AuraScale Cloud:
            </p>

            <div className="space-y-3.5">
              {topIssues.map(([key, data]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{data.name}</span>
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 text-[11px] font-bold">
                      {data.count} flagged
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {key === 'restricted_claim' && 'Superlatives like "fastest cloud" require legal audit benchmark citations.'}
                    {key === 'terminology' && 'Uncapitalized product names (e.g. "cloudscale" vs "CloudScale Core").'}
                    {key === 'fact_verification' && 'Unverified SLA guarantees (e.g. "99.999%" vs approved "99.99%").'}
                    {key === 'voice_tone' && 'Informal conversational slang detected in technical copy.'}
                    {key === 'accessibility' && 'Missing descriptive alternative text on graphic assets.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveScreen('insights')}
                className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Inspect detailed governance insights →
              </button>
            </div>
          </div>

          {/* Human Governance Reminder */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Deliberate Human Sign-Off</span>
            </div>
            <p className="leading-relaxed">
              BrandProof never publishes or modifies drafts on its own. Authors decide whether to accept recommendations, and only authorized reviewers can approve final releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
