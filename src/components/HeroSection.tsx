"use client";
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">フィットネスと健康的な生活のためのブログ</h1>
          <p className="text-xl mb-8">トレーニング、栄養、健康に関する最新情報をお届けします</p>
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="記事を検索..."
              className="flex-1 p-3 bg-white rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-blue-500 hover:bg-blue-600 p-3 rounded-r-lg transition duration-200">
              <FiSearch size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
