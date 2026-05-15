/**
 * ConditionsContext
 *
 * Database-only by design: unlike MedicationsContext, there is no bundled
 * JSON fallback. If the Neon fetch fails, `conditions` stays as an empty
 * array and `error` is populated so consumers can surface the failure.
 * Conditions are an editorial dataset maintained in the database; shipping
 * a stale copy in the bundle would risk drift between what the wizard shows
 * and what the database actually contains.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllConditions } from '../lib/conditionsApi.js';

const ConditionsContext = createContext(null);

export function ConditionsProvider({ children }) {
    const [conditions, setConditions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadConditions() {
            try {
                setIsLoading(true);
                const dbConditions = await fetchAllConditions();

                if (!cancelled && dbConditions) {
                    setConditions(dbConditions);
                    setError(null);
                }
            } catch (err) {
                console.warn('Failed to fetch conditions from database:', err);
                if (!cancelled) {
                    setError(err);
                    setConditions([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadConditions();

        return () => {
            cancelled = true;
        };
    }, []);

    const value = {
        conditions,
        isLoading,
        error,
        findCondition: (id) => conditions.find(c => c.id === id),
        filterConditions: (filterFn) => conditions.filter(filterFn),
    };

    return (
        <ConditionsContext.Provider value={value}>
            {children}
        </ConditionsContext.Provider>
    );
}

export function useConditions() {
    const context = useContext(ConditionsContext);
    if (!context) {
        throw new Error('useConditions must be used within a ConditionsProvider');
    }
    return context;
}

// Returns conditions array directly
export function useConditionsList() {
    const { conditions } = useConditions();
    return conditions;
}

// Returns conditions filtered to a single category (e.g., 'Hepatology').
// Intended for the Category -> Condition step of the wizard.
export function useConditionsByCategory(category) {
    const { conditions } = useConditions();
    return useMemo(() => {
        if (!category) return [];
        return conditions.filter(c => c.category === category);
    }, [conditions, category]);
}

export default ConditionsContext;
