import Footer from '@/components/footer';
import Header from '@/components/header';
import Provider from '@/components/provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ElevenLabs | Kushagra Sarathe',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Provider>
          <div className="mx-auto flex min-h-screen w-full flex-col px-6 md:max-w-7xl md:gap-y-4">
            <Header />
            <div>{children}</div>
            <div className="mt-auto">
              <Footer />
            </div>
            <Toaster theme="light" richColors />
          </div>
        </Provider>
      </body>
    </html>
  );
}
