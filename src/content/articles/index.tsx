// ════════════════════════════════════════
// src/content/articles/index.tsx
// Article registry — metadata + body component ของแต่ละบทความ
// ใช้โดย ArticlesIndex, ArticlePage และ prerender script
// เพิ่มบทความใหม่ = สร้างไฟล์ component + เพิ่ม 1 entry ใน array นี้
// ════════════════════════════════════════
import type { ComponentType } from 'react';
import { LandAreaShortfallAfterSurvey, meta as areaShortfallMeta, FAQ as areaShortfallFaq } from './land-area-shortfall-after-survey';
import { NeighborLandFillingFlooding, meta as fillingFloodMeta, FAQ as fillingFloodFaq } from './neighbor-land-filling-flooding';
import { LandSaleScamCheck, meta as scamCheckMeta, FAQ as scamCheckFaq } from './land-sale-scam-check';
import { NeighborTreeBranchesRoots, meta as treeBranchesMeta, FAQ as treeBranchesFaq } from './neighbor-tree-branches-roots';
import { BuildingEncroachmentNeighborLand, meta as encroachmentMeta, FAQ as encroachmentFaq } from './building-encroachment-neighbor-land';
import { HighVoltagePowerLineLand, meta as powerLineMeta, FAQ as powerLineFaq } from './high-voltage-power-line-land';
import { PublicCanalThroughLand, meta as publicCanalMeta, FAQ as publicCanalFaq } from './public-canal-through-land';
import { LandAreaUnitsRaiNganWah, meta as landUnitsMeta, FAQ as landUnitsFaq } from './land-area-units-rai-ngan-wah';
import { CheckLandRoadFrontage, meta as roadFrontageMeta, FAQ as roadFrontageFaq } from './check-land-road-frontage';
import { BuyLandToSubdivideSell, meta as subdivideSellMeta, FAQ as subdivideSellFaq } from './buy-land-to-subdivide-sell';
import { HouseBuildingPermit, meta as buildingPermitMeta, FAQ as buildingPermitFaq } from './house-building-permit';
import { BuildingSetbackFromRoad, meta as roadSetbackMeta, FAQ as roadSetbackFaq } from './building-setback-from-road';
import { AppraisalPriceNewRound, meta as appraisalNewRoundMeta, FAQ as appraisalNewRoundFaq } from './appraisal-price-new-round';
import { TreasuryLandRatchaphatsadu, meta as treasuryLandMeta, FAQ as treasuryLandFaq } from './treasury-land-ratchaphatsadu';
import { UrbanExpansionSignals, meta as urbanExpansionMeta, FAQ as urbanExpansionFaq } from './urban-expansion-signals';
import { CityPlanDraftPetition, meta as cityPlanDraftMeta, FAQ as cityPlanDraftFaq } from './city-plan-draft-petition';
import { HighwayAccessConnectionPermit, meta as highwayAccessMeta, FAQ as highwayAccessFaq } from './highway-access-connection-permit';
import { LostTitleDeedReplacement, meta as lostDeedMeta, FAQ as lostDeedFaq } from './lost-title-deed-replacement';
import { ReadTitleDeedRegistrationPage, meta as deedRegistrationMeta, FAQ as deedRegistrationFaq } from './read-title-deed-registration-page';
import { AccretionLandRiverbank, meta as accretionMeta, FAQ as accretionFaq } from './accretion-land-riverbank';
import { UsufructHabitationSuperficies, meta as usufructMeta, FAQ as usufructFaq } from './usufruct-habitation-superficies';
import { LongTermLandLease, meta as longLeaseMeta, FAQ as longLeaseFaq } from './long-term-land-lease';
import { LandSaleWithRedemptionVsMortgage, meta as khaiFakMeta, FAQ as khaiFakFaq } from './land-sale-with-redemption-vs-mortgage';
import { BuildingSetbackFromBoundary, meta as setbackMeta, FAQ as setbackFaq } from './building-setback-from-boundary';
import { AdversePossessionLand, meta as adversePossessionMeta, FAQ as adversePossessionFaq } from './adverse-possession-land';
import { CheckIllegalBuildingBeforeBuying, meta as illegalBuildingMeta, FAQ as illegalBuildingFaq } from './check-illegal-building-before-buying';
import { LandSurveyCostTimeline, meta as surveyCostTimelineMeta, FAQ as surveyCostTimelineFaq } from './land-survey-cost-timeline';
import { TitleDeedOverlapStateLand, meta as stateLandOverlapMeta, FAQ as stateLandOverlapFaq } from './title-deed-overlap-state-land';
import { CheckLandFloodHistory, meta as floodHistoryMeta, FAQ as floodHistoryFaq } from './check-land-flood-history';
import { HistoricalSatelliteImageryLand, meta as satelliteHistoryMeta, FAQ as satelliteHistoryFaq } from './historical-satellite-imagery-land';
import { FindLandParcelFromGps, meta as parcelGpsMeta, FAQ as parcelGpsFaq } from './find-land-parcel-from-gps';
import { LandDevelopmentFeasibility, meta as devFeasibilityMeta, FAQ as devFeasibilityFaq } from './land-development-feasibility';
import { NeighborBoundaryDispute, meta as boundaryDisputeMeta, FAQ as boundaryDisputeFaq } from './neighbor-boundary-dispute';
import { MissingLandBoundaryMarkers, meta as missingMarkersMeta, FAQ as missingMarkersFaq } from './missing-land-boundary-markers';
import { LandTitleDeedTypes, meta as titleDeedTypesMeta, FAQ as titleDeedTypesFaq } from './land-title-deed-types';
import { VacantLandTax, meta as vacantLandTaxMeta, FAQ as vacantLandTaxFaq } from './vacant-land-tax';
import { InheritedLandDivision, meta as inheritedLandMeta, FAQ as inheritedLandFaq } from './inherited-land-division';
import { LandTransferFee, meta as landTransferFeeMeta, FAQ as landTransferFeeFaq } from './land-transfer-fee';
import { SpkToTitleDeed, meta as spkMeta, FAQ as spkFaq } from './spk-to-title-deed';
import { LandFillingCost, meta as landFillingMeta, FAQ as landFillingFaq } from './land-filling-cost';
import { AppraisalVsMarketPrice, meta as appraisalVsMarketMeta, FAQ as appraisalVsMarketFaq } from './appraisal-vs-market-price';
import { LandlockedLand, meta as landlockedMeta, FAQ as landlockedFaq } from './landlocked-land';
import { CheckLandBeforeBuying, meta as checkLandMeta, FAQ as checkLandFaq } from './check-land-before-buying';
import { CityPlanOnline, meta as cityPlanMeta, FAQ as cityPlanFaq } from './city-plan-online';
import { LandSubdivisionVsAllocation, meta as subdivisionMeta, FAQ as subdivisionFaq } from './land-subdivision-vs-allocation';
import { LandSubdivisionSteps, meta as subdivisionStepsMeta, FAQ as subdivisionStepsFaq } from './land-subdivision-steps';
import { LandAppraisalPriceOnline, meta as appraisalMeta, FAQ as appraisalFaq } from './land-appraisal-price-online';
import { ObjectLandAppraisalPrice, meta as objectAppraisalMeta, FAQ as objectAppraisalFaq } from './object-land-appraisal-price';
import { LandAllocationLicense, meta as allocationLicenseMeta, FAQ as allocationLicenseFaq } from './land-allocation-license';
import { LandSalePurchaseAgreement, meta as salePurchaseMeta, FAQ as salePurchaseFaq } from './land-sale-purchase-agreement';
import { LandExpropriationCompensation, meta as expropriationMeta, FAQ as expropriationFaq } from './land-expropriation-compensation';
import { NomineeLandHolding, meta as nomineeMeta, FAQ as nomineeFaq } from './nominee-land-holding';

