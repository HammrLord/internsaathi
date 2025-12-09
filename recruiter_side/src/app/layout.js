import './globals.css';
import AppLayout from '@/components/AppLayout';
import ChatbotWidget from '@/components/ChatbotWidget';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { JobsProvider } from '@/context/JobsContext';
import { InterviewsProvider } from '@/context/InterviewsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import NextAuthSessionProvider from '@/components/NextAuthSessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PM Internship Recruiter Platform',
  description: 'Advanced recruiter platform for the PM Internship Scheme',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <NextAuthSessionProvider>
          <AuthProvider>
            <JobsProvider>
              <InterviewsProvider>
                <NotificationsProvider>
                  <AppLayout>{children}</AppLayout>
                  <ChatbotWidget />
                </NotificationsProvider>
              </InterviewsProvider>
            </JobsProvider>
          </AuthProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
