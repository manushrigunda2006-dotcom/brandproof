import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BrandProof – Content Brand Governance & Pre-Publish Review',
  description:
    'Review content before publication against approved brand guidelines, facts, terminology, and assets with transparent human-in-the-loop governance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full font-sans antialiased text-slate-900 bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
