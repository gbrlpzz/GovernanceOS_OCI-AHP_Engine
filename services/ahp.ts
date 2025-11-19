import { PairwiseComparison, AhpResult } from '../types';

// Random Index (RI) for Consistency Ratio calculation (n=1 to 10)
const RI_MAP: Record<number, number> = {
  1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 
  6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
};

/**
 * Convert slider value (-9 to 9) to Saaty Scale (0.11... to 9)
 */
export const mapSliderToSaaty = (val: number): number => {
  if (val === 0) return 1;
  if (val > 0) return Math.min(val + 1, 9);
  return 1 / (Math.abs(val) + 1);
};

/**
 * Calculate Eigenvector and CR using power iteration method
 */
export const calculateAHP = (items: {id: string}[], comparisons: Record<string, number>): AhpResult => {
  const n = items.length;
  if (n === 0) return { weights: {}, consistencyRatio: 0, lambdaMax: 0, matrix: [] };
  if (n === 1) return { weights: { [items[0].id]: 1 }, consistencyRatio: 0, lambdaMax: 1, matrix: [[1]] };

  // 1. Build Matrix
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(1));
  const indexMap = new Map(items.map((item, i) => [item.id, i]));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const idA = items[i].id;
      const idB = items[j].id;
      const key = `${idA}-${idB}`;
      const val = comparisons[key] || 0; // Default to equal if missing
      
      const saatyVal = mapSliderToSaaty(val);
      matrix[i][j] = saatyVal;
      matrix[j][i] = 1 / saatyVal;
    }
  }

  // 2. Calculate Weights (Eigenvector estimation via geometric mean method approximation or Power Method)
  // Using geometric mean method (logarithmic least squares) which is robust for AHP
  const geometricMeans = matrix.map(row => {
    const product = row.reduce((acc, val) => acc * val, 1);
    return Math.pow(product, 1 / n);
  });

  const sumGeoMeans = geometricMeans.reduce((a, b) => a + b, 0);
  const weightsVec = geometricMeans.map(v => v / sumGeoMeans);

  // Map back to IDs
  const weights: Record<string, number> = {};
  items.forEach((item, i) => {
    weights[item.id] = weightsVec[i];
  });

  // 3. Calculate Lambda Max & CR
  // Matrix * WeightVector = WeightedSumVector
  const weightedSumVec = matrix.map((row) => {
    return row.reduce((sum, val, colIndex) => sum + val * weightsVec[colIndex], 0);
  });

  // Lambda Max approx is average of (WeightedSum / Weight)
  let lambdaMaxSum = 0;
  for(let i=0; i<n; i++) {
    lambdaMaxSum += weightedSumVec[i] / weightsVec[i];
  }
  const lambdaMax = lambdaMaxSum / n;

  const ci = (lambdaMax - n) / (n - 1);
  const ri = RI_MAP[n] || 1.49; 
  const consistencyRatio = ri === 0 ? 0 : ci / ri;

  return {
    weights,
    consistencyRatio,
    lambdaMax,
    matrix
  };
};