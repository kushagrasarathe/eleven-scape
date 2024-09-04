import Header from '@/components/header';
import Provider from '@/components/provider';
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
          <div className="mx-auto px-6 md:max-w-7xl md:space-y-4">
            <Header />
            <div>{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
