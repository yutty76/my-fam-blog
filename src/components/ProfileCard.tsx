"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Imageコンポーネントをインポート
import { FiArrowRight } from 'react-icons/fi';

interface ProfileCardProps {
  className?: string;
  isCompact?: boolean; // コンパクトモードかどうか（記事下用）
  hideProfileLink?: boolean; // プロフィールリンクを非表示にするか
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className = '', isCompact = false, hideProfileLink = false }) => {
  // 画像サイズを決定
  const imageSize = isCompact ? 80 : 128; // コンパクトなら80px, 通常なら128px

  return (
    <div className={`bg-white rounded-lg shadow-md ${isCompact ? 'p-4' : 'p-6'} ${className}`}>
      <div className={`flex ${isCompact ? 'flex-row items-center' : 'flex-col md:flex-row items-center'} gap-4 md:gap-6`}>
        {/* プロフィール写真 - SVGをImageコンポーネントに置き換え */}
        <div 
          className={`relative shrink-0 rounded-full overflow-hidden bg-gray-200`} 
          style={{ width: imageSize, height: imageSize }} // サイズを動的に設定
        >
          {/* 画像パスは実際のプロジェクトに合わせて変更してください */}
          <Image 
            src="/profileImg.png" // 画像のパスを指定
            alt="OB夫婦 プロフィール写真"
            width={imageSize} // width を設定
            height={imageSize} // height を設定
            className="object-cover" // 親要素に合わせてカバー
            priority // 必要に応じてpriorityを設定 (例: LCPになる場合)
            
          />
        </div>
        
        <div className="flex-1">
          {/* 名前と肩書き */}
          <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold mb-1`}>OB夫婦ブログ</h3>
          <p className={`text-gray-600 ${isCompact ? 'text-sm mb-2' : 'mb-3'}`}>
            IT業界 × 筋トレ愛好家夫婦
          </p>
          
          {/* プロフィール本文 - コンパクトモードでは短めに */}
          {!isCompact ? (
            <p className="text-gray-700">
              旦那(筋トレ歴5年)とキッチン担当の妻(筋トレ歴4年)がお送りするブログ。
              IT業界で働きながら、健康的な生活と筋トレの楽しさをシェアします。
              夫婦で実践している「忙しくても続けられる」筋トレ法や、美味しく栄養たっぷりの簡単レシピを紹介しています。
            </p>
          ) : (
            <p className="text-gray-700 text-sm">
              IT業界で働く筋トレ愛好家夫婦。トレーニング情報と手軽な高タンパクレシピを発信中。
            </p>
          )}
          
          {/* ソーシャルリンク
          <div className={`${isCompact ? 'mt-2' : 'mt-4'} flex gap-3`}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors" aria-label="Twitter">
              <FiTwitter size={isCompact ? 16 : 20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors" aria-label="Instagram">
              <FiInstagram size={isCompact ? 16 : 20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 transition-colors" aria-label="YouTube">
              <FiYoutube size={isCompact ? 16 : 20} />
            </a>
            <a href="mailto:contact@example.com" className="text-gray-600 hover:text-gray-800 transition-colors" aria-label="メール">
              <FiMail size={isCompact ? 16 : 20} />
            </a>
          </div> */}
          
          {/* プロフィールページへのリンク（hideProfileLinkがfalseの場合のみ表示） */}
          {!hideProfileLink && (
            <div className={`${isCompact ? 'mt-2' : 'mt-4'}`}>
              <Link 
                href="/profile" 
                className={`${isCompact ? 'text-sm' : ''} text-blue-600 hover:text-blue-800 flex items-center w-fit transition-colors`}
              >
                <span>プロフィールの詳細を見る</span>
                <FiArrowRight className="ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
