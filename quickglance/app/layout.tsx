// app/layout.tsx
import type { Metadata } from 'next';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';

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
      </body>
    </html>
  );
}
