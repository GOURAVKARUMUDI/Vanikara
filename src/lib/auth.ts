import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const SESSION_KEY = 'vanikara_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/'
};

export const auth = {
  login: async (token: string) => {
    setCookie(SESSION_KEY, token, COOKIE_OPTIONS);
  },
  
  logout: () => {
    deleteCookie(SESSION_KEY);
  },
  
  getSession: () => {
    return getCookie(SESSION_KEY);
  },
  
  isAuthenticated: () => {
    return !!getCookie(SESSION_KEY);
  },
  
  validateSession: async () => {
    const session = getCookie(SESSION_KEY);
    if (!session) return false;
    // Mock server-side verification
    return true;
  }
};
