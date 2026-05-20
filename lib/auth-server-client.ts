import { createAuthClient } from 'better-auth/client';
import { headers } from 'next/headers';

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
const BETTER_AUTH_BASE_PATH = process.env.BETTER_AUTH_BASE_PATH || '/api/auth';
const BETTER_AUTH_COOKIE_PREFIX =
  process.env.BETTER_AUTH_COOKIE_PREFIX || 'better-auth';

export const authServerClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  basePath: BETTER_AUTH_BASE_PATH,
  fetchOptions: {
    baseURL: BETTER_AUTH_URL + BETTER_AUTH_BASE_PATH,
    onRequest: async (context) => {
      const headersList = await headers();
      const cookie = headersList.get('Cookie');

      // Proxy auth-related cookies
      if (cookie) {
        const authCookies = cookie
          .split(';')
          .map((c: string) => c.trim())
          .filter(
            (c: string) =>
              c.startsWith(`${BETTER_AUTH_COOKIE_PREFIX}.`) ||
              c.startsWith(`__Secure-${BETTER_AUTH_COOKIE_PREFIX}.`),
          )
          .join('; ');

        if (authCookies) {
          context.headers.set('Cookie', authCookies);
        }
      }
    },
  },
});

export const { getSession } = authServerClient;
