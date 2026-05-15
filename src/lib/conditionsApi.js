/**
 * Conditions API Client
 * Fetches condition data from the Neon database via Netlify functions
 */

const API_BASE = '/.netlify/functions/conditions';

// Cache for conditions data
let cachedConditions = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Check if cache is still valid
 */
function isCacheValid() {
    return cachedConditions && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

/**
 * Fetch all conditions from the database
 * Results are cached for 5 minutes
 */
export async function fetchAllConditions() {
    // Return cached data if still valid
    if (isCacheValid()) {
        return cachedConditions;
    }

    try {
        const response = await fetch(API_BASE);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update cache
        cachedConditions = data.conditions;
        cacheTimestamp = Date.now();

        return data.conditions;
    } catch (error) {
        console.error('Error fetching conditions:', error);

        // Return cached data even if stale, as fallback
        if (cachedConditions) {
            console.warn('Returning stale cached conditions data');
            return cachedConditions;
        }

        throw error;
    }
}

/**
 * Fetch a single condition by ID
 */
export async function fetchConditionById(id) {
    // Check cache first
    if (isCacheValid() && cachedConditions) {
        const cached = cachedConditions.find(c => c.id === id);
        if (cached) return cached;
    }

    try {
        const response = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.condition;
    } catch (error) {
        console.error('Error fetching condition by ID:', error);
        throw error;
    }
}

/**
 * Search conditions by name or description
 */
export async function searchConditions(query) {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const response = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.conditions;
    } catch (error) {
        console.error('Error searching conditions:', error);
        throw error;
    }
}

/**
 * Fetch conditions by category
 */
export async function fetchConditionsByCategory(category) {
    try {
        const response = await fetch(`${API_BASE}?category=${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.conditions;
    } catch (error) {
        console.error('Error fetching conditions by category:', error);
        throw error;
    }
}

/**
 * Clear the conditions cache
 * Useful when you know data has been updated
 */
export function clearConditionsCache() {
    cachedConditions = null;
    cacheTimestamp = null;
}

/**
 * Preload conditions data
 * Call this early in app initialization for better UX
 */
export async function preloadConditions() {
    try {
        await fetchAllConditions();
        return true;
    } catch (error) {
        console.warn('Failed to preload conditions:', error);
        return false;
    }
}
