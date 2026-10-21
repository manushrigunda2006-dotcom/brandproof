'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface RequestChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  reviewTitle: string;
}

export function RequestChangesModal({
  isOpen,
  onClose,
  onSubmit,
  reviewTitle,
}: RequestChangesModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit(note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Request Revisions from Creator</h3>
              <p className="text-xs text-slate-500">Provide specific brand feedback</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Draft: <strong className="text-slate-800 font-semibold">{reviewTitle}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="change-feedback" className="block font-semibold text-slate-800 mb-1">
              Required Revisions & Brand Guidance <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="change-feedback"
              required
              rows={4}
              placeholder="e.g. Please replace the superlative speed claims with our published benchmark citation, and verify the SLA figure before resubmitting."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition-colors"
            >
              Send Revision Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
