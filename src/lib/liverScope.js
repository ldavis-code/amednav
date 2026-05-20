/**
 * Liver scope -- single source of truth for the "liver-only" filter applied
 * across MedicationsContext, ConditionsContext, and SavingsProgramsContext.
 *
 * Derived from src/data/liver_conditions.json so the filter automatically
 * follows whatever the latest Neon export produced. To restore the full
 * (multi-category) app, set LIVER_ONLY = false below.
 */

import liverData from '../data/liver_conditions.json';

export const LIVER_ONLY = true;

export const LIVER_CONDITION_IDS = new Set(
  (liverData.conditions || []).map((c) => c.id)
);

export const LIVER_MEDICATION_IDS = new Set(
  (liverData.conditions || []).flatMap((c) =>
    (c.medications || []).map((m) => m.id)
  )
);

export const LIVER_CATEGORIES = new Set(
  (liverData.conditions || []).map((c) => c.category).filter(Boolean)
);

export function isLiverMedicationId(id) {
  if (!LIVER_ONLY) return true;
  return LIVER_MEDICATION_IDS.has(id);
}

export function isLiverConditionId(id) {
  if (!LIVER_ONLY) return true;
  return LIVER_CONDITION_IDS.has(id);
}

export function isLiverCategory(category) {
  if (!LIVER_ONLY) return true;
  return LIVER_CATEGORIES.has(category);
}
