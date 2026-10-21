import { Finding } from '../types/brandproof';
import { BrandReviewEngine, ReviewCheckInput } from './types';

export class DemoReviewEngine implements BrandReviewEngine {
  readonly name = 'DemoDeterministicRuleEngine';
  readonly version = '1.0.0-demo';

  async analyze(input: ReviewCheckInput): Promise<Finding[]> {
    const findings: Finding[] = [];
    const { text, channel, brandKit, image } = input;
    const lowerText = text.toLowerCase();

    // 1. Restricted Claims Check (Deterministic keyword and phrase matching)
    for (const claim of brandKit.restrictedClaims) {
      if (!claim.active) continue;

      for (const phrase of claim.prohibitedPhrases) {
        const lowerPhrase = phrase.toLowerCase();
        let searchIndex = 0;

        while ((searchIndex = lowerText.indexOf(lowerPhrase, searchIndex)) !== -1) {
          const exactFlagged = text.substring(searchIndex, searchIndex + phrase.length);
          
          let suggestion: string | undefined = undefined;
          if (claim.id === 'CLAIM-01') {
            suggestion = 'our high-throughput distributed cloud engine [requires benchmark reference]';
          } else if (claim.id === 'CLAIM-02') {
            suggestion = 'defense-in-depth security architecture with SOC 2 Type II compliance';
          } else if (claim.id === 'CLAIM-03') {
            suggestion = '99.99% monthly uptime SLA';
          } else if (claim.id === 'CLAIM-04') {
            suggestion = 'a leading high-scale platform [cite analyst report]';
          }

          findings.push({
            id: `finding-claim-${claim.id}-${searchIndex}`,
            category: 'restricted_claim',
            severity: claim.legalRiskLevel === 'high' ? 'critical' : 'warning',
            flaggedText: exactFlagged,
            startIndex: searchIndex,
            endIndex: searchIndex + phrase.length,
            explanation: `The claim "${exactFlagged}" violates corporate advertising and legal boundaries: ${claim.patternDescription}. ${claim.requiredCaveat || ''}`,
            guidelineRef: {
              id: claim.id,
              category: 'restricted_claim',
              title: claim.patternDescription,
              source: claim.source,
              version: claim.version,
              ruleSummary: `Prohibited phrase under ${claim.source}. Must not be published without verified benchmark or legal authorization.`,
              legalRiskLevel: claim.legalRiskLevel,
            },
            suggestedCorrection: suggestion,
            status: 'open',
            comments: [],
          });

          searchIndex += phrase.length;
        }
      }
    }

    // 2. Terminology Check (Exact match of deprecated words with word boundaries)
    for (const term of brandKit.terminology) {
      if (!term.active) continue;

      for (const deprecated of term.deprecated) {
        // Use regex with word boundary to avoid partial substring matching
        const escaped = deprecated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
          const matchIndex = match.index;
          const exactFlagged = text.substring(matchIndex, matchIndex + match[0].length);

          // Avoid flagging if it already matches preferred casing exactly
          if (exactFlagged === term.preferred) continue;

          findings.push({
            id: `finding-term-${term.id}-${matchIndex}`,
            category: 'terminology',
            severity: 'warning',
            flaggedText: exactFlagged,
            startIndex: matchIndex,
            endIndex: matchIndex + exactFlagged.length,
            explanation: `"${exactFlagged}" is a deprecated or incorrectly formatted term. The approved standard is "${term.preferred}". ${term.context}`,
            guidelineRef: {
              id: term.id,
              category: 'terminology',
              title: `Approved Term: ${term.preferred}`,
              source: term.source,
              version: term.version,
              ruleSummary: `Use approved terminology "${term.preferred}". Deprecated forms: ${term.deprecated.join(', ')}.`,
              legalRiskLevel: 'medium',
            },
            suggestedCorrection: term.preferred,
            status: 'open',
            comments: [],
          });
        }
      }
    }

    // 3. Approved Facts & Verification Check
    // Checks for mentions of SLA, SOC 2, or scale metrics without accurate wording
    if (lowerText.includes('99.999%') || lowerText.includes('five nines')) {
      const fact = brandKit.approvedFacts.find(f => f.id === 'FACT-01');
      if (fact && fact.active) {
        const flag = lowerText.includes('99.999%') ? '99.999%' : 'five nines';
        const start = lowerText.indexOf(flag);
        if (start !== -1) {
          findings.push({
            id: `finding-fact-sla-${start}`,
            category: 'fact_verification',
            severity: 'critical',
            flaggedText: text.substring(start, start + flag.length),
            startIndex: start,
            endIndex: start + flag.length,
            explanation: `Uptime SLA discrepancy. AuraScale's verified SLA commitment is 99.99% monthly uptime, not "${flag}". Publishing higher figures exposes the organization to customer breach-of-contract penalties.`,
            guidelineRef: {
              id: fact.id,
              category: 'fact_verification',
              title: fact.claimOrMetric,
              source: fact.source,
              version: fact.version,
              reviewDate: fact.reviewDate,
              ruleSummary: `Approved fact: "${fact.exactApprovedWording}".`,
              legalRiskLevel: 'high',
            },
            suggestedCorrection: '99.99% monthly uptime SLA',
            status: 'open',
            comments: [],
          });
        }
      }
    }

