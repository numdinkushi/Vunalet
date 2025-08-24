import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { PWAComponents } from '@/components/PWAComponents';
import { ConvexClientProvider } from '../providers/ConvexClientProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vunalet - Harvesting the Future',
  description: 'Connect directly with local farmers and access the freshest produce while supporting sustainable agriculture in South Africa',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vunalet',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/assets/logo/logo-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/logo/logo-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/logo/logo-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#147A4E',
          colorBackground: '#ffffff',
          colorText: '#1a1a1a',
        },
      }}
    >
      <ConvexClientProvider>
        <html lang="en">
          <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#22c55e" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Vunalet" />
            <link rel="apple-touch-icon" href="/assets/logo/logo-192x192.png" />
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
            <PWAComponents />
            <Toaster />
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
