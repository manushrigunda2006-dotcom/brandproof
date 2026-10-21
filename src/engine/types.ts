import { BrandKit, Channel, Finding, LocalImageAttachment } from '../types/brandproof';

export interface ReviewCheckInput {
  text: string;
  channel: Channel;
  brandKit: BrandKit;
  image?: LocalImageAttachment | null;
}

export interface BrandReviewEngine {
  readonly name: string;
  readonly version: string;
  analyze(input: ReviewCheckInput): Promise<Finding[]>;
}
