import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono, Inter, Poppins, Noto_Sans_KR } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 브랜드 Typography: Heading용 (Inter / Poppins)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// 브랜드 Typography: Body용 (Pretendard 대신 Noto Sans KR 사용)
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIDIX - Fail Safe, Bid Better",
  description:
    "초보 투자자가 실패의 두려움 없이 무한히 실전 경험을 쌓아, 스스로 좋은 의사결정을 내릴 수 있는 판단력을 기르도록 돕는 AI 기반 실전 훈련 시뮬레이터",
  keywords: ["경매", "부동산 경매", "경매 시뮬레이션", "투자 교육", "BIDIX"],
  authors: [{ name: "BIDIX" }],
  openGraph: {
    title: "BIDIX - Fail Safe, Bid Better",
    description: "당신의 경험을, 데이터로 증명하다.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIDIX - Fail Safe, Bid Better",
    description: "당신의 경험을, 데이터로 증명하다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${notoSansKR.variable} antialiased`}
        >
          <ThemeProvider>
            <SyncUserProvider>
              <Navbar />
              {children}
            </SyncUserProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
