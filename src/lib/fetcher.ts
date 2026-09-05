/**
 * Safe data fetcher with error handling for SWR
 * Prevents silent failures and provides better error information
 */
export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    
    // Handle non-200 responses
    if (!res.ok) {
      const error = new Error(`API Error: ${res.status} ${res.statusText}`);
      throw error;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    // Log errors for debugging
    if (typeof window !== 'undefined') {
      console.error(`Fetch failed for ${url}:`, error);
    }
    throw error;
  }
};

/**
 * Safe POST fetcher with error handling
 */
export const postFetcher = async (url: string, payload: any) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = new Error(`API Error: ${res.status} ${res.statusText}`);
      throw error;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error(`POST request failed for ${url}:`, error);
    }
    throw error;
  }
};
