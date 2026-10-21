import { DemoReviewEngine } from '../src/engine/demoReviewEngine';
import { INITIAL_BRAND_KIT } from '../src/data/initialBrandKit';
import { SAMPLE_DRAFT_CAMPAIGN } from '../src/data/initialReviews';

async function runVerification() {
  console.log('--- BrandProof Engine Verification ---');
  const engine = new DemoReviewEngine();

  // Test 1: Sample Campaign Draft Analysis
  const findings = await engine.analyze({
    text: SAMPLE_DRAFT_CAMPAIGN.text,
    channel: 'blog',
    brandKit: INITIAL_BRAND_KIT,
    image: {
      name: 'test-diagram.png',
      size: 150000,
      type: 'image/png',
      dataUrl: 'data:image/png;base64,sample',
      altText: '', // Empty alt text to trigger accessibility finding
      uploadedAt: new Date().toISOString(),
    },
  });

  console.log(`Analyzed sample draft. Findings count: ${findings.length}`);
  findings.forEach(f => console.log(` - [${f.category}] [${f.severity}] ${f.flaggedText} -> ${f.suggestedCorrection || 'no suggestion'}`));
  if (findings.length < 4) {
    throw new Error(`Expected at least 4 findings, received ${findings.length}`);
  }

  // Verify critical restricted claim detected
  const speedClaim = findings.find(f => f.flaggedText.includes('fastest cloud engine in the world'));
  if (!speedClaim || speedClaim.category !== 'restricted_claim' || speedClaim.severity !== 'critical') {
    throw new Error('Failed to identify critical restricted claim for fastest cloud engine');
  }
  console.log('✓ Restricted claim detected with source citation:', speedClaim.guidelineRef.source);

  // Verify deprecated terminology detected
  const termClaim = findings.find(f => f.flaggedText.toLowerCase() === 'cloudscale');
  if (!termClaim || termClaim.category !== 'terminology' || termClaim.suggestedCorrection !== 'CloudScale Core') {
    throw new Error('Failed to identify deprecated terminology for cloudscale');
  }
  console.log('✓ Deprecated terminology flagged with approved correction:', termClaim.suggestedCorrection);

  // Verify SLA fact verification detected
  const slaFact = findings.find(f => f.category === 'fact_verification' && f.flaggedText.includes('99.999%'));
  if (!slaFact || slaFact.suggestedCorrection !== '99.99% monthly uptime SLA') {
    throw new Error('Failed to verify SLA commitment against Master Service Agreement');
  }
  console.log('✓ SLA fact discrepancy flagged against approved SLA:', slaFact.suggestedCorrection);

  // Verify accessibility finding for image without alt text
  const accClaim = findings.find(f => f.category === 'accessibility');
  if (!accClaim) {
    throw new Error('Failed to flag image with missing alt text');
  }
  console.log('✓ Image accessibility flagged for WCAG compliance:', accClaim.explanation.slice(0, 50) + '...');

  console.log('\n--- All BrandProof Verification Tests Passed Successfully! ---');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
