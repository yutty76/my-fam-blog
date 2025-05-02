/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 必要に応じて他の設定も維持・追加
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        port: '',
        pathname: '/assets/**', // microCMSのアセットパスに合わせて調整可能
      },
      // 他に許可したい外部ドメインがあればここに追加
      // 例: { protocol: 'https', hostname: 'example.com' }
    ],
  },
  // 他の既存の設定があればここに追加
};

module.exports = nextConfig;
