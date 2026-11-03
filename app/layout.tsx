import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeakGuard LLR — FTA Root Cause Agent & Diagnostic Portal',
  description: 'Automotive Water Leak Failure Tree Analysis (FTA) & Root Cause Reasoning System for Service Technicians, Techliners & Quality Analysts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col transition-colors duration-200 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

