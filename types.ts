export interface Cause {
  id: string;
  label: string;
}

export interface Intervention {
  id: string;
  label: string;
  targetCauseIds: string[];
  resonance?: number; // 0-1 value for section 6 implementation
}

export interface PairwiseComparison {
  id: string; // "idA-idB"
  aId: string;
  bId: string;
  value: number; // -9 to 9
}

export interface AhpResult {
  weights: Record<string, number>;
  consistencyRatio: number;
  lambdaMax: number;
  matrix: number[][];
}

export enum Step {
  DEFINE = 'DEFINE',
  COMPARE_CAUSES = 'COMPARE_CAUSES',
  COMPARE_EFF = 'COMPARE_EFF',
  COMPARE_FEAS = 'COMPARE_FEAS',
  RESULTS = 'RESULTS'
}

export interface OCIState {
  outcome: string;
  causes: Cause[];
  interventions: Intervention[];
  
  // Comparison State
  causeComparisons: Record<string, number>;
  effComparisons: Record<string, number>;
  feasComparisons: Record<string, number>;
}

export const INITIAL_STATE: OCIState = {
  outcome: '',
  causes: [],
  interventions: [],
  causeComparisons: {},
  effComparisons: {},
  feasComparisons: {}
};