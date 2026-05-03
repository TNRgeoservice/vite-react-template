// ════════════════════════════════════════
// src/types/plot.ts
// Shared TypeScript types
// ════════════════════════════════════════

import type { BuildingInfo } from './building';

export type PlotType   = 'land' | 'road' | 'polygon';
export type PlotStatus = 'available' | 'reserved' | 'sold';
/**
 * #18 Status differentiation
 */
export type PlotCloseType = 'self' | 'verified';

/**
 * #19 Field history (revision tracking)
 */
export interface RevisionEntry {
  value: any;
  at:    any;
}

export interface PlotPoint {
  id:          string;
  type:        PlotType;
  name:        string;
  lat:         number | null | undefined;
  lng:         number | null | undefined;
  areaSqm:     number | string | null;
  priceTotal:  number | string | null;
  status:      PlotStatus;
  titleType:   string | null;
  zoning:      string | null;
  roadAcc:     string | null;
  province:    string | null;
  amphoe:      string | null;
  tambon:      string | null;
  locCode:     string | null;
  landmark:    string | null;
  notes:       string | null;
  phone:       string | null;
  photos:      string[];
  photoUrls:   string[];
  ownerUid:    string | null;
  isFeatured:  boolean;
  featuredAt?: any;
  polygon?:    { lat: number; lng: number }[];
  buildings?:  BuildingInfo[] | null;
  buildingValueTotal?: number | null;
  landPricePerSqWa?: number | null;
  closeType?:  PlotCloseType | null;
  verifiedAt?: any;
  verifiedBy?: 'system' | 'admin' | null;
  /** ระบบสาธารณูปโภค — default true */
  hasWater?:        boolean;
  hasElectricity?:  boolean;
  revisions?:  Record<string, RevisionEntry[]> | null;
  createdAt?:  any;
  updatedAt?:  any;
}

export interface UserProfile {
  uid:         string;
  email:       string;
  displayName: string;
  phone:       string;
  lineId:      string;
  bio:         string;
  avatarUrl:   string;
  role:        'user' | 'editor' | 'admin';
  verified?:   boolean;
  notifPrefs?: Record<string, boolean>;
  createdAt?:  any;
  updatedAt?:  any;
}

export interface SlipRecord {
  id:         string;
  plotDocId:  string;
  plotName:   string;
  buyerUid:   string;
  buyerName:  string;
  sellerUid:  string;
  amount:     number;
  bankName:   string;
  slipUrl:    string;
  status:     'pending' | 'confirmed' | 'rejected';
  note:       string;
  createdAt:  any;
  confirmedAt?: any;
}