export interface ArticleMeta {
  slug:        string;   // URL: /articles/{slug}
  title:       string;   // <h1> + SEO title
  description: string;   // meta description (~150–160 ตัวอักษร)
  excerpt:     string;   // สรุปสั้นบนการ์ด index
  date:        string;   // ISO published (YYYY-MM-DD)
  updated?:    string;   // ISO last-updated
  tags?:       string[];
  readMin?:    number;   // เวลาอ่านโดยประมาณ (นาที)
  cover?:      string;   // hero + การ์ด thumbnail + OG; absolute URL: https://tnrmaphub.com/article-images/{slug}.webp (1200×630); ไม่ใส่ = ไม่โชว์ภาพ
}

export interface Article {
  meta: ArticleMeta;
  Body: ComponentType;
  faq?: { q: string; a: string }[];   // ใช้ gen FAQPage JSON-LD ตอน prerender
}

export const articles: Article[] = [
  { meta: areaShortfallMeta, Body: LandAreaShortfallAfterSurvey, faq: areaShortfallFaq },
  { meta: fillingFloodMeta, Body: NeighborLandFillingFlooding, faq: fillingFloodFaq },
  { meta: scamCheckMeta, Body: LandSaleScamCheck, faq: scamCheckFaq },
  { meta: treeBranchesMeta, Body: NeighborTreeBranchesRoots, faq: treeBranchesFaq },
  { meta: encroachmentMeta, Body: BuildingEncroachmentNeighborLand, faq: encroachmentFaq },
  { meta: powerLineMeta, Body: HighVoltagePowerLineLand, faq: powerLineFaq },
  { meta: publicCanalMeta, Body: PublicCanalThroughLand, faq: publicCanalFaq },
  { meta: roadSetbackMeta, Body: BuildingSetbackFromRoad, faq: roadSetbackFaq },
  { meta: buildingPermitMeta, Body: HouseBuildingPermit, faq: buildingPermitFaq },
  { meta: subdivideSellMeta, Body: BuyLandToSubdivideSell, faq: subdivideSellFaq },
  { meta: roadFrontageMeta, Body: CheckLandRoadFrontage, faq: roadFrontageFaq },
  { meta: landUnitsMeta, Body: LandAreaUnitsRaiNganWah, faq: landUnitsFaq },
  { meta: appraisalNewRoundMeta, Body: AppraisalPriceNewRound, faq: appraisalNewRoundFaq },
  { meta: treasuryLandMeta, Body: TreasuryLandRatchaphatsadu, faq: treasuryLandFaq },
  { meta: urbanExpansionMeta, Body: UrbanExpansionSignals, faq: urbanExpansionFaq },
  { meta: cityPlanDraftMeta, Body: CityPlanDraftPetition, faq: cityPlanDraftFaq },
  { meta: highwayAccessMeta, Body: HighwayAccessConnectionPermit, faq: highwayAccessFaq },
  { meta: lostDeedMeta, Body: LostTitleDeedReplacement, faq: lostDeedFaq },
  { meta: deedRegistrationMeta, Body: ReadTitleDeedRegistrationPage, faq: deedRegistrationFaq },
  { meta: accretionMeta, Body: AccretionLandRiverbank, faq: accretionFaq },
  { meta: usufructMeta, Body: UsufructHabitationSuperficies, faq: usufructFaq },
  { meta: longLeaseMeta, Body: LongTermLandLease, faq: longLeaseFaq },
  { meta: khaiFakMeta, Body: LandSaleWithRedemptionVsMortgage, faq: khaiFakFaq },
  { meta: setbackMeta, Body: BuildingSetbackFromBoundary, faq: setbackFaq },
  { meta: adversePossessionMeta, Body: AdversePossessionLand, faq: adversePossessionFaq },
  { meta: illegalBuildingMeta, Body: CheckIllegalBuildingBeforeBuying, faq: illegalBuildingFaq },
  { meta: stateLandOverlapMeta, Body: TitleDeedOverlapStateLand, faq: stateLandOverlapFaq },
  { meta: floodHistoryMeta, Body: CheckLandFloodHistory, faq: floodHistoryFaq },
  { meta: satelliteHistoryMeta, Body: HistoricalSatelliteImageryLand, faq: satelliteHistoryFaq },
  { meta: parcelGpsMeta, Body: FindLandParcelFromGps, faq: parcelGpsFaq },
  { meta: surveyCostTimelineMeta, Body: LandSurveyCostTimeline, faq: surveyCostTimelineFaq },
  { meta: devFeasibilityMeta, Body: LandDevelopmentFeasibility, faq: devFeasibilityFaq },
  { meta: boundaryDisputeMeta, Body: NeighborBoundaryDispute, faq: boundaryDisputeFaq },
  { meta: missingMarkersMeta, Body: MissingLandBoundaryMarkers, faq: missingMarkersFaq },
  { meta: expropriationMeta, Body: LandExpropriationCompensation, faq: expropriationFaq },
  { meta: nomineeMeta, Body: NomineeLandHolding, faq: nomineeFaq },
  { meta: titleDeedTypesMeta, Body: LandTitleDeedTypes, faq: titleDeedTypesFaq },
  { meta: vacantLandTaxMeta, Body: VacantLandTax, faq: vacantLandTaxFaq },
  { meta: inheritedLandMeta, Body: InheritedLandDivision, faq: inheritedLandFaq },
  { meta: landTransferFeeMeta, Body: LandTransferFee, faq: landTransferFeeFaq },
  { meta: spkMeta, Body: SpkToTitleDeed, faq: spkFaq },
  { meta: landFillingMeta, Body: LandFillingCost, faq: landFillingFaq },
  { meta: salePurchaseMeta, Body: LandSalePurchaseAgreement, faq: salePurchaseFaq },
  { meta: appraisalVsMarketMeta, Body: AppraisalVsMarketPrice, faq: appraisalVsMarketFaq },
  { meta: landlockedMeta, Body: LandlockedLand, faq: landlockedFaq },
  { meta: checkLandMeta, Body: CheckLandBeforeBuying, faq: checkLandFaq },
  { meta: allocationLicenseMeta, Body: LandAllocationLicense, faq: allocationLicenseFaq },
  { meta: objectAppraisalMeta, Body: ObjectLandAppraisalPrice, faq: objectAppraisalFaq },
  { meta: appraisalMeta, Body: LandAppraisalPriceOnline, faq: appraisalFaq },
  { meta: subdivisionStepsMeta, Body: LandSubdivisionSteps, faq: subdivisionStepsFaq },
  { meta: subdivisionMeta, Body: LandSubdivisionVsAllocation, faq: subdivisionFaq },
  { meta: cityPlanMeta, Body: CityPlanOnline, faq: cityPlanFaq },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.meta.slug === slug);
}
