"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiTag, FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;

const POSTS_PER_PAGE = 9; // 1ページあたりの表示記事数

// 型定義
type Thumbnail = {
  url: string;
};

type Category = {
  id: string;
  name: string;
};

type Post = {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnail?: Thumbnail;
  category?: Category;
};

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("publishedAt");

  // 記事の取得
  useEffect(() => {
    if (!API_KEY) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // クエリパラメータの構築
    const offset = (currentPage - 1) * POSTS_PER_PAGE;
    let query = `?offset=${offset}&limit=${POSTS_PER_PAGE}&orders=${sortBy === "publishedAt" ? "-publishedAt" : "title"}`;
    
    // カテゴリフィルター
    if (selectedCategory) {
      query += `&filters=category[equals]${selectedCategory}`;
    }
    
    // 検索クエリ
    if (searchQuery) {
      query += `&q=${encodeURIComponent(searchQuery)}`;
    }

    fetch(`${ENDPOINT}${query}`, {
      headers: { "X-API-KEY": API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.contents || []);
        setTotalPosts(data.totalCount || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error("記事の取得に失敗しました", err);
        setLoading(false);
      });
  }, [currentPage, selectedCategory, searchQuery, sortBy]);

  // カテゴリの取得
  useEffect(() => {
    if (!API_KEY) return;

    fetch(`https://${SERVICE_ID}.microcms.io/api/v1/categories`, {
      headers: { "X-API-KEY": API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        if (data.contents) {
          setCategories(data.contents);
        }
      })
      .catch(err => {
        console.error("カテゴリの取得に失敗しました", err);
      });
  }, []);

  // 検索ハンドラ
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 検索時は1ページ目に戻る
  };

  // ページネーションの設定
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const pageNumbers = [];
  const maxPageDisplay = 5;
  
  let startPage = Math.max(currentPage - Math.floor(maxPageDisplay / 2), 1);
  const endPage = Math.min(startPage + maxPageDisplay - 1, totalPages);
  
  if (endPage - startPage + 1 < maxPageDisplay) {
    startPage = Math.max(endPage - maxPageDisplay + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">記事アーカイブ</h1>
        
        {/* フィルタリングとソート */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* 検索 */}
            <div>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="記事を検索..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md transition duration-200">
                  <FiSearch size={20} />
                </button>
              </form>
            </div>
            
            {/* カテゴリ選択 */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">すべてのカテゴリ</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* ソート選択 */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="publishedAt">公開日 (新しい順)</option>
                <option value="title">タイトル (A-Z)</option>
              </select>
            </div>
          </div>
          
          {/* アクティブフィルター表示 */}
          {(selectedCategory || searchQuery) && (
            <div className="mt-4 flex items-center">
              <FiFilter className="text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">フィルター:</span>
              {selectedCategory && categories.find(cat => cat.id === selectedCategory) && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-1">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </span>
              )}
              {searchQuery && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-1">
                  「{searchQuery}」で検索
                </span>
              )}
              <button 
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="ml-2 text-xs text-red-600 hover:text-red-800"
              >
                クリア
              </button>
            </div>
          )}
        </div>
        
        {/* 記事リスト */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">記事を読み込み中...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <Link href={`/posts/${post.id}`}>
                    <div className="relative h-48">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail.url}
                          alt={post.title}
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
                        {post.category && (
                          <>
                            <FiTag className="ml-4 mr-1" />
                            <span>{post.category.name}</span>
                          </>
                        )}
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
            
            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-l-md border border-gray-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`}
                    aria-label="前のページ"
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-4 py-2 border border-gray-300 ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-current={currentPage === number ? 'page' : undefined}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-r-md border border-gray-300 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`}
                    aria-label="次のページ"
                  >
                    <FiChevronRight />
                  </button>
                </nav>
              </div>
            )}
            
            {/* 件数表示 */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {totalPosts}件中 {(currentPage - 1) * POSTS_PER_PAGE + 1}-{Math.min(currentPage * POSTS_PER_PAGE, totalPosts)}件を表示
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">記事が見つかりませんでした</h3>
            <p className="text-gray-600 mt-2">検索条件を変更するか、別のカテゴリをお試しください。</p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200"
            >
              すべての記事を表示
            </button>
          </div>
        )}
        
        {/* ホームページに戻るリンク */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
            <FiChevronLeft className="mr-1" />
            ホームページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
