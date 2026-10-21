'use client';

import React, { useState } from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import {
  BookOpen,
  CheckCircle2,
  Plus,
  Shield,
  FileText,
  Search,
  X,
} from 'lucide-react';

export function BrandKitView() {
  const { brandKit, toggleGuidelineActive, updateBrandKit } = useBrandProof();
  const [activeTab, setActiveTab] = useState<
    'all' | 'voice' | 'terminology' | 'facts' | 'claims' | 'accessibility' | 'visual'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New guideline form state
  const [newType, setNewType] = useState<'term' | 'fact' | 'claim'>('term');
  const [newPreferred, setNewPreferred] = useState('');
  const [newDeprecated, setNewDeprecated] = useState('');
  const [newClaim, setNewClaim] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newSource, setNewSource] = useState('Brand Standard v1.0 (2026)');

  const handleAddGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType === 'term' && newPreferred) {
      updateBrandKit(prev => ({
        ...prev,
        terminology: [
          {
            id: `TERM-${Date.now().toString().slice(-4)}`,
            preferred: newPreferred.trim(),
            deprecated: newDeprecated.split(',').map(s => s.trim()).filter(Boolean),
            context: 'User-added approved term.',
            source: newSource,
            version: 'v1.0 (Demo)',
            active: true,
          },
          ...prev.terminology,
        ],
      }));
    } else if (newType === 'fact' && newClaim) {
      updateBrandKit(prev => ({
        ...prev,
        approvedFacts: [
          {
            id: `FACT-${Date.now().toString().slice(-4)}`,
            claimOrMetric: newClaim.trim(),
            exactApprovedWording: newClaim.trim(),
            source: newSource,
            version: 'v1.0 (Demo)',
            reviewDate: new Date().toISOString().split('T')[0],
            active: true,
          },
          ...prev.approvedFacts,
        ],
      }));
    } else if (newType === 'claim' && newPhrase) {
      updateBrandKit(prev => ({
        ...prev,
        restrictedClaims: [
          {
            id: `CLAIM-${Date.now().toString().slice(-4)}`,
            patternDescription: 'Restricted Marketing Claim',
            prohibitedPhrases: [newPhrase.trim().toLowerCase()],
            requiredCaveat: 'Requires accredited audit benchmark or legal approval.',
            legalRiskLevel: 'high',
            source: newSource,
            version: 'v1.0 (Demo)',
            active: true,
          },
          ...prev.restrictedClaims,
        ],
      }));
    }

    // Reset
    setNewPreferred('');
    setNewDeprecated('');
    setNewClaim('');
    setNewPhrase('');
    setShowAddModal(false);
  };

  const matchesSearch = (text: string) => {
    if (!searchTerm.trim()) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Single Source of Truth
              </span>
              <span className="text-xs text-slate-500 font-medium">Demo Brand Standards</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {brandKit.organizationName} Brand Kit
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Approved guidelines, legal facts, terminology, and assets. Each standard includes an audited source citation and review date.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Demo Guideline</span>
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: 'all', label: 'All Standards' },
              { id: 'claims', label: `Restricted Claims (${brandKit.restrictedClaims.length})` },
              { id: 'terminology', label: `Terminology (${brandKit.terminology.length})` },
              { id: 'facts', label: `Approved Facts (${brandKit.approvedFacts.length})` },
              { id: 'voice', label: `Voice & Tone (${brandKit.voiceRules.length})` },
              { id: 'accessibility', label: 'Accessibility' },
              { id: 'visual', label: 'Visual Assets' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'all' | 'voice' | 'terminology' | 'facts' | 'claims' | 'accessibility' | 'visual')}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter guidelines..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* 1. Restricted Claims Section */}
      {(activeTab === 'all' || activeTab === 'claims') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              <h3 className="font-semibold text-slate-900 text-base">Restricted Marketing Claims & Prohibitions</h3>
            </div>
            <span className="text-xs text-slate-500">Legal Risk: High</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandKit.restrictedClaims
              .filter(c => matchesSearch(c.patternDescription) || c.prohibitedPhrases.some(p => matchesSearch(p)))
              .map(claim => (
                <div
                  key={claim.id}
                  className={`p-4 rounded-lg border text-xs space-y-2.5 transition-colors ${
                    claim.active ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase">{claim.id}</span>
                      <h4 className="font-semibold text-slate-900 text-sm mt-0.5">{claim.patternDescription}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGuidelineActive('restrictedClaims', claim.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        claim.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {claim.active ? 'Active Rule' : 'Disabled'}
                    </button>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Prohibited Phrases:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {claim.prohibitedPhrases.map((phrase, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono text-[11px]">
                          &quot;{phrase}&quot;
                        </span>
                      ))}
                    </div>
                  </div>

                  {claim.requiredCaveat && (
                    <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Required Caveat:</span> {claim.requiredCaveat}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">Source: {claim.source}</span>
                    <span className="shrink-0 font-medium text-slate-600">{claim.version}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. Approved Terminology Section */}
      {(activeTab === 'all' || activeTab === 'terminology') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-base">Approved Product Terminology & Spelling</h3>
            </div>
            <span className="text-xs text-slate-500">Trademark Enforcement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandKit.terminology
              .filter(t => matchesSearch(t.preferred) || t.deprecated.some(d => matchesSearch(d)))
              .map(term => (
                <div
                  key={term.id}
                  className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                    term.active ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400">{term.id}</span>
                      <p className="font-bold text-slate-900 text-sm text-emerald-800">{term.preferred}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGuidelineActive('terminology', term.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        term.active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {term.active ? 'Enforced' : 'Off'}
                    </button>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px]">Deprecated variations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {term.deprecated.map((dep, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 line-through text-[11px]">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{term.context}</p>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{term.source}</span>
                    <span className="shrink-0">{term.version}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. Approved Facts Section */}
      {(activeTab === 'all' || activeTab === 'facts') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-base">Audited Facts & Verified Metrics</h3>
            </div>
            <span className="text-xs text-slate-500">Audited Proof Points</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandKit.approvedFacts
              .filter(f => matchesSearch(f.claimOrMetric) || matchesSearch(f.exactApprovedWording))
              .map(fact => (
                <div
                  key={fact.id}
                  className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                    fact.active ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400">{fact.id}</span>
                      <h4 className="font-semibold text-slate-900 text-sm">{fact.claimOrMetric}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGuidelineActive('approvedFacts', fact.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        fact.active
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {fact.active ? 'Audited' : 'Inactive'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 rounded border border-blue-100 text-blue-950 font-medium leading-relaxed">
                    &quot;{fact.exactApprovedWording}&quot;
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">Source: {fact.source}</span>
                    <span className="shrink-0">Reviewed: {fact.reviewDate}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Brand Voice & Tone */}
      {(activeTab === 'all' || activeTab === 'voice') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-slate-900 text-base">Brand Voice & Editorial Architecture</h3>
            </div>
            <span className="text-xs text-slate-500">Editorial Standard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandKit.voiceRules.map(v => (
              <div key={v.id} className="p-4 rounded-lg bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                <span className="font-mono text-[10px] text-slate-400">{v.id}</span>
                <h4 className="font-semibold text-slate-900 text-sm">{v.title}</h4>
                <p className="text-purple-900 font-medium">{v.rule}</p>
                <p className="text-slate-600 text-[11px]">{v.explanation}</p>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  {v.source} • {v.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Accessibility & Visual Assets */}
      {(activeTab === 'all' || activeTab === 'accessibility' || activeTab === 'visual') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accessibility Guidance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">Accessibility Requirements (WCAG 2.2 AA)</h3>
            <div className="space-y-3">
              {brandKit.accessibilityGuidelines.map(acc => (
                <div key={acc.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{acc.title}</h4>
                    <span className="text-[10px] text-slate-400">{acc.version}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{acc.requirement}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">Source: {acc.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Assets & Wordmarks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">Visual Assets & Brand Marks</h3>
            <div className="space-y-3">
              {brandKit.visualAssets.map(asset => (
                <div key={asset.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{asset.assetName}</h4>
                    {asset.previewBadge && (
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs">
                        {asset.previewBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 font-medium text-[11px]">{asset.specs}</p>
                  <p className="text-slate-500 text-[11px]">{asset.fileGuideline}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{asset.source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Demo Guideline */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-base">Add Demo Brand Guideline</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGuideline} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Guideline Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('term')}
                    className={`py-1.5 rounded border font-medium ${
                      newType === 'term' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Terminology
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('claim')}
                    className={`py-1.5 rounded border font-medium ${
                      newType === 'claim' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Restricted Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('fact')}
                    className={`py-1.5 rounded border font-medium ${
                      newType === 'fact' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Approved Fact
                  </button>
                </div>
              </div>

              {newType === 'term' && (
                <>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Preferred Approved Term</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AuraScale Edge"
                      value={newPreferred}
                      onChange={e => setNewPreferred(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Deprecated Forms (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. aurascale edge, edge product, Edge Engine"
                      value={newDeprecated}
                      onChange={e => setNewDeprecated(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </>
              )}

              {newType === 'claim' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Prohibited Phrase</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% risk free"
                    value={newPhrase}
                    onChange={e => setNewPhrase(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">BrandProof will flag any draft containing this phrase.</p>
                </div>
              )}

              {newType === 'fact' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Exact Approved Fact / Metric</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 availability zones across 6 continents"
                    value={newClaim}
                    onChange={e => setNewClaim(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Governance Source Citation</label>
                <input
                  type="text"
                  required
                  value={newSource}
                  onChange={e => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Save Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
