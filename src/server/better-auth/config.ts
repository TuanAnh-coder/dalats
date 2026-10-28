import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { env } from "~/env";
import { db } from "~/server/db";

const baseURL = (env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Origins allowed to call the auth API. `BETTER_AUTH_TRUSTED_ORIGINS` accepts a
 * comma-separated list so staging/preview deployments can use their own host
 * without weakening the default same-origin protection.
 */
const trustedOrigins = Array.from(
  new Set([
    baseURL,
    ...(env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean) ?? []),
  ])
);

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
    }),
  ],
  socialProviders: {
    ...(env.BETTER_AUTH_GITHUB_CLIENT_ID && env.BETTER_AUTH_GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
            redirectURI: `${baseURL}/api/auth/callback/github`,
          },
        }
      : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
