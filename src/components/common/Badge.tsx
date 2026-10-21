import React from 'react';
import { FindingCategory, FindingSeverity, ReviewStatus } from '../../types/brandproof';

interface SeverityBadgeProps {
  severity: FindingSeverity;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';
  
  switch (severity) {
    case 'critical':
      return (
        <span className={`inline-flex items-center font-medium rounded border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          Critical Blocker
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center font-medium rounded border border-amber-200 bg-amber-50 text-amber-800 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Brand Warning
        </span>
      );
    case 'guidance':
      return (
        <span className={`inline-flex items-center font-medium rounded border border-sky-200 bg-sky-50 text-sky-800 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5" />
          Guidance / Info
        </span>
      );
  }
}

interface CategoryBadgeProps {
  category: FindingCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const map: Record<FindingCategory, { label: string; bg: string; text: string; border: string }> = {
    restricted_claim: {
      label: 'Restricted Claim',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
    },
    terminology: {
      label: 'Terminology',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    fact_verification: {
      label: 'Fact Verification',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
    },
    voice_tone: {
      label: 'Voice & Tone',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
    accessibility: {
      label: 'Accessibility',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
  };

  const item = map[category] || {
    label: category,
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.bg} ${item.text} ${item.border}`}>
      {item.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: ReviewStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <svg className="w-3 h-3 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Approved for Publication
        </span>
      );
    case 'changes_requested':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
          <svg className="w-3 h-3 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Changes Requested
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1.5 animate-pulse" />
          In Governance Review
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Draft (Unsubmitted)
        </span>
      );
  }
}
