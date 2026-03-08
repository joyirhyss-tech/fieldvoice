/**
 * Synthesis Engine: Rules-based action item generation
 *
 * Takes survey themes, Be Heard submissions, KPIs, and You Said / We Did
 * entries and produces prioritized, categorized action items for leaders.
 *
 * V1: Deterministic rules-based engine (no LLM calls).
 * Future: Same interface, swap in LLM-powered synthesis.
 */

import type {
  SynthesisInput,
  SynthesizedAction,
  ActionPriority,
  ActionCategory,
  ThemeAggregate,
  BeHeardRequest,
  KPISnapshot,
  YouSaidWeDid,
  UserRole,
} from './types';

// ─── Constants ────────────────────────────────────────────

const SEVERITY_MULTIPLIER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const PRIORITY_LABELS: ActionPriority[] = ['urgent', 'high', 'medium', 'low'];

const TIMELINE_MAP: Record<ActionPriority, string> = {
  urgent: 'This week',
  high: 'Within 2 weeks',
  medium: 'This month',
  low: 'This quarter',
};

// Keywords → category mapping
const CATEGORY_KEYWORDS: Record<ActionCategory, string[]> = {
  operations: ['reporting', 'report', 'template', 'data', 'format', 'duplicate', 'process', 'intake', 'form', 'system', 'workflow', 'handoff', 'friction'],
  culture: ['coaching', 'morale', 'culture', 'excluded', 'heard', 'inclusion', 'trust', 'safe', 'wellbeing', 'well-being', 'burnout', 'recognition', 'garden', 'event', 'community'],
  staffing: ['staffing', 'coverage', 'hiring', 'staff', 'capacity', 'workload', 'overtime', 'shortage', 'vacancy', 'retention'],
  compliance: ['compliance', 'regulation', 'coa', 'funder', 'accreditation', 'audit', 'mandate', 'policy', 'safety'],
  communication: ['communication', 'meeting', 'agenda', 'action log', 'inconsistent', 'unclear', 'update', 'visibility', 'site-presence', 'leadership'],
};

// Action templates by category × severity tier
const ACTION_TEMPLATES: Record<ActionCategory, Record<string, string>> = {
  operations: {
    urgent: 'Initiate immediate process audit for "{theme}": identify root cause and present fix to leadership by {timeline}',
    high: 'Assign a working group to design a solution for "{theme}" with a pilot plan due {timeline}',
    medium: 'Schedule a review session on "{theme}" and develop improvement recommendations',
    low: 'Add "{theme}" to the next department meeting agenda for discussion and scoping',
  },
  culture: {
    urgent: 'Address "{theme}" directly in this week\'s all-staff: acknowledge it, share what you\'re doing about it',
    high: 'Create a protected space (coaching block, team circle) to address "{theme}" within {timeline}',
    medium: 'Develop a culture action plan for "{theme}" with staff input and measurable outcomes',
    low: 'Include "{theme}" in next quarter\'s wellbeing check-in and monitor trends',
  },
  staffing: {
    urgent: 'Escalate "{theme}" to HR: request emergency staffing review and interim coverage plan by {timeline}',
    high: 'Conduct a coverage gap analysis for areas affected by "{theme}" and present options by {timeline}',
    medium: 'Document current staffing gaps related to "{theme}" with data for quarterly planning',
    low: 'Flag "{theme}" for next budget cycle staffing requests with supporting survey data',
  },
  compliance: {
    urgent: 'Verify compliance status on "{theme}" immediately: document findings and remediation plan by {timeline}',
    high: 'Schedule compliance review meeting on "{theme}" with relevant stakeholders by {timeline}',
    medium: 'Conduct a policy alignment check for "{theme}" and update documentation as needed',
    low: 'Include "{theme}" in next compliance review cycle with current status assessment',
  },
  communication: {
    urgent: 'Address "{theme}" in this week\'s communications: implement a structured fix (required agendas, action logs) by {timeline}',
    high: 'Redesign the communication structure around "{theme}": pilot new format by {timeline}',
    medium: 'Survey the team on preferred communication improvements for "{theme}" and implement top request',
    low: 'Add "{theme}" to leadership development agenda and discuss best practices',
  },
};

// ─── Internal Types ───────────────────────────────────────

interface ScoredSignal {
  themeId: string;
  theme: string;
  weight: number;
  category: ActionCategory;
  severity: string;
  frequency: number;
  department: string;
  corroboratingBeHeardIds: string[];
  alreadyAddressed: boolean;
}

