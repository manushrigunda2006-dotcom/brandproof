'use client';

import React, { useState } from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { StatusBadge } from '../common/Badge';
import { ReviewStatus, Channel } from '../../types/brandproof';
import {
  Plus,
  Search,
  ArrowRight,
  FileText,
  Trash2,
} from 'lucide-react';

export function ReviewsListView() {
  const { reviews, setActiveScreen, setSelectedReviewId, deleteReview } = useBrandProof();
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | Channel>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (channelFilter !== 'all' && r.channel !== channelFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(term);
      const matchSubmitter = r.submittedBy.toLowerCase().includes(term);
      const matchDraft = r.currentDraft.toLowerCase().includes(term);
      if (!matchTitle && !matchSubmitter && !matchDraft) return false;
    }
    return true;
  });

  const handleOpenReview = (id: string) => {
    setSelectedReviewId(id);
    setActiveScreen('review-detail', id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Content Reviews</h2>
            <p className="text-sm text-slate-600 mt-1">
              All submitted content drafts, governance findings, and approval decisions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveScreen('new-review')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New review</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs & Channel Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: `All (${reviews.length})` },
                { id: 'in_review', label: `In Review (${reviews.filter(r => r.status === 'in_review').length})` },
                { id: 'changes_requested', label: `Changes Requested (${reviews.filter(r => r.status === 'changes_requested').length})` },
                { id: 'approved', label: `Approved (${reviews.filter(r => r.status === 'approved').length})` },
                { id: 'draft', label: `Drafts (${reviews.filter(r => r.status === 'draft').length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as 'all' | ReviewStatus)}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Filter reviews by channel"
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value as 'all' | Channel)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 ml-auto"
            >
              <option value="all">All Channels</option>
              <option value="blog">Blog</option>
              <option value="social">Social</option>
              <option value="landing_page">Landing Page</option>
              <option value="press_release">Press Release</option>
              <option value="email_newsletter">Newsletter</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, author, or content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Reviews Table / Card List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No content reviews match this filter.</p>
            <p className="text-slate-400">Try clearing your filters or create a new review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map(review => {
              const openCount = review.findings.filter(f => f.status === 'open').length;
              return (
                <div
                  key={review.id}
                  onClick={() => handleOpenReview(review.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {review.channel.replace('_', ' ')}
                      </span>
                      <StatusBadge status={review.status} />
                      {openCount > 0 ? (
                        <span className="font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                          {openCount} open {openCount === 1 ? 'issue' : 'issues'}
                        </span>
                      ) : (
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          All findings resolved
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {review.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {review.currentDraft}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span>Submitted by {review.submittedBy}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.reviewedBy && (
                        <>
                          <span>•</span>
                          <span>Reviewer: {review.reviewedBy}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <span className="text-xs font-semibold text-indigo-600 group-hover:underline flex items-center gap-1">
                      Inspect review
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('Delete this demo content review?')) {
                          deleteReview(review.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
