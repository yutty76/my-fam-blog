"use client";
import React from 'react';
import Link from 'next/link';
import { FiHome, FiUser, FiAward, FiBookOpen, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';
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
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">プロフィール</h1>
        
        {/* プロフィールカード */}
        <ProfileCard className="mb-10" />
        
        {/* 経歴セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiUser className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">経歴</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-semibold">2019 - 現在</h3>
              <p className="text-gray-700">フリーランスパーソナルトレーナー</p>
              <p className="text-gray-600 text-sm">オンラインと対面でのトレーニング指導、栄養相談を提供。</p>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-semibold">2015 - 2019</h3>
              <p className="text-gray-700">フィットネスクラブ A社</p>
              <p className="text-gray-600 text-sm">パーソナルトレーナーとして多数のクライアントを指導。</p>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-semibold">2013 - 2015</h3>
              <p className="text-gray-700">スポーツ栄養コンサルタント B社</p>
              <p className="text-gray-600 text-sm">アスリート向け栄養プログラムの開発に従事。</p>
            </div>
          </div>
        </section>
        
        {/* 資格セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiAward className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">保有資格</h2>
          </div>
          
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li className="text-gray-700">NSCA認定パーソナルトレーナー</li>
            <li className="text-gray-700">栄養士免許</li>
            <li className="text-gray-700">TRX認定トレーナー</li>
            <li className="text-gray-700">ファンクショナルトレーニングスペシャリスト</li>
          </ul>
        </section>
        
        {/* 専門分野セクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiBookOpen className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">専門分野</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">ウェイトトレーニング</h3>
              <p className="text-gray-700">
                初心者から上級者まで、目的に合わせた効果的なトレーニングプログラムの設計と指導。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">ダイエット・減量</h3>
              <p className="text-gray-700">
                持続可能な食習慣の形成と、健康的な体重管理のサポート。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">リハビリテーション</h3>
              <p className="text-gray-700">
                怪我からの回復トレーニングと再発予防のためのコンディショニング。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">スポーツパフォーマンス向上</h3>
              <p className="text-gray-700">
                競技特性に合わせたトレーニングと栄養プログラムの提供。
              </p>
            </div>
          </div>
        </section>
        
        {/* お問い合わせセクション */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiMessageSquare className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
          </div>
          
          <p className="text-gray-700 mb-4">
            パーソナルトレーニング、オンラインコーチング、講演依頼などのお問い合わせは以下からお願いします。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:contact@example.com" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200 text-center">
              メールでのお問い合わせ
            </a>
            <Link href="/contact" className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg transition duration-200 text-center">
              お問い合わせフォーム
            </Link>
          </div>
        </section>
        
        {/* よくある質問セクション */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiHelpCircle className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl font-bold">よくある質問</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Q: オンラインコーチングはどのように行われますか？</h3>
              <p className="text-gray-700 mt-1">
                A: ビデオ通話、トレーニングアプリ、定期的なフィードバックを通じて、あなたの進捗を管理し、目標達成をサポートします。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Q: 初心者でも指導を受けることはできますか？</h3>
              <p className="text-gray-700 mt-1">
                A: もちろんです。フィットネス経験がない方でも、基礎から丁寧に指導いたします。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Q: 栄養相談はどのような内容ですか？</h3>
              <p className="text-gray-700 mt-1">
                A: あなたの目標、体質、生活習慣に合わせた食事プランの提案と、日々の食事のサポートを行います。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
