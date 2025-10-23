import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import jwt from "jsonwebtoken";

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
        token.accessToken = account.access_token;
        const decodedToken: any = jwt.decode(account.access_token);
        if (decodedToken && decodedToken.realm_access) {
            token.roles = decodedToken.realm_access.roles;
        }
      }
      return token;
    },
    async session({ session, token }) {
        (session as any).roles = (token as any).roles;
        (session as any).accessToken = (token as any).accessToken;
        return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
