import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "saml",
      name: "SAML SSO",
      type: "oauth",
      // Kita paksa redirect ke Keycloak SAML Endpoint
      authorization: {
        url: process.env.SAML_IDP_ENTRY_POINT,
        params: { 
          SAMLRequest: "", // Ini akan dihandle oleh library nanti
        },
      },
      clientId: process.env.SAML_ISSUER,
      clientSecret: "placeholder", // SAML tidak butuh secret tapi NextAuth butuh field ini
      checks: ["none"],
      profile(profile) {
        return {
          id: profile.id || profile.sub,
          name: profile.name,
          email: profile.email,
          role: profile.role || "user",
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true, // Aktifkan log di terminal agar kita bisa lihat errornya
});

export { handler as GET, handler as POST };
