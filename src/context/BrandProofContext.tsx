'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveScreen,
  BrandKit,
  Channel,
  LocalImageAttachment,
  Review,
  Role,
} from '../types/brandproof';
import { INITIAL_BRAND_KIT } from '../data/initialBrandKit';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import { DemoReviewEngine } from '../engine/demoReviewEngine';

interface CreateReviewInput {
  title: string;
  channel: Channel;
  draftText: string;
  image?: LocalImageAttachment | null;
}

interface BrandProofContextType {
  // Navigation & Role
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen, reviewId?: string) => void;
  selectedReviewId: string | null;
  setSelectedReviewId: (id: string | null) => void;
  selectedFindingId: string | null;
  setSelectedFindingId: (id: string | null) => void;

  // Data
  brandKit: BrandKit;
  reviews: Review[];
  currentReview: Review | null;

  // Review Operations
  createReview: (input: CreateReviewInput) => Promise<string>;
  updateDraftText: (reviewId: string, newText: string) => void;
  applySuggestion: (reviewId: string, findingId: string) => void;
  undoSuggestion: (reviewId: string, findingId: string) => void;
  dismissFinding: (reviewId: string, findingId: string, reason?: string) => void;
  reopenFinding: (reviewId: string, findingId: string) => void;
  addFindingComment: (reviewId: string, findingId: string, text: string) => void;
  addReviewComment: (reviewId: string, text: string) => void;
  submitForReview: (reviewId: string) => void;
  requestChanges: (reviewId: string, note: string) => void;
  approveReview: (reviewId: string, note?: string) => void;
  rerunReviewEngine: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => void;

  // Brand Kit Operations
  updateBrandKit: (updater: (prev: BrandKit) => BrandKit) => void;
  toggleGuidelineActive: (section: 'voiceRules' | 'terminology' | 'approvedFacts' | 'restrictedClaims' | 'accessibilityGuidelines' | 'visualAssets', id: string) => void;

  // Demo state management
  resetToDemoData: () => void;
  isEngineAnalyzing: boolean;
}

const BrandProofContext = createContext<BrandProofContextType | null>(null);

const STORAGE_KEYS = {
  REVIEWS: 'brandproof_demo_reviews_v1',
  BRAND_KIT: 'brandproof_demo_brandkit_v1',
  ROLE: 'brandproof_demo_role_v1',
};

const engine = new DemoReviewEngine();

