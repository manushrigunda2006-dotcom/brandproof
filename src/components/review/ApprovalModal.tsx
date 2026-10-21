'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  reviewTitle: string;
  openFindingsCount: number;
}

export function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  reviewTitle,
  openFindingsCount,
}: ApprovalModalProps) {
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedCheck) return;
    onConfirm(approvalNote.trim() || 'Content complies with brand voice, terminology, and approved facts.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Confirm Brand Governance Sign-Off</h3>
              <p className="text-xs text-slate-500">Deliberate Human Approval Action</p>
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

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
          <p className="font-semibold text-slate-800 truncate">&quot;{reviewTitle}&quot;</p>
          {openFindingsCount > 0 ? (
            <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Caution: This review still has <strong className="font-semibold">{openFindingsCount} unaddressed findings</strong>. As an authorized reviewer, approving will record an explicit managerial override.
              </span>
            </div>
          ) : (
            <p className="text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All policy checks have been addressed or resolved.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="approval-notes" className="block font-semibold text-slate-800 mb-1">
              Sign-off Notes (Saved to Permanent Audit Trail)
            </label>
            <textarea
              id="approval-notes"
              rows={3}
              placeholder="e.g. Verified against Master Service Agreement v3.2 and Trademark Matrix. Copy is ready for public release."
              value={approvalNote}
              onChange={e => setApprovalNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* Deliberate Human Confirmation Checkbox */}
          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={confirmedCheck}
                onChange={e => setConfirmedCheck(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                I deliberately certify as an authorized reviewer that this draft satisfies organizational brand policies, factual accuracy, and terminology guidelines. I understand BrandProof does not publish or distribute content automatically.
              </span>
            </label>
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
              disabled={!confirmedCheck}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs disabled:opacity-40 transition-colors"
            >
              Approve for Publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
