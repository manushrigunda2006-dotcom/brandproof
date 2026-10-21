'use client';

import React from 'react';
import { useBrandProof } from '../../context/BrandProofContext';
import { ActiveScreen } from '../../types/brandproof';
import {
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  BarChart3,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { RoleSwitch } from '../common/RoleSwitch';

export const BRAND_APP_NAME = 'BrandProof';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const { activeScreen, setActiveScreen, activeRole, resetToDemoData, reviews } = useBrandProof();

  const pendingCount = reviews.filter(r => r.status === 'in_review' || r.status === 'changes_requested').length;

  const navItems: { id: ActiveScreen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reviews', label: 'Reviews', icon: FileCheck2, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'brandkit', label: 'Brand Kit', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  const handleNav = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        {/* Top Branding & Main Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Brand Identity */}
          <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
            <div
              onClick={() => handleNav('dashboard')}
              className="cursor-pointer group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 text-base tracking-tight leading-tight">
                  {BRAND_APP_NAME}
                </h1>
                <p className="text-[11px] text-slate-500 font-normal">Brand Governance</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Demo
            </span>
          </div>

          {/* Quick Action: New Review */}
          <div className="p-4">
            <button
              type="button"
              onClick={() => handleNav('new-review')}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-xs ${
                activeScreen === 'new-review'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New review</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id || (item.id === 'reviews' && activeScreen === 'review-detail');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Organization Context */}
          <div className="mt-6 px-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700">Workspace</span>
                <span className="text-[10px] text-slate-400">Sample Org</span>
              </div>
              <p className="font-semibold text-slate-900 truncate">AuraScale Cloud</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Enterprise Cloud Infrastructure</p>
            </div>
          </div>
        </div>

        {/* Footer: Role Switcher & Reset Demo */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 px-0.5">
              <span>Active Demo Role:</span>
              <span className="font-medium capitalize text-slate-700">{activeRole}</span>
            </div>
            <RoleSwitch />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              title="Reset all reviews and brand guidelines back to initial clean demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset demo data</span>
            </button>
            <span className="text-[10px] text-slate-400">v0.1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
