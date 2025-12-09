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
                password: { label: "Password", type: "password" },
                recaptchaToken: { label: "Recaptcha Token", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await query('SELECT * FROM users WHERE email = $1', [credentials.email]);
                    const user = result.rows[0];

                    if (!user) return null; // Or throw specific error like "UserNotFound"

                    // Check failed attempts
                    if (user.failed_login_attempts >= 3) {
                        if (!credentials.recaptchaToken) {
                            throw new Error('RECAPTCHA_REQUIRED');
                        }

                        // Verify Recaptcha
                        const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Placeholder or env
                        if (secretKey) { // Only verify if key is present (dev mode safety)
                            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${credentials.recaptchaToken}`;
                            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
                            const recaptchaData = await recaptchaRes.json();

                            if (!recaptchaData.success) {
                                throw new Error('RECAPTCHA_INVALID');
                            }
                        }
                    }

                    if (!user.password) return null;

                    const match = await bcrypt.compare(credentials.password, user.password);

                    if (!match) {
                        // Increment failed attempts
                        await query('UPDATE users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1, last_failed_login = NOW() WHERE email = $1', [credentials.email]);
                        throw new Error('INVALID_CREDENTIALS');
                    }

                    // Reset failed attempts on success
                    if (user.failed_login_attempts > 0) {
                        await query('UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL WHERE email = $1', [credentials.email]);
                    }

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
                    throw e; // Rethrow to let NextAuth handle it or pass message
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
