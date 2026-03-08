/**
 * Keyword-based urgency scoring for Be Heard submissions
 *
 * Replaces the previous Math.random() scoring with content-aware
 * analysis. Each submission is scored 0-100 based on keyword presence,
 * then routed to the appropriate leader:
 *   0-39  → Director of Programs
 *   40-69 → EVP
 *   70-89 → Executive Director
 *   90+   → Voice Steward + ED (critical escalation)
 */

import { UserRole } from './types';

export interface ScoreResult {
  score: number;
  routedTo: UserRole;
}

const URGENCY_KEYWORDS: { pattern: RegExp; weight: number }[] = [
  // Safety / crisis indicators (highest weight)
  { pattern: /\b(unsafe|danger|harass|abuse|threaten|crisis|harm|violence)\b/i, weight: 30 },
  { pattern: /\b(mandatory\s*report|mandated\s*report|child\s*abuse|sexual)\b/i, weight: 35 },
  { pattern: /\b(discriminat|exclud|retaliat|hostile|intimidat|bully)\b/i, weight: 25 },

  // Systemic / retention risk
  { pattern: /\b(burn\s*out|burnout|quit|resign|leave|leaving|retention|turnover)\b/i, weight: 20 },
  { pattern: /\b(pattern|systemic|persistent|ongoing|repeated|chronic)\b/i, weight: 15 },

  // Operational urgency
  { pattern: /\b(urgent|immediate|critical|emergency|deadline)\b/i, weight: 15 },
  { pattern: /\b(broken|failing|blocked|stalled|understaffed|short.?staffed)\b/i, weight: 12 },

  // Moderate concern indicators
  { pattern: /\b(concern|worried|issue|problem|challenge|difficult|frustrat)\b/i, weight: 8 },
  { pattern: /\b(inconsisten|confus|unclear|gap|neglect|overlook)\b/i, weight: 6 },
  { pattern: /\b(morale|overwhelm|exhaust|stress|anxiety|fear)\b/i, weight: 10 },

  // Feedback about processes
  { pattern: /\b(training|support|resource|communication|transparency)\b/i, weight: 5 },
  { pattern: /\b(suggest|idea|wish|hope|could\s*we|what\s*if)\b/i, weight: 3 },

  // Positive / low-urgency indicators (reduce score)
  { pattern: /\b(shout\s*out|thank|appreciat|positive|celebrate|great|love|proud)\b/i, weight: -10 },
  { pattern: /\b(good\s*job|well\s*done|excellent|fantastic|amazing)\b/i, weight: -8 },
];

/**
 * Score a Be Heard submission based on content analysis.
 * Returns a score (0-100) and the role it should be routed to.
 */
export function scoreSubmission(content: string): ScoreResult {
  let score = 25; // base score, neutral starting point

  for (const keyword of URGENCY_KEYWORDS) {
    const matches = content.match(new RegExp(keyword.pattern, 'gi'));
    if (matches) {
      // Each match contributes the weight, but diminishing returns for repeats
      score += keyword.weight + (matches.length - 1) * Math.ceil(keyword.weight * 0.3);
    }
  }

  // Length bonus: longer submissions often indicate more serious concerns
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 50) score += 5;
  if (wordCount > 100) score += 5;

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  // Route based on score
  let routedTo: UserRole;
  if (score >= 90) routedTo = 'ed';      // Voice Steward + ED (critical)
  else if (score >= 70) routedTo = 'ed';  // Executive Director
  else if (score >= 40) routedTo = 'evp'; // EVP
  else routedTo = 'dop';                  // Director of Programs

  return { score, routedTo };
}