// ─── Core Functions ───────────────────────────────────────

function categorizeTheme(theme: string): ActionCategory {
  const lower = theme.toLowerCase();
  let bestCategory: ActionCategory = 'operations';
  let bestMatchCount = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter(kw => lower.includes(kw)).length;
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestCategory = category as ActionCategory;
    }
  }

  return bestCategory;
}

function findCorroboratingBeHeard(
  theme: string,
  beHeardSubmissions: BeHeardRequest[]
): string[] {
  const themeWords = theme.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  return beHeardSubmissions
    .filter(bh => {
      const content = bh.content.toLowerCase();
      return themeWords.some(word => content.includes(word));
    })
    .map(bh => bh.id);
}

function isThemeAddressed(
  theme: string,
  youSaidWeDid: YouSaidWeDid[]
): boolean {
  const lower = theme.toLowerCase();
  return youSaidWeDid.some(yswd => {
    const said = yswd.youSaid.toLowerCase();
    const did = yswd.weDid.toLowerCase();
    // Check if any significant words from theme appear in YSWD
    const words = lower.split(/\s+/).filter(w => w.length > 4);
    return words.some(w => said.includes(w) || did.includes(w));
  });
}

function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function preprocessAndScore(input: SynthesisInput): ScoredSignal[] {
  const { themes, beHeardSubmissions, youSaidWeDid } = input;

  return themes.map(theme => {
    const severityMult = SEVERITY_MULTIPLIER[theme.severity] || 1;
    const daysSince = getDaysSince(theme.lastSeen);
    const recencyBonus = daysSince <= 3 ? 1.5 : daysSince <= 7 ? 1.2 : 1.0;
    const corroboratingIds = findCorroboratingBeHeard(theme.theme, beHeardSubmissions);
    const corroborationBonus = corroboratingIds.length > 0 ? 1.3 : 1.0;
    const addressed = isThemeAddressed(theme.theme, youSaidWeDid);

    const weight = theme.frequency * severityMult * recencyBonus * corroborationBonus * (addressed ? 0.6 : 1.0);

    return {
      themeId: theme.id,
      theme: theme.theme,
      weight,
      category: categorizeTheme(theme.theme),
      severity: theme.severity,
      frequency: theme.frequency,
      department: theme.department,
      corroboratingBeHeardIds: corroboratingIds,
      alreadyAddressed: addressed,
    };
  });
}

function assignPriority(signal: ScoredSignal, allWeights: number[]): ActionPriority {
  const sorted = [...allWeights].sort((a, b) => b - a);
  const position = sorted.indexOf(signal.weight);
  const percentile = position / sorted.length;

  if (percentile < 0.2) return 'urgent';
  if (percentile < 0.5) return 'high';
  if (percentile < 0.8) return 'medium';
  return 'low';
}

function buildRationale(signal: ScoredSignal, kpis: KPISnapshot[]): string {
  const parts: string[] = [];

  parts.push(`Reported ${signal.frequency} times (${signal.severity} severity)`);

  if (signal.corroboratingBeHeardIds.length > 0) {
    parts.push(`corroborated by ${signal.corroboratingBeHeardIds.length} Be Heard submission${signal.corroboratingBeHeardIds.length > 1 ? 's' : ''}`);
  }

  // Check if any KPI relates to this theme
  const relatedKPI = kpis.find(kpi => {
    const kpiLower = kpi.label.toLowerCase();
    const themeWords = signal.theme.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    return themeWords.some(w => kpiLower.includes(w));
  });
  if (relatedKPI) {
    parts.push(`KPI "${relatedKPI.label}" at ${relatedKPI.value} (trend: ${relatedKPI.trend})`);
  }

  if (signal.alreadyAddressed) {
    parts.push('partially addressed, follow-up needed');
  }

  return parts.join('. ') + '.';
}

// ─── Public API ───────────────────────────────────────────

/**
 * Synthesize action items from survey data.
 * V1: Rules-based, deterministic. No LLM calls.
 */
