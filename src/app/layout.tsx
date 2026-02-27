import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Short URL | s.cc5.me',
  description: '長いURLを短く、シンプルに。短縮URLを簡単に生成できるサービスです。',
  keywords: ['短縮URL', 'URL短縮', 'ショートURL', 'short url'],
  openGraph: {
    title: 'Short URL | s.cc5.me',
    description: '長いURLを短く、シンプルに。',
    type: 'website',
    url: 'https://s.cc5.me',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
