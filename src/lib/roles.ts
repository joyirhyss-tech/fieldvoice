import { RoleOption, UserRole } from './types';

export const ROLES: RoleOption[] = [
  {
    value: 'ed',
    label: 'Executive Director',
    description: 'Strategic oversight, aggregate views, campaign launch',
    canRequest: true,
    canBeHeard: true,
    canViewAggregate: true,
  },
  {
    value: 'evp',
    label: 'EVP',
    description: 'Operational leadership, campaign launch, aggregate views',
    canRequest: true,
    canBeHeard: true,
    canViewAggregate: true,
  },
  {
    value: 'dop',
    label: 'Director of Programs',
    description: 'Program management, campaign launch, daily briefs',
    canRequest: true,
    canBeHeard: true,
    canViewAggregate: true,
  },
  {
    value: 'site_supervisor',
    label: 'Site Supervisor',
    description: 'Site-level leadership, team feedback, Be Heard',
    canRequest: false,
    canBeHeard: true,
    canViewAggregate: true, // Equity: all roles see anonymized themes
  },
  {
    value: 'direct_service',
    label: 'Direct Service',
    description: 'Frontline staff, field feedback, Be Heard',
    canRequest: false,
    canBeHeard: true,
    canViewAggregate: true, // Equity: workers who generate data should see patterns
  },
  {
    value: 'program_team',
    label: 'Program Team',
    description: 'Accountant, HR, Development — operational support',
    canRequest: false,
    canBeHeard: true,
    canViewAggregate: true, // Equity: all roles see anonymized themes
  },
  {
    value: 'voice_steward',
    label: 'Voice Steward',
    description: 'Trusted peer advocate — escalation protocol, mandatory reporting, raw-response access',
    canRequest: false,
    canBeHeard: true,
    canViewAggregate: true,
  },
];

export function getRoleConfig(role: UserRole): RoleOption {
  return ROLES.find((r) => r.value === role) || ROLES[0];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ed: 'ED',
  evp: 'EVP',
  dop: 'DOP',
  site_supervisor: 'Site Sup.',
  direct_service: 'Direct Svc.',
  program_team: 'Program Team',
  voice_steward: 'Steward',
};
