import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import KeycloakProvider from "next-auth/providers/keycloak"
import jwt from "jsonwebtoken";
import { Account, User, Session } from "next-auth";

interface DecodedToken {
    realm_access?: {
        roles?: string[];
    };
    name?: string;
    given_name?: string;
    family_name?: string;
    exp?: number;
}

// Extender el tipo JWT para incluir nuestros campos personalizados
export interface ExtendedJWT extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    idToken?: string;
    name?: string | null;
    roles?: string[];
    error?: string;
}

// Extender el tipo Session para incluir nuestros campos personalizados
export interface ExtendedSession extends Session {
    accessToken?: string;
    user: {
        name?: string | null;
    } & Session['user'];
    roles?: string[];
    error?: string;
}

async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
    try {
        const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken!,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        const decodedToken: DecodedToken | null = jwt.decode(refreshedTokens.access_token) as DecodedToken | null;

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            name: decodedToken?.name || `${decodedToken?.given_name || ''} ${decodedToken?.family_name || ''}`.trim() || token.name,
            roles: decodedToken?.realm_access?.roles,
            error: undefined,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
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
                    scope: "openid offline_access",
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
        async jwt({ token, user, account }: { token: JWT, user: User | null, account: Account | null }): Promise<JWT> {
            const extendedToken = token as ExtendedJWT;

            if (account && user) {
                const decodedToken: DecodedToken | null = jwt.decode(account.access_token!) as DecodedToken | null;

                const fullName = `${decodedToken?.given_name || ''} ${decodedToken?.family_name || ''}`.trim();

                extendedToken.name = fullName || decodedToken?.name || user.email || 'Usuario';

                extendedToken.idToken = account.id_token;
                extendedToken.accessToken = account.access_token;
                extendedToken.refreshToken = account.refresh_token;
                extendedToken.accessTokenExpires = account.expires_at! * 1000;
                extendedToken.roles = decodedToken?.realm_access?.roles;
                return extendedToken;
            }

            if (Date.now() < extendedToken.accessTokenExpires!) {
                return extendedToken;
            }

            console.log("Access token has expired, refreshing...");
            return refreshAccessToken(extendedToken);
        },
        async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
            const extendedSession = session as ExtendedSession;
            const extendedToken = token as ExtendedJWT;

            if (session.user) {
                extendedSession.user.name = extendedToken.name;
            }

            extendedSession.accessToken = extendedToken.accessToken;
            extendedSession.roles = extendedToken.roles;
            extendedSession.error = extendedToken.error;

            return extendedSession;
        }
    }
}
