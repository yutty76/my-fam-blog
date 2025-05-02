"use client";
import React from 'react';
import Link from 'next/link';
import { FiHome, FiUser, FiCode, FiBookOpen, FiHeart } from 'react-icons/fi';
import ProfileCard from '@/components/ProfileCard';

export default function ProfilePage() {
  return (
    <main className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <FiHome className="mr-1" /> ホームに戻る
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">私たちについて</h1>
        
        {/* プロフィールカード */}
        <ProfileCard className="mb-10" />
        
        {/* 経歴セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiCode className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">私たちの経歴</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">夫 プロフィール</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-gray-700">Webエンジニア（フロントエンド）</p>
                  <p className="text-gray-600 text-sm">国内IT企業で5年間勤務。ReactやTypeScriptを中心に開発中。</p>
                </div>
                
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-gray-700">筋トレ歴：5年</p>
                  <p className="text-gray-600 text-sm">主にベーシック種目を中心としたトレーニングを継続中。週4回のジム通い。</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">妻 プロフィール</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-gray-700">システムエンジニア</p>
                  <p className="text-gray-600 text-sm">社内システムの設計・開発に携わり、プロジェクトマネジメントも担当。</p>
                </div>
                
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-gray-700">筋トレ歴：4年</p>
                  <p className="text-gray-600 text-sm">週3回のトレーニングと、高タンパク低カロリーな食事作りが得意。</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 趣味・興味セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiHeart className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">趣味・興味</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">夫の趣味</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li className="text-gray-700">自宅筋トレ器具コレクション</li>
                <li className="text-gray-700">プロテイン飲み比べ</li>
                <li className="text-gray-700">テック系ガジェット収集</li>
                <li className="text-gray-700">プログラミング学習</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">妻の趣味</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li className="text-gray-700">高タンパクレシピ開発</li>
                <li className="text-gray-700">スマートウォッチでの健康管理</li>
                <li className="text-gray-700">フィットネスアパレル収集</li>
                <li className="text-gray-700">アウトドアアクティビティ</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* 専門分野セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiBookOpen className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">ブログでの専門分野</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">トレーニング情報</h3>
              <p className="text-gray-700">
                IT業界の忙しい日々でも実践できるワークアウトプランや、自宅トレーニングのコツ、
                初心者からできる基本的なフォームの解説など。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">健康的な食事・レシピ</h3>
              <p className="text-gray-700">
                時短で作れる高タンパク低カロリーレシピや、食事管理アプリの活用法、
                外食時の賢い食事の選び方など。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">IT×フィットネス</h3>
              <p className="text-gray-700">
                デスクワーカー向けの健康管理、フィットネスアプリのレビュー、
                テクノロジーを活用したトレーニング記録の方法など。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">夫婦の健康ライフ</h3>
              <p className="text-gray-700">
                互いにモチベーションを高め合う方法、カップルでのワークアウト、
                二人の健康的な食生活の工夫など。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
