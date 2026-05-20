/**
 * SavingsProgramsContext
 *
 * Database-only by design (same rationale as ConditionsContext): no bundled
 * JSON fallback. Programs are editorial data maintained in Neon and synced
 * from programs.json via scripts/sync_programs_to_neon.js. Loads the full
 * program list on mount; per-medication lookups are sync filters on the
 * cached list.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllPrograms } from '../lib/savingsProgramsApi.js';
import { LIVER_ONLY, isLiverMedicationId } from '../lib/liverScope.js';

const SavingsProgramsContext = createContext(null);

export function SavingsProgramsProvider({ children }) {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadPrograms() {
            try {
                setIsLoading(true);
                const dbPrograms = await fetchAllPrograms();

                if (!cancelled && dbPrograms) {
                    const scoped = LIVER_ONLY
                        ? dbPrograms.filter((p) => isLiverMedicationId(p.medicationId))
                        : dbPrograms;
                    setPrograms(scoped);
                    setError(null);
                }
            } catch (err) {
                console.warn('Failed to fetch savings programs from database:', err);
                if (!cancelled) {
                    setError(err);
                    setPrograms([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadPrograms();

        return () => {
            cancelled = true;
        };
    }, []);

    const value = {
        programs,
        isLoading,
        error,
        filterPrograms: (filterFn) => programs.filter(filterFn),
    };

    return (
        <SavingsProgramsContext.Provider value={value}>
            {children}
        </SavingsProgramsContext.Provider>
    );
}

export function useSavingsPrograms() {
    const context = useContext(SavingsProgramsContext);
    if (!context) {
        throw new Error('useSavingsPrograms must be used within a SavingsProgramsProvider');
    }
    return context;
}

export function useSavingsProgramsList() {
    const { programs } = useSavingsPrograms();
    return programs;
}

// Returns programs for a single medication ID, grouped by type.
// Returns { copayCards: [], paps: [], foundations: [], all: [] }
export function useProgramsByMedicationId(medicationId) {
    const { programs } = useSavingsPrograms();
    return useMemo(() => {
        if (!medicationId) {
            return { copayCards: [], paps: [], foundations: [], all: [] };
        }
        const matches = programs.filter(p => p.medicationId === medicationId);
        return {
            copayCards: matches.filter(p => p.programType === 'copay_card'),
            paps: matches.filter(p => p.programType === 'pap'),
            foundations: matches.filter(p => p.programType === 'foundation'),
            all: matches,
        };
    }, [programs, medicationId]);
}

export default SavingsProgramsContext;
