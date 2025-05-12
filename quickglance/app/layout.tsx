// app/layout.tsx
import type { Metadata } from 'next';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'QuickGlance',
  description: 'Job preparation tool for programmers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
