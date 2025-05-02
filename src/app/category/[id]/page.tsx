"use client";
import { useEffect, useState } from "react";
import React from "react"; // Reactをインポート
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiChevronLeft, FiFilter } from "react-icons/fi";

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;
const CATEGORY_ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/categories`;

// 型定義
type Thumbnail = {
  url: string;
};

type Category = {
  id: string;
  name: string;
  description?: string;
};

type Post = {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  eyecatch?: Thumbnail;
  thumbnail?: Thumbnail;
};

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // React.use()でparamsをunwrap
  const { id } = React.use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // カテゴリ情報と関連記事を取得
  useEffect(() => {
    if (!API_KEY) {
      setError("API key is missing");
      setLoading(false);
      return;
    }

    // カテゴリ情報を取得
    fetch(`${CATEGORY_ENDPOINT}/${id}`, {
      headers: { "X-API-KEY": API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error("カテゴリが見つかりません");
        return res.json();
      })
      .then(data => {
        setCategory(data);
        
        // カテゴリに関連する記事を取得
        return fetch(`${ENDPOINT}?filters=category[equals]${id}&limit=100`, {
          headers: { "X-API-KEY": API_KEY }
        });
      })
      .then(res => {
        if (!res.ok) throw new Error("記事の取得に失敗しました");
        return res.json();
      })
      .then(data => {
        setPosts(data.contents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "データの取得に失敗しました");
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">コンテンツを読み込み中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">エラー</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <FiChevronLeft className="mr-2" /> ホームに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  if (!category) return null;

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:underline flex items-center mb-4">
            <FiChevronLeft className="mr-1" /> ホームに戻る
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-3">カテゴリ</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
        </div>
        
        {/* 記事一覧 */}
        {posts.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <FiFilter className="mr-2 text-gray-600" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-800">{posts.length}</span> 件の記事が見つかりました
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <Link href={`/posts/${post.id}`}>
                    <div className="relative h-48">
                      {post.eyecatch ? (
                        <Image
                          src={post.eyecatch.url}
                          alt={post.title || "記事のサムネイル画像"}
                          fill
                          className="object-cover"
                          priority={true}
                        />
                      ) : post.thumbnail ? (
                        <Image
                          src={post.thumbnail.url}
                          alt={post.title || "記事のサムネイル画像"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <FiClock className="mr-1" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.description || "この記事の詳細をご覧ください..."}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">記事がありません</h3>
            <p className="mt-2 text-gray-600">このカテゴリにはまだ記事がありません。</p>
            <div className="mt-6">
              <Link href="/" className="text-blue-600 hover:underline">
                ホームに戻る
              </Link>
            </div>
          </div>
        )}
        
        {/* 他のカテゴリ（オプション - 今後実装予定） */}
        {/* <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">他のカテゴリを探す</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.id}`}
                className={`py-2 px-4 rounded-full ${
                  cat.id === id ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition duration-200`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section> */}
      </div>
    </main>
  );
}
