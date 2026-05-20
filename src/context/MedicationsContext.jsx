import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllMedications } from '../lib/medicationsApi.js';
import MEDICATIONS_FALLBACK from '../data/medications.json';
import { LIVER_ONLY, isLiverMedicationId } from '../lib/liverScope.js';

const MedicationsContext = createContext(null);

export function MedicationsProvider({ children }) {
    const [medications, setMedications] = useState(MEDICATIONS_FALLBACK);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('local'); // 'local' or 'database'

    useEffect(() => {
        let cancelled = false;

        async function loadMedications() {
            try {
                setIsLoading(true);
                const dbMedicationsRaw = await fetchAllMedications();
                const dbMedications = LIVER_ONLY
                    ? (dbMedicationsRaw || []).filter((m) => isLiverMedicationId(m.id))
                    : dbMedicationsRaw;

                if (!cancelled && dbMedications && dbMedications.length > 0) {
                    // The JSON file uses string slug IDs ("tacrolimus") while the
                    // Neon medications table uses integer IDs. Match rows by
                    // normalized generic_name so JSON's rich field set can be
                    // joined with the DB's integer id (attached as `dbId` for
                    // use in tables that FK to medications.id, e.g.
                    // condition_medications, savings_programs).
                    const normalize = (s) => (s || '').toLowerCase().trim();
                    const dbByGeneric = new Map(
                        dbMedications
                            .filter(m => m.genericName)
                            .map(m => [normalize(m.genericName), m])
                    );

                    const mergedMedications = MEDICATIONS_FALLBACK.map(fallbackMed => {
                        const dbMed = dbByGeneric.get(normalize(fallbackMed.genericName));
                        if (!dbMed) return fallbackMed;
                        return {
                            ...fallbackMed,
                            // Preserve string slug as `id` for app code that
                            // hardcodes slugs (App.jsx ORGAN_MEDICATIONS,
                            // SavingsCalculator, chatbotGuidance, URL params).
                            id: fallbackMed.id,
                            // Attach DB integer id separately for joins.
                            dbId: dbMed.id,
                        };
                    });

                    // Log unmatched rows so data drift is visible in dev tools.
                    const matchedGenerics = new Set(
                        mergedMedications
                            .filter(m => m.dbId != null)
                            .map(m => normalize(m.genericName))
                    );
                    const unmatchedDb = dbMedications.filter(
                        m => m.genericName && !matchedGenerics.has(normalize(m.genericName))
                    );
                    if (unmatchedDb.length > 0) {
                        console.warn(
                            `MedicationsContext: ${unmatchedDb.length} DB row(s) with no JSON match.`,
                            unmatchedDb.map(m => ({ dbId: m.id, genericName: m.genericName }))
                        );
                    }
                    const unmatchedJson = mergedMedications.filter(m => m.dbId == null);
                    if (unmatchedJson.length > 0) {
                        console.warn(
                            `MedicationsContext: ${unmatchedJson.length} JSON med(s) with no DB match (joins by dbId will skip these).`,
                            unmatchedJson.map(m => ({ id: m.id, genericName: m.genericName }))
                        );
                    }

                    setMedications(mergedMedications);
                    setSource('database');
                    setError(null);
                }
            } catch (err) {
                console.warn('Failed to fetch medications from database, using local fallback:', err);
                if (!cancelled) {
                    setError(err);
                    // Keep using the fallback data that was set initially
                    setSource('local');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadMedications();

        return () => {
            cancelled = true;
        };
    }, []);

    const value = {
        medications,
        isLoading,
        error,
        source,
        // Helper to find a medication by ID
        findMedication: (id) => medications.find(m => m.id === id),
        // Helper to filter medications
        filterMedications: (filterFn) => medications.filter(filterFn)
    };

    return (
        <MedicationsContext.Provider value={value}>
            {children}
        </MedicationsContext.Provider>
    );
}

export function useMedications() {
    const context = useContext(MedicationsContext);
    if (!context) {
        throw new Error('useMedications must be used within a MedicationsProvider');
    }
    return context;
}

// For backward compatibility - returns medications array directly
export function useMedicationsList() {
    const { medications } = useMedications();
    return medications;
}

export default MedicationsContext;
