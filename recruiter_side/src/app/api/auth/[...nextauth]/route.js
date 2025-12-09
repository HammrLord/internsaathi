import NextAuthModule from "next-auth";
import CredentialsModule from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from 'bcrypt';

const NextAuth = NextAuthModule.default || NextAuthModule;
const CredentialsProvider = CredentialsModule.default || CredentialsModule;

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await query('SELECT * FROM users WHERE email = $1', [credentials.email]);
                    const user = result.rows[0];

                    if (!user) return null;
                    if (!user.password) return null; // Ensure user has a password set

                    const match = await bcrypt.compare(credentials.password, user.password);
                    if (!match) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                        onboarding_completed: user.onboarding_completed
                    };
                } catch (e) {
                    console.error("Auth Error:", e);
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.onboarding_completed = user.onboarding_completed;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.onboarding_completed = token.onboarding_completed;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