export function synthesizeActions(input: SynthesisInput): SynthesizedAction[] {
  const scored = preprocessAndScore(input);
  const allWeights = scored.map(s => s.weight);

  // Sort by weight descending
  scored.sort((a, b) => b.weight - a.weight);

  // Generate actions, cap at 10
  const actions: SynthesizedAction[] = scored.slice(0, 10).map((signal, index) => {
    const priority = assignPriority(signal, allWeights);
    const timeline = TIMELINE_MAP[priority];
    const severityTier = signal.severity === 'critical' ? 'urgent' : priority;
    const template = ACTION_TEMPLATES[signal.category]?.[severityTier] || ACTION_TEMPLATES[signal.category]?.medium || '';
    const description = template
      .replace('{theme}', signal.theme.toLowerCase())
      .replace('{timeline}', timeline.toLowerCase());

    return {
      id: `synth-${index + 1}`,
      description,
      priority,
      category: signal.category,
      suggestedTimeline: timeline,
      sourceThemeIds: [signal.themeId],
      sourceBeHeardIds: signal.corroboratingBeHeardIds,
      rationale: buildRationale(signal, input.kpis),
      completed: false,
      completedAt: null,
    };
  });

  return actions;
}

/**
 * Filter synthesized actions by role visibility.
 * ED sees all. EVP sees all. DOP sees department-level.
 */
export function getActionsForRole(
  actions: SynthesizedAction[],
  role: UserRole
): SynthesizedAction[] {
  // For V1, all Tier 1 roles see all actions
  if (role === 'ed' || role === 'evp' || role === 'dop') {
    return actions;
  }
  return [];
}

/**
 * Generate a forward-looking planning summary.
 * Used by the "Future Planning" push button.
 */
export function generateForwardPlan(
  actions: SynthesizedAction[],
  themes: ThemeAggregate[],
  kpis: KPISnapshot[],
  youSaidWeDid: YouSaidWeDid[],
  userName: string
): string {
  const lines: string[] = [
    'FIELDVOICES: FORWARD PLANNING SUMMARY',
    `Prepared by: ${userName}`,
    `Date: ${new Date().toLocaleDateString()}`,
    '',
  ];

  // Unresolved themes (not in YSWD)
  const addressedThemes = new Set(
    youSaidWeDid.map(yswd => yswd.youSaid.toLowerCase())
  );
  const unresolved = themes.filter(t =>
    !youSaidWeDid.some(yswd => {
      const words = t.theme.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      return words.some(w => yswd.youSaid.toLowerCase().includes(w));
    })
  );

  if (unresolved.length > 0) {
    lines.push('UNRESOLVED THEMES:');
    unresolved.forEach(t => {
      lines.push(`  • ${t.theme} (${t.severity} severity, ${t.frequency} signals, ${t.department})`);
    });
    lines.push('');
  }

  // Upcoming actions (incomplete)
  const upcoming = actions.filter(a => !a.completed);
  if (upcoming.length > 0) {
    lines.push('UPCOMING ACTIONS:');
    upcoming.forEach((a, i) => {
      lines.push(`  ${i + 1}. [${a.priority.toUpperCase()}] ${a.description}`);
      lines.push(`     Timeline: ${a.suggestedTimeline} | Category: ${a.category}`);
    });
    lines.push('');
  }

  // Recommended focus areas (top 3 by priority)
  const focus = upcoming.slice(0, 3);
  if (focus.length > 0) {
    lines.push('TOP 3 RECOMMENDED FOCUS AREAS:');
    focus.forEach((a, i) => {
      lines.push(`  ${i + 1}. ${a.description}`);
      lines.push(`     Why: ${a.rationale}`);
    });
    lines.push('');
  }

  // KPI watch list (concerning trends)
  const concerning = kpis.filter(k => {
    // "down" is concerning except for metrics where down is good (e.g., "Duplicate Reports")
    const isNegativeMetric = k.label.toLowerCase().includes('duplicate') || k.label.toLowerCase().includes('friction');
    return isNegativeMetric ? k.trend === 'up' : k.trend === 'down';
  });
  if (concerning.length > 0) {
    lines.push('KPI WATCH LIST:');
    concerning.forEach(k => {
      lines.push(`  ⚠ ${k.label}: ${k.value} (trending ${k.trend})`);
    });
    lines.push('');
  }

  // Positive KPIs
  const positive = kpis.filter(k => {
    const isNegativeMetric = k.label.toLowerCase().includes('duplicate') || k.label.toLowerCase().includes('friction');
    return isNegativeMetric ? k.trend === 'down' : k.trend === 'up';
  });
  if (positive.length > 0) {
    lines.push('POSITIVE TRENDS:');
    positive.forEach(k => {
      lines.push(`  ✓ ${k.label}: ${k.value} (trending ${k.trend})`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('Generated by FieldVoices Impact Plan');

  return lines.join('\n');
}
