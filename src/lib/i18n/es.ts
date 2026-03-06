/**
 * Spanish translations — skeleton
 *
 * This file demonstrates the pattern for adding new languages.
 * Keys that are missing here will fall back to English automatically.
 *
 * Community contribution welcome: fill in the remaining keys below.
 * All strings should be contextually appropriate for mission-driven
 * organizations serving diverse communities.
 *
 * Translation note: "FieldVoices" and "Be Heard" are product names
 * and should NOT be translated. Keep them in English.
 */

import { TranslationStrings } from './types';

const es: Partial<TranslationStrings> = {
  // ── App-wide ──────────────────────────────────────────────
  'app.tagline': 'Escucha inteligente, síntesis e implementación para organizaciones con misión social',
  'app.skipToMain': 'Saltar al contenido principal',

  // ── Navigation / Action Rail ──────────────────────────────
  'nav.yourAttention': 'Su Atención Por Favor',
  'nav.requestFieldVoices': 'Solicitar FieldVoices',
  'nav.beHeard': 'Be Heard',
  'nav.workPlan': 'Plan de Trabajo',
  'nav.dailyBrief': 'Resumen Diario',
  'nav.archive': 'Archivo',
  'nav.expandPanel': 'Expandir panel',
  'nav.collapsePanel': 'Colapsar panel',
  'nav.yourRole': 'Su rol',

  // ── Live Status ───────────────────────────────────────────
  'live.totalLive': '{count} Total en Vivo',
  'live.daysLeft': '{count}d restantes',

  // ── Survey Invite ─────────────────────────────────────────
  'survey.voiceNeeded': 'Tu voz es necesaria',
  'survey.hideDetails': '▾ Ocultar detalles',
  'survey.viewDetails': '▸ Ver detalles de invitación',
  'survey.cadenceLabel': '¿Con qué frecuencia deseas recordatorios?',
  'survey.cadenceDaily': 'Diario',
  'survey.cadenceAltDays': 'Días Alt.',
  'survey.cadenceTwiceWeekly': '2x/sem',
  'survey.cadenceWeekly': 'Semanal',
  'survey.methodLabel': '¿Cómo quieres responder?',
  'survey.methodDesktop': 'Escritorio',
  'survey.methodText': 'Texto',
  'survey.methodEmail': 'Correo',
  'survey.methodVoice': 'Voz',
  'survey.voiceNote': 'Máximo 5 min de respuesta verbal por pregunta',
  'survey.acceptButton': 'Aceptar y Comenzar a Escuchar',
  'survey.continueResponding': 'Continuar respondiendo →',

  // ── Survey Response ───────────────────────────────────────
  'response.title': 'Responder',
  'response.questionOf': 'Pregunta {current} de {total}',
  'response.followUp': 'Seguimiento',
  'response.anythingElse': '¿Hay algo más que quieras agregar?',
  'response.anythingElseHint': 'Este es tu espacio abierto. Comparte lo que tengas en mente — sin necesidad de un tema.',
  'response.skip': 'Omitir',
  'response.skipFollowUp': 'Omitir seguimiento',
  'response.skipOpenFloor': 'Omitir — nada más que agregar',
  'response.submitContinue': 'Enviar y Continuar',
  'response.submitNext': 'Enviar y Siguiente Pregunta',
  'response.addThoughts': 'Agrega tus pensamientos',
  'response.complete.title': 'Gracias por compartir tu voz',
  'response.complete.message': 'Tus respuestas han sido registradas. Se sintetizarán con otras para crear información anónima — nunca atribución individual.',
  'response.complete.youSaidWeDid': 'Busca las actualizaciones de "You Said / We Did" para ver cómo tus comentarios generan acción.',
  'response.complete.returnButton': 'Regresar al espacio de trabajo',
  'response.recording': 'Grabando…',
  'response.tapToRecord': 'Toca para empezar a grabar',
  'response.tapToStop': 'Toca para detener',

  // ── Workspace ─────────────────────────────────────────────
  'workspace.title': 'Espacio de Trabajo',
  'workspace.welcome': 'Bienvenido a tu espacio de trabajo',
  'workspace.selectAction': 'Selecciona una acción del panel izquierdo.',
  'workspace.canRequest': 'Solicita una encuesta FieldVoices o envía un Be Heard.',
  'workspace.cannotRequest': 'Envía un Be Heard para compartir tu voz.',
  'workspace.createSurvey': 'Crear una encuesta',
  'workspace.shareVoice': 'Comparte tu voz',
  'workspace.recentWorkPlan': 'Elementos Recientes del Plan de Trabajo',
  'workspace.viewAll': 'Ver todo →',

  // ── Be Heard ──────────────────────────────────────────────
  'beHeard.description': 'Comparte tu preocupación, idea o comentario abajo. Tu envío es anónimo — el liderazgo ve el contenido pero no tu identidad.',
  'beHeard.placeholder': '¿Qué te gustaría que el liderazgo supiera?',
  'beHeard.submit': 'Enviar Be Heard',
  'beHeard.submitted.title': 'Tu voz ha sido recibida',
  'beHeard.submitted.message': 'Tu envío está siendo revisado y será encaminado según la severidad y urgencia.',
  'beHeard.routing.title': 'Cómo funciona el encaminamiento',
  'beHeard.tracking.title': 'Rastrear mis envíos',
  'beHeard.tracking.back': '← Atrás',
  'beHeard.status.received': 'Recibido',
  'beHeard.status.underReview': 'En Revisión',
  'beHeard.status.actionPlanned': 'Acción Planificada',
  'beHeard.status.resolved': 'Resuelto',
  'beHeard.status.communicated': 'Comunicado',
  'beHeard.status.alreadyResolved': 'Ya resuelto — siendo comunicado',

  // ── Right Panel ───────────────────────────────────────────
  'rightPanel.agencyWide': 'Toda la Agencia',
  'rightPanel.topConcerns': 'Principales Preocupaciones Repetidas',
  'rightPanel.followUps': 'Seguimientos Programados',
  'rightPanel.youSaidWeDid': 'Tú Dijiste / Nosotros Hicimos',
  'rightPanel.agencyMetrics': 'Métricas de la Agencia',

  // ── Roles ─────────────────────────────────────────────────
  'role.ed': 'Director Ejecutivo',
  'role.evp': 'Vicepresidente Ejecutivo',
  'role.dop': 'Director de Programas',
  'role.siteSupervisor': 'Supervisor de Sitio',
  'role.directService': 'Servicio Directo',
  'role.programTeam': 'Equipo de Programa',
  'role.voiceSteward': 'Guardián de Voz',

  // ── Language ──────────────────────────────────────────────
  'language.label': 'Idioma',
};

export default es;
