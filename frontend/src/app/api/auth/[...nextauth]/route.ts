import NextAuth, { NextAuthOptions, Session } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import jwt from "jsonwebtoken";

interface DecodedToken {
  realm_access?: {
    roles?: string[];
  };
}

interface Token {
  accessToken?: string;
  roles?: string[];
}

interface SessionWithRoles extends Session {
  roles?: string[];
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      wellKnown: process.env.KEYCLOAK_WELL_KNOWN_URL!,
      authorization: {
        params: {
          scope: "openid",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.access_token) {
        (token as Token).accessToken = account.access_token;
        const decodedToken: DecodedToken | null = jwt.decode(account.access_token) as DecodedToken | null;
        if (decodedToken && decodedToken.realm_access) {
            (token as Token).roles = decodedToken.realm_access.roles;
        }
      }
      return token;
    },
    async session({ session, token }) {
        (session as SessionWithRoles).roles = (token as Token).roles;
        (session as SessionWithRoles).accessToken = (token as Token).accessToken;
        return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
