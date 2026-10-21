'use client';

import React, { useState, useRef } from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { Channel, LocalImageAttachment } from '../../types/brandproof';
import { SAMPLE_DRAFT_CAMPAIGN } from '../../data/initialReviews';
import {
  Upload,
  Sparkles,
  ArrowRight,
  X,
  Info,
  AlertCircle,
} from 'lucide-react';

export function NewReviewView() {
  const { createReview, isEngineAnalyzing } = useBrandProof();

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<Channel>('blog');
  const [draftText, setDraftText] = useState('');
  const [image, setImage] = useState<LocalImageAttachment | null>(null);
  const [altText, setAltText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const channels: { id: Channel; label: string; desc: string }[] = [
    { id: 'blog', label: 'Engineering / Company Blog', desc: 'Longer form technical articles & product deep dives' },
    { id: 'social', label: 'Social Feeds (LinkedIn / X)', desc: 'Short-form posts, character ceiling 500' },
    { id: 'landing_page', label: 'Product Landing Page', desc: 'High-visibility conversion & feature pages' },
    { id: 'press_release', label: 'Press Release / News', desc: 'Official corporate & regulatory announcements' },
    { id: 'email_newsletter', label: 'Customer Newsletter', desc: 'Direct-to-customer updates and advisories' },
  ];

  // Load realistic sample review
  const handleLoadSample = () => {
    setTitle(SAMPLE_DRAFT_CAMPAIGN.title);
    setChannel(SAMPLE_DRAFT_CAMPAIGN.channel);
    setDraftText(SAMPLE_DRAFT_CAMPAIGN.text);
    setAltText(SAMPLE_DRAFT_CAMPAIGN.sampleAltText);
    setImage({
      name: 'cloudscale-architecture-preview.png',
      size: 198400,
      type: 'image/png',
      dataUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      altText: SAMPLE_DRAFT_CAMPAIGN.sampleAltText,
      uploadedAt: new Date().toISOString(),
    });
    setErrorMsg(null);
  };

  // Handle local image upload via FileReader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB local preview limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: reader.result as string,
        altText: altText || '',
        uploadedAt: new Date().toISOString(),
      });
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setAltText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a review title.');
      return;
    }
    if (!draftText.trim()) {
      setErrorMsg('Please enter draft content to review.');
      return;
    }

    const finalImage = image ? { ...image, altText: altText.trim() } : null;

    try {
      await createReview({
        title,
        channel,
        draftText,
        image: finalImage,
      });
    } catch {
      setErrorMsg('Failed to run brand review. Please check your input.');
    }
  };

  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;
  const charCount = draftText.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with "Try sample review" */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Submit Content for Brand Governance Review</h2>
            <p className="text-sm text-slate-600 mt-1">
              Deterministic checks will scan your draft for restricted claims, deprecated terminology, SLA numbers, and accessibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Try sample review</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-xs font-semibold text-slate-900 mb-1.5">
            Review Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            required
            placeholder="e.g. Q4 CloudScale Core Global Launch Campaign"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white shadow-xs"
          />
        </div>

        {/* Channel Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-1.5">
            Target Publication Channel <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {channels.map(c => (
              <label
                key={c.id}
                className={`relative flex flex-col p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  channel === c.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">{c.label}</span>
                  <input
                    type="radio"
                    name="channel"
                    value={c.id}
                    checked={channel === c.id}
                    onChange={() => setChannel(c.id)}
                    className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">{c.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Draft Content Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="draft-content" className="block text-xs font-semibold text-slate-900">
              Draft Content <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {wordCount} words • {charCount} characters
            </span>
          </div>
          <textarea
            id="draft-content"
            required
            rows={9}
            placeholder="Paste your draft blog post, product copy, social text, or release announcement here..."
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-sans leading-relaxed bg-white shadow-xs resize-y"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            BrandProof will detect deprecated terminology, unverified facts, superlatives, and voice infractions without altering your text.
          </p>
        </div>

        {/* Static Image Upload & Local Preview */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-900">
                Accompanying Graphic Asset (Optional)
              </label>
              <p className="text-[11px] text-slate-500">
                Uploaded images remain 100% local in your browser session. Never sent to any external server.
              </p>
            </div>
            {image && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove asset</span>
              </button>
            )}
          </div>

          {!image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">
                Click to browse an image (PNG, JPG, SVG) for local preview
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maximum 8MB • Browser session only</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-32 h-24 rounded border border-slate-200 overflow-hidden bg-white shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs text-slate-600 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">{image.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {(image.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Local preview asset. Evaluated for accessibility and visual guidelines.
                  </p>

                  <div className="pt-2">
                    <label htmlFor="img-alt" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Accessibility Alternative Text (Alt Text)
                    </label>
                    <input
                      id="img-alt"
                      type="text"
                      placeholder="e.g. Architecture topology diagram of CloudScale Core edge nodes"
                      value={altText}
                      onChange={e => setAltText(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Required by WCAG 2.2 AA standard ACC-01. BrandProof will flag missing or incomplete alt text.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responsible Design Note */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-800">Human Governance Guarantee:</span> Submitting this draft will run our deterministic rules. Findings will be presented to you as suggestions. A human creator decides which changes to adopt, and an authorized reviewer must grant final publication approval.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isEngineAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50"
          >
            <span>{isEngineAnalyzing ? 'Running Brand Checks...' : 'Run Brand Review'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
