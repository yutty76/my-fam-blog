"use client";
import React from 'react';
import ArticleCard from './ArticleCard';
import { ArticleType } from '../types';

interface ArticleListProps {
  articles: ArticleType[];
  className?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, className = '' }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-800">記事がありません</h3>
        <p className="mt-2 text-gray-600">まだ記事がありません。</p>
      </div>
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          priority={index < 3} // 最初の3つの記事は優先的に読み込む
        />
      ))}
    </div>
  );
};

export default ArticleList;
