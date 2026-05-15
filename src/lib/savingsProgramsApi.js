/**
 * Savings Programs API Client
 * Fetches copay card / PAP / foundation program data from the Neon database
 * via Netlify functions
 */

const API_BASE = '/.netlify/functions/savings-programs';

// Cache for programs data
let cachedPrograms = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid() {
    return cachedPrograms && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

/**
 * Fetch all savings programs from the database
 * Results are cached for 5 minutes
 */
export async function fetchAllPrograms() {
    if (isCacheValid()) {
        return cachedPrograms;
    }

    try {
        const response = await fetch(API_BASE);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        cachedPrograms = data.programs;
        cacheTimestamp = Date.now();

        return data.programs;
    } catch (error) {
        console.error('Error fetching savings programs:', error);

        if (cachedPrograms) {
            console.warn('Returning stale cached savings programs data');
            return cachedPrograms;
        }

        throw error;
    }
}

/**
 * Fetch programs for a specific medication ID
 */
export async function fetchProgramsByMedicationId(medicationId) {
    try {
        const response = await fetch(`${API_BASE}?medicationId=${encodeURIComponent(medicationId)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.programs;
    } catch (error) {
        console.error('Error fetching programs by medication ID:', error);
        throw error;
    }
}

/**
 * Fetch programs by type ('copay_card', 'pap', 'foundation')
 */
export async function fetchProgramsByType(type) {
    try {
        const response = await fetch(`${API_BASE}?type=${encodeURIComponent(type)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.programs;
    } catch (error) {
        console.error('Error fetching programs by type:', error);
        throw error;
    }
}

/**
 * Search programs by name or manufacturer
 */
export async function searchPrograms(query) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const response = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.programs;
    } catch (error) {
        console.error('Error searching savings programs:', error);
        throw error;
    }
}

export function clearSavingsProgramsCache() {
    cachedPrograms = null;
    cacheTimestamp = null;
}

export async function preloadSavingsPrograms() {
    try {
        await fetchAllPrograms();
        return true;
    } catch (error) {
        console.warn('Failed to preload savings programs:', error);
        return false;
    }
}
