/**
 * Organ mapping -- single source of truth for the organ-first My Path quiz.
 *
 * Conditions in the database are categorized by medical specialty (e.g.
 * "Hepatology"), but the quiz presents them to patients by organ (e.g.
 * "Liver"). This module maps specialty -> organ. Categories without an
 * entry fall back to their own name, so new specialties still appear in
 * the organ list automatically (just less patient-friendly) until they
 * are mapped here.
 *
 * Lighting up a new organ requires no code change beyond this map: load
 * the conditions, medications, and condition_medications links into the
 * database and add the specialty here if it isn't already listed.
 */

export const SPECIALTY_TO_ORGAN = {
    Hepatology: 'Liver',
    Cardiology: 'Heart',
    Pulmonology: 'Lung',
    Neurology: 'Brain',
    Nephrology: 'Kidney',
    Gastroenterology: 'Digestive System',
    Endocrinology: 'Endocrine System',
    Hematology: 'Blood',
    Dermatology: 'Skin',
    Ophthalmology: 'Eye',
    Rheumatology: 'Joints & Immune System',
    Psychiatry: 'Mental Health',
    Oncology: 'Cancer',
};

export function getOrganForCategory(category) {
    if (!category) return null;
    return SPECIALTY_TO_ORGAN[category] || category;
}
