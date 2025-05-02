"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleList from "@/components/ArticleList";
import CategoryList from "@/components/CategoryList";
import ProfileCard from "@/components/ProfileCard";
import { getArticles, getCategories } from "@/lib/api";
import { ArticleType, CategoryType } from "@/types";

export default function HomePage() {
  const [posts, setPosts] = useState<ArticleType[]>([]);
  const [featuredPost, setFeaturedPost] = useState<ArticleType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 記事を取得
        const articlesData = await getArticles({ limit: 10 });
        setPosts(articlesData.contents);
        
        // 最初の記事を特集記事として設定
        if (articlesData.contents.length > 0) {
          setFeaturedPost(articlesData.contents[0]);
        }
        
        // カテゴリを取得
        const categoriesData = await getCategories();
        setCategories(categoriesData.contents);
      } catch (err) {
        console.error("データの取得に失敗しました", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8">コンテンツを読み込み中...</div>;

  return (
    <main>
      {/* ヒーローセクション */}
      <HeroSection />

      {/* 特集記事 */}
      {featuredPost && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">注目の記事</h2>
            <FeaturedArticle article={featuredPost} />
          </div>
        </section>
      )}

      {/* カテゴリリスト */}
      {categories.length > 0 && (
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">カテゴリから探す</h2>
          <CategoryList categories={categories} />
        </section>
      )}

      {/* 最新記事 */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">最新の記事</h2>
        <ArticleList articles={posts.slice(1)} />
        
        <div className="text-center mt-12">
          <Link href="/archive" className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 px-8 rounded-lg transition duration-200">
            すべての記事を見る
          </Link>
        </div>
      </section>

      {/* 運営者紹介 */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">ブログ運営者</h2>
          <ProfileCard />
        </div>
      </section>
    </main>
  );
}
