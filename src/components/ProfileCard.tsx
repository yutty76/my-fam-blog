"use client";
import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';

interface ProfileCardProps {
  className?: string;
  isCompact?: boolean; // コンパクトモードかどうか（記事下用）
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className = '', isCompact = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${isCompact ? 'p-4' : 'p-6'} ${className}`}>
      <div className={`flex ${isCompact ? 'flex-row items-center' : 'flex-col md:flex-row items-center'} gap-4 md:gap-6`}>
        {/* プロフィール写真 */}
        <div className={`${isCompact ? 'w-20 h-20' : 'w-32 h-32'} rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400`}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          {/* 名前と肩書き */}
          <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold mb-1`}>山田 健太</h3>
          <p className={`text-gray-600 ${isCompact ? 'text-sm mb-2' : 'mb-3'}`}>
            パーソナルトレーナー / 栄養士 / フィットネスブロガー
          </p>
          
          {/* プロフィール本文 - コンパクトモードでは短めに */}
          {!isCompact ? (
            <p className="text-gray-700">
              10年以上のトレーニング経験を持つフィットネス愛好家。科学的根拠に基づいた情報発信をモットーに、
              誰もが健康的な生活を送れるようサポートします。
            </p>
          ) : (
            <p className="text-gray-700 text-sm">
              科学的根拠に基づいた健康・フィットネス情報を発信。
            </p>
          )}
          
          {/* ソーシャルリンク */}
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
          </div>
          
          {/* プロフィールページへのリンク（コンパクトモードのみ） */}
          {isCompact && (
            <div className="mt-2">
              <Link href="/profile" className="text-sm text-blue-600 hover:underline">
                プロフィールの詳細を見る →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
