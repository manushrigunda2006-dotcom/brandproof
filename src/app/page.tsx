'use client';

import React, { useState } from 'react';
import { BrandProofProvider, useBrandProof } from '../context/BrandProofContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { DashboardView } from '../components/dashboard/DashboardView';
import { BrandKitView } from '../components/brandkit/BrandKitView';
import { NewReviewView } from '../components/review/NewReviewView';
import { ReviewDetailView } from '../components/review/ReviewDetailView';
import { ReviewsListView } from '../components/reviews-list/ReviewsListView';
import { InsightsView } from '../components/insights/InsightsView';

function BrandProofApp() {
  const { activeScreen } = useBrandProof();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Demo Disclaimer Banner */}
      <DisclaimerBanner />

      <div className="flex flex-1 relative">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onOpenMobile={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {activeScreen === 'dashboard' && <DashboardView />}
            {activeScreen === 'reviews' && <ReviewsListView />}
            {activeScreen === 'new-review' && <NewReviewView />}
            {activeScreen === 'review-detail' && <ReviewDetailView />}
            {activeScreen === 'brandkit' && <BrandKitView />}
            {activeScreen === 'insights' && <InsightsView />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <BrandProofProvider>
      <BrandProofApp />
    </BrandProofProvider>
  );
}
