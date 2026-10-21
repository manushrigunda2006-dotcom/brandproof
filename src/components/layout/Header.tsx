'use client';

import React from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { Menu, Plus, ChevronRight } from 'lucide-react';
import { RoleSwitch } from '../common/RoleSwitch';
import { DemoNoticeBadge } from '../common/DisclaimerBanner';

interface HeaderProps {
  onOpenMobile: () => void;
}

export function Header({ onOpenMobile }: HeaderProps) {
  const { activeScreen, setActiveScreen, currentReview } = useBrandProof();

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'reviews':
        return 'Content Reviews';
      case 'review-detail':
        return currentReview?.title || 'Review Detail';
      case 'new-review':
        return 'Submit Content for Review';
      case 'brandkit':
        return 'Brand Kit & Standards';
      case 'insights':
        return 'Brand Governance Insights';
      default:
        return 'BrandProof';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="hover:text-slate-900 font-medium"
            >
              BrandProof
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {getScreenTitle()}
            </span>
          </div>

          <DemoNoticeBadge />
        </div>

        {/* Right: Role indicator & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <RoleSwitch />
          </div>

          {activeScreen !== 'new-review' && (
            <button
              type="button"
              onClick={() => setActiveScreen('new-review')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New review</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
