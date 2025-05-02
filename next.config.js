/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 必要に応じて他の設定も維持・追加
  images: {
    // ローカル画像の場合、通常ここにドメイン指定は不要
    // Netlifyプラグインがローダーを自動設定することを期待
    // 問題が解決しない場合、loader: 'default' などを試すことも検討
  },
  // 他の既存の設定があればここに追加
};

module.exports = nextConfig;
