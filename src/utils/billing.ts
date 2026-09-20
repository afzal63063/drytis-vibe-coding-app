import type { TierId } from '../types';

export interface TierInfo {
  id: TierId;
  label: string;
  name: string;
  rate: number;
  accent: string;
  gradient: string;
  dot: string;
}

export const TIERS: Record<TierId, TierInfo> = {
  tier1: {
    id: 'tier1',
    label: 'Tier-I',
    name: 'Associate Engineer',
    rate: 4.26,
    accent: 'text-sky-300',
    gradient: 'from-sky-500/25 to-sky-500/5',
    dot: 'bg-sky-400',
  },
  tier2: {
    id: 'tier2',
    label: 'Tier-II',
    name: 'Mid-Level Engineer',
    rate: 8.5,
    accent: 'text-brand-300',
    gradient: 'from-brand-500/25 to-brand-500/5',
    dot: 'bg-brand-400',
  },
  tier3: {
    id: 'tier3',
    label: 'Tier-III',
    name: 'Senior Engineer',
    rate: 17.15,
    accent: 'text-mint',
    gradient: 'from-mint-600/25 to-mint-600/5',
    dot: 'bg-mint-500',
  },
};

export const TIER_ORDER: TierId[] = ['tier1', 'tier2', 'tier3'];

export function tierRate(id: TierId): number {
  return TIERS[id].rate;
}

export function tierLabel(id: TierId): string {
  return TIERS[id].label;
}

export function formatMoney(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Yield per second of billed time at a given tier. */
export function perSecond(tier: TierId): number {
  return tierRate(tier) / 3600;
}