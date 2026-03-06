/**
 * English translations — default language
 *
 * Organized by feature area. Every user-facing string in FieldVoices
 * should be defined here. When adding new UI text, add the key here
 * first, then use t('key') in the component.
 *
 * Naming convention: feature.section.element
 */

import { TranslationStrings } from './types';

const en: TranslationStrings = {
  // ── App-wide ──────────────────────────────────────────────
  'app.name': 'FieldVoices',
  'app.tagline': 'Smart listening, synthesis, and implementation for mission-driven organizations',
  'app.brand': 'AIdedEQ',
  'app.skipToMain': 'Skip to main content',

  // ── Header ────────────────────────────────────────────────
  'header.connectButton': 'Connect FieldVoices',

  // ── Navigation / Action Rail ──────────────────────────────
  'nav.yourAttention': 'Your Attention Please',
  'nav.requestFieldVoices': 'Request FieldVoices',
  'nav.beHeard': 'Be Heard',
  'nav.workPlan': 'Work Plan',
  'nav.dailyBrief': 'Daily Brief',
  'nav.archive': 'Archive',
  'nav.expandPanel': 'Expand panel',
  'nav.collapsePanel': 'Collapse panel',
  'nav.yourRole': 'Your role',

  // ── Live Status ───────────────────────────────────────────
  'live.totalLive': '{count} Total Live',
  'live.liveFieldVoices': '{count} live FieldVoices',
  'live.daysLeft': '{count}d left',
  'live.questionsWaiting': '{count} questions waiting',

  // ── Survey Invite ─────────────────────────────────────────
  'survey.voiceNeeded': 'Your voice is needed',
  'survey.hideDetails': '▾ Hide details',
  'survey.viewDetails': '▸ View invite details',
  'survey.from': 'From {name} · {role}',
  'survey.window': 'Window: {start} — {end}',
  'survey.cadenceLabel': 'How often would you like nudges?',
  'survey.cadenceDaily': 'Daily',
  'survey.cadenceAltDays': 'Alt Days',
  'survey.cadenceTwiceWeekly': '2x/wk',
  'survey.cadenceWeekly': 'Weekly',
  'survey.methodLabel': 'How do you want to respond?',
  'survey.methodDesktop': 'Desktop',
  'survey.methodText': 'Text',
  'survey.methodEmail': 'Email',
  'survey.methodVoice': 'Voice',
  'survey.voiceNote': 'Max 5 min verbal response per prompt',
  'survey.acceptButton': 'Accept & Start Listening',
  'survey.continueResponding': 'Continue responding →',

  // ── Survey Response ───────────────────────────────────────
  'response.title': 'Respond',
  'response.questionOf': 'Question {current} of {total}',
  'response.followUp': 'Follow-up',
  'response.anythingElse': 'Is there anything else you want to add?',
  'response.anythingElseHint': 'This is your open floor. Share whatever is on your mind — no prompt needed.',
  'response.skip': 'Skip',
  'response.skipFollowUp': 'Skip follow-up',
  'response.skipOpenFloor': 'Skip — nothing else to add',
  'response.submitContinue': 'Submit & Continue',
  'response.submitNext': 'Submit & Next Question',
  'response.addThoughts': 'Add your thoughts',
  'response.complete.title': 'Thank you for sharing your voice',
  'response.complete.message': 'Your responses have been recorded. They will be synthesized with others to create anonymized insights — never individual attribution.',
  'response.complete.youSaidWeDid': 'Watch for "You Said / We Did" updates to see how your feedback shapes action.',
  'response.complete.returnButton': 'Return to workspace',
  'response.recording': 'Recording…',
  'response.tapToRecord': 'Tap to start recording',
  'response.tapToStop': 'Tap to stop',

  // ── Survey Steps ──────────────────────────────────────────
  'steps.intention': 'Intention',
  'steps.audience': 'Audience',
  'steps.questions': 'Questions',
  'steps.push': 'Push',

  // ── Workspace ─────────────────────────────────────────────
  'workspace.title': 'Workspace',
  'workspace.welcome': 'Welcome to your workspace',
  'workspace.selectAction': 'Select an action from the left panel.',
  'workspace.canRequest': 'Request a FieldVoices survey or submit a Be Heard.',
  'workspace.cannotRequest': 'Submit a Be Heard to share your voice.',
  'workspace.requestFieldVoices': 'Request FieldVoices',
  'workspace.createSurvey': 'Create a survey',
  'workspace.shareVoice': 'Share your voice',
  'workspace.recentWorkPlan': 'Recent Work Plan Items',
  'workspace.viewAll': 'View all →',

  // ── Be Heard ──────────────────────────────────────────────
  'beHeard.title': 'Be Heard',
  'beHeard.description': 'Share your concern, idea, or feedback below. Your submission is anonymized — leadership sees the content but not your identity.',
  'beHeard.placeholder': 'What would you like leadership to know?',
  'beHeard.submit': 'Submit Be Heard',
  'beHeard.submitted.title': 'Your voice has been received',
  'beHeard.submitted.message': 'Your submission is being reviewed and will be routed based on severity and urgency.',
  'beHeard.routing.title': 'How routing works',
  'beHeard.routing.description': 'Your Be Heard is scored and routed to the right leader for action:',
  'beHeard.tracking.title': 'Track my submissions',
  'beHeard.tracking.back': '← Back',
  'beHeard.status.received': 'Received',
  'beHeard.status.underReview': 'Under Review',
  'beHeard.status.actionPlanned': 'Action Planned',
  'beHeard.status.resolved': 'Resolved',
  'beHeard.status.communicated': 'Communicated',
  'beHeard.status.alreadyResolved': 'Already resolved — being communicated',

  // ── Right Panel ───────────────────────────────────────────
  'rightPanel.agencyWide': 'Agency-Wide',
  'rightPanel.topConcerns': 'Top Repeated Concerns',
  'rightPanel.followUps': 'Scheduled Follow-Ups',
  'rightPanel.youSaidWeDid': 'You Said / We Did',
  'rightPanel.agencyMetrics': 'Agency Metrics',

  // ── Work Plan ─────────────────────────────────────────────
  'workPlan.description': 'Action items derived from your FieldVoices surveys. These can be exported to your department workplan, calendar, or meeting agenda.',

  // ── Daily Brief ───────────────────────────────────────────
  'dailyBrief.title': 'Daily Brief',

  // ── Archive ───────────────────────────────────────────────
  'archive.title': 'Archive',
  'archive.voices': 'Voices',
  'archive.concerns': 'Concerns',
  'archive.solutions': 'Solutions',

  // ── Setup / Connect ───────────────────────────────────────
  'setup.welcome': 'Welcome to FieldVoices',
  'setup.comeOnIn': 'Come on in!',
  'setup.connect': 'Connect',
  'setup.setUp': 'Set Up',

  // ── Roles ─────────────────────────────────────────────────
  'role.ed': 'Executive Director',
  'role.evp': 'EVP',
  'role.dop': 'Director of Programs',
  'role.siteSupervisor': 'Site Supervisor',
  'role.directService': 'Direct Service',
  'role.programTeam': 'Program Team',
  'role.voiceSteward': 'Voice Steward',

  // ── Escalation Routes ─────────────────────────────────────
  'escalation.standard': 'Standard',
  'escalation.elevated': 'Elevated',
  'escalation.high': 'High',
  'escalation.critical': 'Critical',
  'escalation.directorOfPrograms': 'Director of Programs',
  'escalation.evp': 'EVP',
  'escalation.executiveDirector': 'Executive Director',
  'escalation.voiceStewardED': 'Voice Steward + ED',

  // ── Question Types ────────────────────────────────────────
  'questionType.open': 'Open',
  'questionType.scale': 'Scale',
  'questionType.multipleChoice': 'Multiple Choice',
  'questionType.yesNo': 'Yes/No',
  'questionType.pulse': 'Pulse',
  'questionType.reflective': 'Reflective',
  'questionType.contextual': 'Contextual',

  // ── Question Sources ──────────────────────────────────────
  'questionSource.aiGenerated': 'AI Generated',
  'questionSource.practiceCenter': 'Practice Center',
  'questionSource.custom': 'Custom',

  // ── Accessibility ─────────────────────────────────────────
  'a11y.navigationPanel': 'Your attention - navigation and surveys',
  'a11y.mainWorkspace': 'Main workspace',
  'a11y.youSaidWeDid': 'You Said We Did accountability tracker',
  'a11y.shoutOuts': 'Leadership shout-outs and positive updates',

  // ── Ticker / Shout-outs ───────────────────────────────────
  'ticker.shoutOuts': 'Leadership shout-outs',

  // ── Checklist ─────────────────────────────────────────────
  'checklist.intentionSet': 'Intention set',
  'checklist.audienceSelected': 'Audience selected',
  'checklist.questionsReady': 'Questions ready',
  'checklist.pushed': 'Pushed',

  // ── Language ──────────────────────────────────────────────
  'language.label': 'Language',
  'language.en': 'English',
  'language.es': 'Español',
  'language.fr': 'Français',
  'language.ht': 'Kreyòl Ayisyen',
  'language.zh': '中文',
  'language.ar': 'العربية',
};

export default en;
