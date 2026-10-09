/**
 * Item Response Theory (IRT) Based Ability Estimator
 * 
 * Uses 3-parameter logistic model (3PL) for ability estimation:
 * P(correct) = c + (1 - c) / (1 + exp(-a * (theta - b)))
 * 
 * Where:
 * - theta: student ability (estimated)
 * - a: discrimination parameter (how well item distinguishes ability levels)
 * - b: difficulty parameter (item difficulty)
 * - c: guessing parameter (probability of guessing correctly)
 */

export interface IRTParameters {
  a: number; // discrimination (typically 0.5-2.0)
  b: number; // difficulty (typically -3 to +3)
  c: number; // guessing (typically 0.0-0.25 for multiple choice)
}

export interface QuestionResponse {
  questionId: string;
  correct: boolean;
  parameters: IRTParameters;
}

export interface AbilityEstimate {
  theta: number; // estimated ability (standardized, mean=0, SD=1)
  standardError: number; // standard error of estimate
  confidence: number; // confidence interval (95%)
}

/**
 * Default IRT parameters based on difficulty level
 * These are calibrated values that can be refined with real data
 */
export const DEFAULT_PARAMETERS: Record<string, IRTParameters> = {
  Easy: { a: 1.0, b: -1.0, c: 0.25 },
  Medium: { a: 1.2, b: 0.0, c: 0.25 },
  Hard: { a: 1.4, b: 1.0, c: 0.25 },
};

/**
 * Calculate probability of correct response given ability and item parameters
 */
export function probabilityCorrect(
  theta: number,
  parameters: IRTParameters
): number {
  const { a, b, c } = parameters;
  const z = a * (theta - b);
  const p = c + (1 - c) / (1 + Math.exp(-z));
  return Math.max(0, Math.min(1, p));
}

/**
 * Estimate ability using Maximum Likelihood Estimation (MLE)
 * This finds the theta that maximizes the likelihood of observed responses
 */
export function estimateAbilityMLE(
  responses: QuestionResponse[],
  initialTheta: number = 0
): AbilityEstimate {
  if (responses.length === 0) {
    return { theta: 0, standardError: 1, confidence: 1.96 };
  }

  // Newton-Raphson iteration for MLE
  let theta = initialTheta;
  const maxIterations = 100;
  const tolerance = 0.001;

  for (let i = 0; i < maxIterations; i++) {
    let gradient = 0;
    let hessian = 0;

    for (const response of responses) {
      const p = probabilityCorrect(theta, response.parameters);
      const { a, b, c } = response.parameters;
      
      // Gradient (first derivative)
      const gradientTerm = response.correct ? 1 - p : -p;
      gradient += a * gradientTerm * (1 - c) * p * (1 - p) / (p - c);
      
      // Hessian (second derivative)
      const hessianTerm = -a * a * (1 - c) * p * (1 - p) * (1 - 2 * c * p + c * p * p) / ((p - c) * (p - c));
      hessian += hessianTerm;
    }

    // Update theta
    const delta = gradient / hessian;
    theta -= delta;

    if (Math.abs(delta) < tolerance) {
      break;
    }
  }

  // Calculate standard error using Fisher information
  let fisherInfo = 0;
  for (const response of responses) {
    const p = probabilityCorrect(theta, response.parameters);
    const { a, b, c } = response.parameters;
    const information = (a * a * (1 - c) * p * (1 - p)) / ((p - c) * (p - c));
    fisherInfo += information;
  }

  const standardError = fisherInfo > 0 ? 1 / Math.sqrt(fisherInfo) : 1;
  const confidence = 1.96 * standardError; // 95% confidence interval

  return { theta, standardError, confidence };
}

/**
 * Estimate ability using Expected A Posteriori (EAP)
 * This incorporates prior knowledge about ability distribution
 * Uses a normal prior with mean=0, SD=1
 */
export function estimateAbilityEAP(
  responses: QuestionResponse[],
  thetaRange: number = 4,
  numPoints: number = 40
): AbilityEstimate {
  if (responses.length === 0) {
    return { theta: 0, standardError: 1, confidence: 1.96 };
  }

  // Discretize theta range
  const thetas = Array.from({ length: numPoints }, (_, i) => 
    -thetaRange + (2 * thetaRange * i) / (numPoints - 1)
  );

  // Calculate likelihood for each theta
  const likelihoods = thetas.map(theta => {
    let logLikelihood = 0;
    for (const response of responses) {
      const p = probabilityCorrect(theta, response.parameters);
      const logP = response.correct ? Math.log(p) : Math.log(1 - p);
      logLikelihood += logP;
    }
    return Math.exp(logLikelihood);
  });

  // Multiply by prior (standard normal)
  const prior = thetas.map(theta => 
    Math.exp(-0.5 * theta * theta) / Math.sqrt(2 * Math.PI)
  );

  // Posterior = likelihood * prior
  const posterior = likelihoods.map((l, i) => l * prior[i]);

  // Normalize posterior
  const sum = posterior.reduce((a, b) => a + b, 0);
  const normalizedPosterior = posterior.map(p => p / sum);

  // Calculate expected value (EAP estimate)
  let expectedTheta = 0;
  for (let i = 0; i < thetas.length; i++) {
    expectedTheta += thetas[i] * normalizedPosterior[i];
  }

  // Calculate variance and standard error
  let variance = 0;
  for (let i = 0; i < thetas.length; i++) {
    variance += normalizedPosterior[i] * Math.pow(thetas[i] - expectedTheta, 2);
  }
  const standardError = Math.sqrt(variance);
  const confidence = 1.96 * standardError;

  return { theta: expectedTheta, standardError, confidence };
}

/**
 * Detect guessing patterns in responses
 * Returns true if pattern suggests random guessing
 */
export function detectGuessing(
  responses: QuestionResponse[],
  threshold: number = 0.3
): boolean {
  if (responses.length < 5) return false;

  // Calculate average probability of correct for incorrect answers
  let avgProbIncorrect = 0;
  let incorrectCount = 0;

  for (const response of responses) {
    if (!response.correct) {
      const p = probabilityCorrect(0, response.parameters); // assuming average ability
      avgProbIncorrect += p;
      incorrectCount++;
    }
  }

  if (incorrectCount === 0) return false;
  avgProbIncorrect /= incorrectCount;

  // If user is getting easy questions wrong (suggesting guessing)
  return avgProbIncorrect > threshold;
}

/**
 * Calculate weighted score considering question difficulty
 * Used as a simpler alternative to full IRT
 */
export function calculateWeightedScore(
  responses: QuestionResponse[]
): number {
  const weights = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const response of responses) {
    const difficulty = Object.entries(DEFAULT_PARAMETERS).find(
      ([, params]) => params.b === response.parameters.b
    )?.[0] || "Medium";

    const weight = weights[difficulty as keyof typeof weights] || 2;
    totalWeight += weight;

    if (response.correct) {
      earnedWeight += weight;
    }
  }

  return totalWeight > 0 ? earnedWeight / totalWeight : 0;
}