    // Check SOC 2 without Type II qualification
    const socMatch = /\bSOC\s*2\b/i.exec(text);
    if (socMatch && !lowerText.includes('soc 2 type ii') && !lowerText.includes('soc 2 type 2')) {
      const fact = brandKit.approvedFacts.find(f => f.id === 'FACT-02');
      if (fact && fact.active) {
        findings.push({
          id: `finding-fact-soc2-${socMatch.index}`,
          category: 'fact_verification',
          severity: 'warning',
          flaggedText: socMatch[0],
          startIndex: socMatch.index,
          endIndex: socMatch.index + socMatch[0].length,
          explanation: `Incomplete certification claim. AuraScale is certified specifically for "SOC 2 Type II". Omitting "Type II" weakens credibility and does not match our audited compliance documentation.`,
          guidelineRef: {
            id: fact.id,
            category: 'fact_verification',
            title: fact.claimOrMetric,
            source: fact.source,
            version: fact.version,
            reviewDate: fact.reviewDate,
            ruleSummary: `Approved phrasing: "${fact.exactApprovedWording}".`,
            legalRiskLevel: 'medium',
          },
          suggestedCorrection: 'SOC 2 Type II certified',
          status: 'open',
          comments: [],
        });
      }
    }

    // 4. Voice & Tone Check (Informal slang or hyperbolic puffery)
    const informalPhrases = [
      { phrase: 'crush the competition', clean: 'outperform alternative architectures' },
      { phrase: 'no-brainer', clean: 'compelling solution' },
      { phrase: 'insanely fast', clean: 'ultra-low latency' },
      { phrase: 'kill it', clean: 'succeed at scale' },
      { phrase: 'rock-solid', clean: 'enterprise-grade reliability' },
    ];

    for (const item of informalPhrases) {
      const idx = lowerText.indexOf(item.phrase);
      if (idx !== -1) {
        findings.push({
          id: `finding-tone-${idx}`,
          category: 'voice_tone',
          severity: 'guidance',
          flaggedText: text.substring(idx, idx + item.phrase.length),
          startIndex: idx,
          endIndex: idx + item.phrase.length,
          explanation: `Informal colloquialism detected. Brand voice guidance recommends measured, technical precision over casual conversational idioms.`,
          guidelineRef: {
            id: 'VOICE-01',
            category: 'voice_tone',
            title: 'Precision Over Hyperbole',
            source: 'Global Brand Guidelines v2.8 (Section 3.1: Voice Architecture)',
            version: 'v2.8',
            ruleSummary: 'Adopt a measured, clear tone suited for technical architects and enterprise leaders.',
            legalRiskLevel: 'low',
          },
          suggestedCorrection: item.clean,
          status: 'open',
          comments: [],
        });
      }
    }

    // 5. Channel-Specific Guidelines
    if (channel === 'social' && text.length > 500) {
      findings.push({
        id: `finding-channel-length`,
        category: 'voice_tone',
        severity: 'guidance',
        flaggedText: 'Entire draft length',
        explanation: `Social post exceeds recommended 500 character engagement ceiling for high-conversion LinkedIn/Twitter distribution.`,
        guidelineRef: {
          id: 'CHANNEL-01',
          category: 'voice_tone',
          title: 'Social Channel Brevity',
          source: 'Social Media Distribution Playbook v1.9',
          version: 'v1.9',
          ruleSummary: 'Drafts intended for social feeds should stay under 500 characters for readability.',
        },
        status: 'open',
        comments: [],
      });
    }

    // 6. Image Accessibility & Visual Check (Simulated local check for uploaded asset)
    if (image) {
      const alt = image.altText ? image.altText.trim() : '';
      if (!alt || alt.length < 10) {
        findings.push({
          id: `finding-img-acc-${Date.now()}`,
          category: 'accessibility',
          severity: 'warning',
          flaggedText: `Image asset: "${image.name}" (Missing descriptive alt text)`,
          explanation: `The uploaded image attachment lacks adequate descriptive alternative text (currently ${alt.length} characters). Screen-reader users and WCAG 2.2 AA standards require meaningful alt text describing the visual content or chart data.`,
          guidelineRef: {
            id: 'ACC-01',
            category: 'accessibility',
            title: 'Descriptive Image Alternative Text',
            source: 'Digital Accessibility Charter & WCAG 2.2 AA Compliance Directive',
            version: 'v2.4',
            reviewDate: '2026-06-01',
            ruleSummary: 'Minimum 10 characters explaining purpose or data shown in graphics.',
            legalRiskLevel: 'medium',
          },
          suggestedCorrection: `Diagram illustrating AuraScale CloudScale Core distributed storage architecture across multiple regions.`,
          status: 'open',
          comments: [],
        });
      }
    }

    // Deduplicate findings by flaggedText + category + startIndex
    const seen = new Set<string>();
    const uniqueFindings = findings.filter(f => {
      const key = `${f.category}-${f.flaggedText}-${f.startIndex}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueFindings;
  }
}
