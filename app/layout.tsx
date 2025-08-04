import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PushNotificationManager, InstallPrompt } from '@/components/PWAComponents';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farm Fresh - Fresh Produce Marketplace',
  description: 'Connect directly with South African farmers for fresh produce delivery',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Farm Fresh',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/assets/logo/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/logo/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/logo/logo.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Farm Fresh" />
        <link rel="apple-touch-icon" href="/assets/logo/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <PushNotificationManager />
        <InstallPrompt />
      </body>
    </html>
  );
}
