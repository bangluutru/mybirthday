import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Your Birthday Universe | Khám phá những con người đặc biệt sinh cùng ngày',
  description: 'Khám phá danh nhân, sự kiện lịch sử và những câu chuyện thú vị gắn liền với ngày bạn ra đời.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Your Birthday Universe',
    description: 'Ngày bạn sinh ra có một thế giới riêng. Khám phá những danh nhân, nghệ sĩ và sự kiện đặc biệt cùng ngày sinh.',
    images: ['/share/share-card-collage.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#070a13',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans antialiased bg-slate-50 md:bg-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
