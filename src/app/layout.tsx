import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "筋トレブログ | 効果的なトレーニングと知識を発信",
  description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
  openGraph: {
    title: "筋トレブログ | 効果的なトレーニングと知識を発信",
    description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
    url: "https://your-fitness-blog.com/", // 後で本番URLに変更
    siteName: "筋トレブログ",
    images: [
      {
        url: "/ogp.png", // public配下に設置予定
        width: 1200,
        height: 630,
        alt: "筋トレブログ OGP画像"
      }
    ],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "筋トレブログ | 効果的なトレーニングと知識を発信",
    description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
    images: ["/ogp.png"]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 広告・アフィリエイト用コンポーネント挿入ポイント */}
        {/* <AdBanner /> 例: 広告バナー */}
        {children}
      </body>
    </html>
  );
}
