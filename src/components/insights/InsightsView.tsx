'use client';

import React from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import {
  BarChart3,
  Lightbulb,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { FindingCategory } from '../../types/brandproof';

export function InsightsView() {
  const { reviews, brandKit, setActiveScreen } = useBrandProof();

  // Aggregate findings
  let totalFindings = 0;
  let appliedFindings = 0;
  let dismissedFindings = 0;
  let openFindings = 0;

  const categoryCounts: Record<FindingCategory, number> = {
    restricted_claim: 0,
    terminology: 0,
    fact_verification: 0,
    voice_tone: 0,
    accessibility: 0,
  };

  const guidelineTriggers: Record<string, { count: number; title: string; category: FindingCategory; source: string }> = {};

  reviews.forEach(r => {
    r.findings.forEach(f => {
      totalFindings++;
      if (f.status === 'applied') appliedFindings++;
      else if (f.status === 'dismissed') dismissedFindings++;
      else openFindings++;

      if (categoryCounts[f.category] !== undefined) {
        categoryCounts[f.category]++;
      }

      const gid = f.guidelineRef.id;
      if (!guidelineTriggers[gid]) {
        guidelineTriggers[gid] = {
          count: 0,
          title: f.guidelineRef.title,
          category: f.category,
          source: f.guidelineRef.source,
        };
      }
      guidelineTriggers[gid].count++;
    });
  });

  const sortedGuidelines = Object.entries(guidelineTriggers).sort((a, b) => b[1].count - a[1].count);

  const sampleSize = reviews.length;
  const avgFindingsPerReview = sampleSize > 0 ? (totalFindings / sampleSize).toFixed(1) : '0';

  const categoryLabels: Record<FindingCategory, string> = {
    restricted_claim: 'Restricted Claims & Superlatives',
    terminology: 'Deprecated Brand Terminology',
    fact_verification: 'Unverified SLA & Audit Facts',
    voice_tone: 'Voice & Tone Inconsistencies',
    accessibility: 'Accessibility & Asset Notes',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Sample Size & Demo Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Governance Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">Sample Size: {sampleSize} Demo Reviews</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Recurring Issues & Guideline Clarity
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Synthesized from local demo content reviews for {brandKit.organizationName}. Helps brand managers identify which guidelines cause repeated friction or ambiguity.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 max-w-xs shrink-0">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-0.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulated Prototype Data</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Metrics describe only the seeded sample reviews. Not representative of any real enterprise operations.
            </p>
          </div>
        </div>

        {/* High-level Summary Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Sample Reviews Analyzed</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{sampleSize}</p>
            <span className="text-[11px] text-slate-400">Total submitted drafts</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Total Issues Flagged</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalFindings}</p>
            <span className="text-[11px] text-slate-400">Avg {avgFindingsPerReview} per draft</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Resolution Adoption Rate</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {totalFindings > 0 ? `${Math.round((appliedFindings / totalFindings) * 100)}%` : '0%'}
            </p>
            <span className="text-[11px] text-slate-400">{appliedFindings} applied • {openFindings} open</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Dismissal / Exemption Rate</span>
            <p className="text-2xl font-bold text-slate-700 mt-1">
              {totalFindings > 0 ? `${Math.round((dismissedFindings / totalFindings) * 100)}%` : '0%'}
            </p>
            <span className="text-[11px] text-slate-400">{dismissedFindings} user exemptions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 text-base">Recurring Issue Categories</h3>
            </div>
            <span className="text-xs text-slate-400">Frequency breakdown</span>
          </div>

          <div className="space-y-4 pt-1">
            {(Object.entries(categoryCounts) as [FindingCategory, number][]).map(([cat, count]) => {
              const pct = totalFindings > 0 ? Math.round((count / totalFindings) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{categoryLabels[cat]}</span>
                    <span className="font-mono text-slate-600">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
            Restricted claims and unverified terminology account for over 65% of flagged items, indicating creators need clearer quick-reference cards during copywriting.
          </p>
        </div>

        {/* 2. Potentially Unclear Guidelines */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-slate-900 text-base">Potentially Unclear Guidelines</h3>
            </div>
            <span className="text-xs text-slate-400">Governance Recommendations</span>
          </div>

          <div className="space-y-3 pt-1">
            {sortedGuidelines.slice(0, 3).map(([gid, info]) => (
              <div key={gid} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 text-[10px]">
                      {gid}
                    </span>
                    <h4 className="font-semibold text-slate-900">{info.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {info.count} triggers
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {gid.includes('CLAIM-01') &&
                    'Superlative speed phrasing repeatedly triggered. Recommendation: Add pre-approved benchmark phrasings and accredited TPC-C audit links to Brand Kit so creators have ready-to-use compliant options.'}
                  {gid.includes('CLAIM-02') &&
                    'Security phrasing (e.g. "unbreakable", "100% bug-free") frequently used in marketing. Recommendation: Clarify in style guidelines that all security claims must mention defense-in-depth posture.'}
                  {gid.includes('FACT-01') &&
                    'SLA uptime repeatedly written as five-nines (99.999%) instead of 99.99%. Recommendation: Distribute one-pager clarifying contractual uptime SLA vs edge node availability.'}
                  {gid.includes('TERM-01') &&
                    'Lowercase "cloudscale" frequently typed. Recommendation: Provide snippet integration in authoring templates.'}
                  {!['CLAIM-01', 'CLAIM-02', 'FACT-01', 'TERM-01'].some(k => gid.includes(k)) &&
                    'Frequently triggered across submitted drafts. Consider reviewing wording in Brand Kit.'}
                </p>

                <div className="pt-1 text-[10px] text-slate-400">
                  Audit Source: {info.source}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need to update a rule?</span>
            <button
              type="button"
              onClick={() => setActiveScreen('brandkit')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Edit in Brand Kit →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Human Governance Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-700" />
          <h3 className="font-semibold text-slate-900 text-sm">Human Decision-Making Audit Summary</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">
          BrandProof operates on strict human-in-the-loop principles:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-1">1. Transparent Checks</h4>
            <p className="text-[11px] text-slate-500">Every flag references a verifiable guideline ID, audit source citation, and version date.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-1">2. Author Empowerment</h4>
            <p className="text-[11px] text-slate-500">Content creators choose whether to apply recommendations, undo changes, or request an explicit exemption.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-1">3. Deliberate Approval</h4>
            <p className="text-[11px] text-slate-500">Only an authorized human reviewer can grant final publication approval. The system never publishes automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
