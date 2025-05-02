"use client";
import { useEffect, useState } from "react";
import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { FiCalendar, FiTag, FiTwitter, FiFacebook } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import './markdown-styles.css';

// クライアントコンポーネントを動的インポート
const ProfileCard = dynamic(() => import('@/components/ProfileCard'), {
  ssr: false, // サーバーサイドレンダリングを無効化
  loading: () => <div className="p-4 bg-gray-100 rounded">プロフィール読み込み中...</div>
});

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;

// HTMLタグを削除してMarkdownテキストを抽出する関数
function extractMarkdownFromHTML(html: string): string {
  if (!html) return '';
  
  // リンク付き画像の修正 - ![alt](<a href="URL">URL</a>) パターンを ![alt](URL) に変換
  html = html.replace(/!\[(.*?)\]\(<a href="([^"]+)">[^<]+<\/a>\)/g, '![$1]($2)');
  
  // 残っている <a> タグを解決
  html = html.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // テーブルを検出して正しく処理する
  const tablePattern = new RegExp('(\\<p\\>\\|.*?\\|<\\/p\\>\\s*){2,}', 'g');
  const tables = html.match(tablePattern);
  
  if (tables) {
    // 各テーブルを処理
    tables.forEach(tableHtml => {
      // テーブル行を抽出
      const rows = tableHtml.match(/<p>\|(.*?)\|<\/p>/g);
      if (!rows) return;
      
      // 整形されたマークダウンテーブルを作成
      let markdownTable = '';
      rows.forEach((row, index) => {
        // <p>タグを削除し、余分なスペースをトリム
        const cleanRow = row.replace(/<p>|<\/p>/g, '').trim();
        markdownTable += cleanRow + '\n';
        
        // 最初の行の後にヘッダー区切り行を挿入
        if (index === 0) {
          const headerCells = cleanRow.split('|').filter(Boolean).length;
          const separatorRow = '|' + '---|'.repeat(headerCells) + '\n';
          markdownTable += separatorRow;
        }
      });
      
      // 元のHTMLテーブルを整形されたMarkdownテーブルに置換
      html = html.replace(tableHtml, markdownTable);
    });
  }
  
  // その他のHTMLタグを処理
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<hr\s*\/?>/g, '---\n\n')
    // コメントタグを削除
    .replace(/<!--[\s\S]*?-->/g, '')
    // 連続する改行を2つに制限
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 投稿データの型定義
type Category = {
  id: string;
  name: string;
};

type Post = {
  id: string;
  title: string;
  publishedAt: string;
  content?: string;
  category?: Category;
  // 必要に応じて他のプロパティを追加
};

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [markdownContent, setMarkdownContent] = useState(""); // 追加: markdownContent の状態変数

  useEffect(() => {
    // クライアントサイドでのみwindowオブジェクトを使用
    setCurrentUrl(window.location.href);
    
    // APIの呼び出しなどの既存コード
    if (!API_KEY) {
      setError("API key is missing");
      setLoading(false);
      return;
    }

    fetch(`${ENDPOINT}/${slug}`, {
      headers: { "X-API-KEY": API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
        // HTMLタグからMarkdownを抽出
        if (data.content) {
          const markdown = extractMarkdownFromHTML(data.content);
          console.log("変換後のMarkdown:", markdown); // デバッグ用
          setMarkdownContent(markdown);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("記事が見つかりません");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8">記事を読み込み中...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      {/* 記事タイトル */}
      {post.title && <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>}
      
      {/* メタデータ */}
      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
        <div className="flex items-center mr-4">
          <FiCalendar className="mr-1" />
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </time>
        </div>
        
        {post.category && (
          <Link href={`/category/${post.category.id}`} className="flex items-center mr-4 hover:text-blue-600">
            <FiTag className="mr-1" />
            <span>{post.category.name}</span>
          </Link>
        )}
      </div>
      
      {/* Markdownコンテンツ */}
      <article className="markdown-content prose prose-lg prose-slate max-w-none mb-12">
        {/* ReactMarkdownコンポーネント */}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            table: (props) => <table className="md-table" {...props} />,
            th: (props) => <th className="md-th" {...props} />,
            td: (props) => <td className="md-td" {...props} />,
            blockquote: (props) => <blockquote className="md-quote" {...props} />,
            a: (props) => <a className="md-link" {...props} />
          }}
        >
          {markdownContent} 
        </ReactMarkdown>
      </article>
      
      {/* シェアボタン */}
      <div className="mb-12">
        <p className="text-sm font-semibold text-gray-600 mb-2">この記事をシェアする:</p>
        <div className="flex gap-2">
          {typeof window !== 'undefined' && (
            <>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] hover:bg-[#0c85d0] text-white p-2 rounded-full"
                aria-label="Twitterでシェア"
              >
                <FiTwitter size={18} />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1877F2] hover:bg-[#0c5ec7] text-white p-2 rounded-full"
                aria-label="Facebookでシェア"
              >
                <FiFacebook size={18} />
              </a>
            </>
          )}
        </div>
      </div>
      
      {/* 著者プロフィール */}
      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">この記事を書いた人</h2>
        <ProfileCard isCompact={true} />
      </div>
      
      {/* 関連記事（オプション） */}
      {/* デバッグ表示 */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-10 p-4 border border-gray-200 rounded-lg">
          <summary className="cursor-pointer font-bold">デバッグ情報</summary>
          <div className="mt-4">
            <h4 className="font-bold">記事データ:</h4>
            <pre className="bg-gray-100 p-2 mt-2 overflow-auto max-h-60 text-xs">
              {JSON.stringify(post, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </main>
  );
}