export function BrandProofProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>('creator');
  const [activeScreen, setActiveScreenState] = useState<ActiveScreen>('dashboard');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>('rev-001');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isEngineAnalyzing, setIsEngineAnalyzing] = useState(false);

  // Initial state setup with local storage hydration
  const [brandKit, setBrandKitState] = useState<BrandKit>(INITIAL_BRAND_KIT);
  const [reviews, setReviewsState] = useState<Review[]>(INITIAL_REVIEWS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (storedRole === 'creator' || storedRole === 'reviewer') {
        setActiveRoleState(storedRole);
      }

      const storedKit = localStorage.getItem(STORAGE_KEYS.BRAND_KIT);
      if (storedKit) {
        setBrandKitState(JSON.parse(storedKit));
      }

      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsState(parsed);
        }
      }
    } catch (e) {
      console.warn('BrandProof: Failed to read from localStorage, using initial demo seed', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('BrandProof: Failed to save reviews to localStorage', e);
    }
  }, [reviews, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BRAND_KIT, JSON.stringify(brandKit));
    } catch (e) {
      console.warn('BrandProof: Failed to save brandKit to localStorage', e);
    }
  }, [brandKit, isHydrated]);

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch {
      // ignore
    }
  }, []);

  const setActiveScreen = useCallback((screen: ActiveScreen, reviewId?: string) => {
    setActiveScreenState(screen);
    if (reviewId) {
      setSelectedReviewId(reviewId);
    }
    // Scroll to top of main content
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const currentReview = useMemo(() => {
    if (!selectedReviewId) return null;
    return reviews.find(r => r.id === selectedReviewId) || null;
  }, [reviews, selectedReviewId]);

  // Create new review and run deterministic analysis
  const createReview = useCallback(async (input: CreateReviewInput): Promise<string> => {
    setIsEngineAnalyzing(true);
    const newId = `rev-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    const initialFindings = await engine.analyze({
      text: input.draftText,
      channel: input.channel,
      brandKit,
      image: input.image,
    });

    const newReview: Review = {
      id: newId,
      title: input.title.trim() || 'Untitled Content Draft',
      channel: input.channel,
      originalDraft: input.draftText,
      currentDraft: input.draftText,
      image: input.image || null,
      status: 'draft',
      findings: initialFindings,
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          timestamp: nowIso,
          author: activeRole === 'creator' ? 'Elena Rostova (Creator)' : 'Marcus Vance (Reviewer)',
          role: activeRole,
          action: 'Created draft review',
          details: `Draft submitted for ${input.channel} channel (${input.draftText.length} characters).`,
        },
        {
          id: `act-${Date.now()}-2`,
          timestamp: nowIso,
          author: 'BrandProof Engine',
          role: 'reviewer',
          action: 'Deterministic checks completed',
          details: `Flagged ${initialFindings.length} items for human review.`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
      submittedBy: activeRole === 'creator' ? 'Creator' : 'Reviewer',
    };

    setReviewsState(prev => [newReview, ...prev]);
    setSelectedReviewId(newId);
    setActiveScreenState('review-detail');
    setIsEngineAnalyzing(false);
    return newId;
  }, [activeRole, brandKit]);

  // Update draft text manually
  const updateDraftText = useCallback((reviewId: string, newText: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          currentDraft: newText,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Apply suggestion
  const applySuggestion = useCallback((reviewId: string, findingId: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;

        const targetFinding = r.findings.find(f => f.id === findingId);
        if (!targetFinding || !targetFinding.suggestedCorrection) return r;

        // Replace the flagged text with suggested correction in currentDraft
        let updatedDraft = r.currentDraft;
        const flagged = targetFinding.flaggedText;
        const correction = targetFinding.suggestedCorrection;

        if (updatedDraft.includes(flagged)) {
          updatedDraft = updatedDraft.replace(flagged, correction);
        }

        const updatedFindings = r.findings.map(f =>
          f.id === findingId ? { ...f, status: 'applied' as const } : f
        );

        const newActivity = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: activeRole === 'creator' ? 'Creator' : 'Reviewer',
          role: activeRole,
          action: 'Applied suggestion',
          details: `Replaced "${flagged}" with "${correction}".`,
        };

        return {
          ...r,
          currentDraft: updatedDraft,
          findings: updatedFindings,
          activities: [newActivity, ...r.activities],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Undo suggestion
  const undoSuggestion = useCallback((reviewId: string, findingId: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;

        const targetFinding = r.findings.find(f => f.id === findingId);
        if (!targetFinding || !targetFinding.suggestedCorrection) return r;

        let updatedDraft = r.currentDraft;
        const flagged = targetFinding.flaggedText;
        const correction = targetFinding.suggestedCorrection;

        if (updatedDraft.includes(correction)) {
          updatedDraft = updatedDraft.replace(correction, flagged);
        }

        const updatedFindings = r.findings.map(f =>
          f.id === findingId ? { ...f, status: 'open' as const } : f
        );

        const newActivity = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: activeRole === 'creator' ? 'Creator' : 'Reviewer',
          role: activeRole,
          action: 'Reverted suggestion',
          details: `Restored original text "${flagged}".`,
        };

        return {
          ...r,
          currentDraft: updatedDraft,
          findings: updatedFindings,
          activities: [newActivity, ...r.activities],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Dismiss finding with optional reason
  const dismissFinding = useCallback((reviewId: string, findingId: string, reason?: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;

        const updatedFindings = r.findings.map(f =>
          f.id === findingId
            ? { ...f, status: 'dismissed' as const, dismissReason: reason || 'Dismissed by user' }
            : f
        );

        const target = r.findings.find(f => f.id === findingId);
        const newActivity = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: activeRole === 'creator' ? 'Creator' : 'Reviewer',
          role: activeRole,
          action: 'Dismissed finding',
          details: `Flag "${target?.flaggedText || findingId}" dismissed. Reason: ${reason || 'Approved exemption'}.`,
        };

        return {
          ...r,
          findings: updatedFindings,
          activities: [newActivity, ...r.activities],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Reopen finding
  const reopenFinding = useCallback((reviewId: string, findingId: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        const updatedFindings = r.findings.map(f =>
          f.id === findingId ? { ...f, status: 'open' as const, dismissReason: undefined } : f
        );
        return {
          ...r,
          findings: updatedFindings,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Add comment on finding
  const addFindingComment = useCallback((reviewId: string, findingId: string, text: string) => {
    if (!text.trim()) return;
    const comment = {
      id: `fc-${Date.now()}`,
      author: activeRole === 'creator' ? 'Elena Rostova (Creator)' : 'Marcus Vance (Reviewer)',
      role: activeRole,
      timestamp: new Date().toISOString(),
      text: text.trim(),
    };

    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        const updatedFindings = r.findings.map(f => {
          if (f.id !== findingId) return f;
          return {
            ...f,
            comments: [...f.comments, comment],
          };
        });
        return {
          ...r,
          findings: updatedFindings,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Add review-level comment
  const addReviewComment = useCallback((reviewId: string, text: string) => {
    if (!text.trim()) return;
    const comment = {
      id: `rc-${Date.now()}`,
      author: activeRole === 'creator' ? 'Elena Rostova (Creator)' : 'Marcus Vance (Reviewer)',
      role: activeRole,
      timestamp: new Date().toISOString(),
      text: text.trim(),
    };

    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          comments: [...r.comments, comment],
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: comment.author,
              role: activeRole,
              action: 'Added comment',
              details: text.trim().slice(0, 80),
            },
            ...r.activities,
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Submit for Review
  const submitForReview = useCallback((reviewId: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          status: 'in_review',
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: activeRole === 'creator' ? 'Elena Rostova (Creator)' : 'Reviewer',
              role: activeRole,
              action: 'Submitted for human review',
              details: 'Draft submitted to the brand governance queue.',
            },
            ...r.activities,
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [activeRole]);

  // Request changes (Reviewer action)
  const requestChanges = useCallback((reviewId: string, note: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          status: 'changes_requested',
          rejectionNote: note,
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: 'Marcus Vance (Reviewer)',
              role: 'reviewer',
              action: 'Requested changes',
              details: note,
            },
            ...r.activities,
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Approve review (Reviewer deliberate action)
  const approveReview = useCallback((reviewId: string, note?: string) => {
    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          status: 'approved',
          reviewedBy: 'Marcus Vance (Lead Brand Reviewer)',
          approvalNote: note || 'Deliberate human sign-off: Content certified compliant with AuraScale Brand Guidelines.',
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: 'Marcus Vance (Lead Brand Reviewer)',
              role: 'reviewer',
              action: 'Approved for publication',
              details: note || 'Deliberate human governance approval granted.',
            },
            ...r.activities,
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Re-run review engine on current draft
  const rerunReviewEngine = useCallback(async (reviewId: string) => {
    const rev = reviews.find(r => r.id === reviewId);
    if (!rev) return;

    setIsEngineAnalyzing(true);
    const updatedFindings = await engine.analyze({
      text: rev.currentDraft,
      channel: rev.channel,
      brandKit,
      image: rev.image,
    });

    setReviewsState(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          findings: updatedFindings,
          activities: [
            {
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: 'BrandProof Engine',
              role: 'reviewer',
              action: 'Re-analyzed draft',
              details: `Re-scanned against Brand Kit. ${updatedFindings.length} open findings.`,
            },
            ...r.activities,
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setIsEngineAnalyzing(false);
  }, [reviews, brandKit]);

  // Delete review
  const deleteReview = useCallback((reviewId: string) => {
    setReviewsState(prev => prev.filter(r => r.id !== reviewId));
    if (selectedReviewId === reviewId) {
      setSelectedReviewId(null);
      setActiveScreenState('reviews');
    }
  }, [selectedReviewId]);

  // Brand Kit updater
  const updateBrandKit = useCallback((updater: (prev: BrandKit) => BrandKit) => {
    setBrandKitState(updater);
  }, []);

  const toggleGuidelineActive = useCallback((
    section: 'voiceRules' | 'terminology' | 'approvedFacts' | 'restrictedClaims' | 'accessibilityGuidelines' | 'visualAssets',
    id: string
  ) => {
    setBrandKitState(prev => {
      const items = (prev[section] as Array<{ id: string; active: boolean }>).map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      );
      return {
        ...prev,
        [section]: items,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    });
  }, []);

  // Reset to demo data
  const resetToDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.BRAND_KIT);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch {
      // ignore
    }
    setBrandKitState(INITIAL_BRAND_KIT);
    setReviewsState(INITIAL_REVIEWS);
    setActiveRoleState('creator');
    setSelectedReviewId('rev-001');
    setActiveScreenState('dashboard');
  }, []);

  return (
    <BrandProofContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeScreen,
        setActiveScreen,
        selectedReviewId,
        setSelectedReviewId,
        selectedFindingId,
        setSelectedFindingId,
        brandKit,
        reviews,
        currentReview,
        createReview,
        updateDraftText,
        applySuggestion,
        undoSuggestion,
        dismissFinding,
        reopenFinding,
        addFindingComment,
        addReviewComment,
        submitForReview,
        requestChanges,
        approveReview,
        rerunReviewEngine,
        deleteReview,
        updateBrandKit,
        toggleGuidelineActive,
        resetToDemoData,
        isEngineAnalyzing,
      }}
    >
      {children}
    </BrandProofContext.Provider>
  );
}

export function useBrandProof() {
  const context = useContext(BrandProofContext);
  if (!context) {
    throw new Error('useBrandProof must be used within a BrandProofProvider');
  }
  return context;
}
