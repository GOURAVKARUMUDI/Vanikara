/**
 * getURL: Returns the absolute base URL for the current environment.
 * Priority: 
 * 1. window.location.origin (Client-side dynamic detection)
 * 2. NEXT_PUBLIC_SITE_URL (Environment variable)
 * 3. Fallback to production domain
 */
export const getURL = () => {
  let url = '';

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    url = window.location.origin;
  } else {
    url = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vanikara.com';
  }

  // Ensure 'http://' or 'https://' is included
  url = url.includes('http') ? url : `https://${url}`;
  
  // Remove trailing slash
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
  
  return url;
};

