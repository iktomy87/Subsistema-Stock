import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

// Validar que las variables de entorno estén presentes
if (!process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET || !process.env.KEYCLOAK_ISSUER) {
  throw new Error("Faltan variables de entorno de Keycloak para next-auth");
}

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Necesario para firmar la cookie

  // Callbacks para manejar el token JWT
  callbacks: {
    async jwt({ token, account }) {
      // Al iniciar sesión, guardar el access_token y refresh_token en el token JWT de next-auth
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at; 
      }
      // TODO: Aquí puedes añadir lógica para refrescar el token si ha expirado
      return token;
    },
    async session({ session, token }) {
      // Hacer que el access_token esté disponible en la sesión del cliente
      // ¡Cuidado! No expongas información sensible aquí si no es necesario
      if (session.user && token.accessToken) {
        // Puedes añadir más datos del token a la sesión si los necesitas
        // session.user.id = token.sub; // El ID de Keycloak
        (session as any).accessToken = token.accessToken; // Añadimos el token a la sesión
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };