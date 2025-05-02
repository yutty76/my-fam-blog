"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query || !API_KEY) {
      setLoading(false);
      return;
    }

    fetch(`${ENDPOINT}?q=${encodeURIComponent(query)}`, {
      headers: { "X-API-KEY": API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        setResults(data.contents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("検索に失敗しました", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">「{query}」の検索結果</h1>
      
      {loading ? (
        <p>検索中...</p>
      ) : results.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(post => (
            <Link 
              key={post.id} 
              href={`/posts/${post.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition duration-200"
            >
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
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.description || "この記事の詳細をご覧ください..."}
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-6">「{query}」に一致する記事が見つかりませんでした</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      )}
    </main>
  );
}
