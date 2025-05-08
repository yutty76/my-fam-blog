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
  metadataBase: new URL('https://peaceful-brigadeiros-6717be.netlify.app/'), // <--- この行を追加 (URLは実際のドメインに置き換える)
  title: "OB夫婦ブログ | 効果的なトレーニングと知識を発信",
  description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
  openGraph: {
    title: "OB夫婦ブログ| 効果的なトレーニングと知識を発信",
    description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
    url: 'https://peaceful-brigadeiros-6717be.netlify.app/', // 後で本番URLに変更
    siteName: "OB夫婦ブログ",
    images: [ // <--- OGP画像の追加
      {
        url: '/og-image.png', // /public/og-image.png などのパスを指定
        width: 1200,
        height: 630,
        alt: 'OB夫婦ブログのOGP画像',
      },
    ],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image", // または "summary"
    title: "OB夫婦ブログ | 効果的なトレーニングと知識を発信",
    description: "初心者から上級者まで役立つ筋トレ情報・メニュー・サプリ・器具レビューなどを発信するブログです。",
    images: ['/twitter-image.png'], // /public/twitter-image.png などのパスを指定 (OGP画像と共通でも可)
    // creator: '@YourTwitterHandle', // サイト運営者のTwitterアカウント
    // site: '@YourWebsiteTwitterHandle', // サイト自体のTwitterアカウント
  },
  icons: { // <--- アイコン設定の追加
    icon: '/favicon.ico', // 通常のファビコン
    shortcut: '/favicon-16x16.png', // ショートカットアイコン
    apple: '/apple-touch-icon.png', // Appleデバイス用アイコン
    // other: [ // その他のアイコン
    //   {
    //     rel: 'icon',
    //     url: '/favicon-32x32.png',
    //     sizes: '32x32',
    //   },
    // ],
  },
  // keywords: ['筋トレ', 'トレーニング', 'フィットネス', 'ダイエット', '筋肉'], // 必要に応じてキーワードを追加
  // authors: [{ name: 'あなたの名前またはブログ名', url: 'あなたのプロフィールURLなど' }], // 運営者情報

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
