"use client";
import { useEffect, useState } from "react";
import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // HTMLタグを処理するためのプラグインを追加
import Link from 'next/link';
import { FiCalendar, FiTag, FiTwitter, FiFacebook } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import './markdown-styles.css';
import './design-styles.css'; // デザインスタイルのインポート

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

// HTMLエスケープされたタグをデコードする関数 (pタグ除去ロジックを削除)
function decodeHtmlEntities(html: string): string {
  if (!html) return '';
  
  let result = html;
  
  // 最も一般的なHTMLエンティティを置換
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
    // 必要に応じて他のエンティティを追加
  };
  
  // エンティティをすべて置換
  Object.entries(entities).forEach(([entity, char]) => {
    const regex = new RegExp(entity, 'g');
    result = result.replace(regex, char);
  });
  
  console.log("HTMLエンティティデコード後:", result.substring(0, 200));
  
  return result;
}

// Markdownコンテンツからpタグを除去し、基本的なHTMLをMarkdownに変換する関数
function prepareMarkdownContent(html: string): string {
  if (!html) return '';

  let result = html;
  
  // figureタグ内の画像を処理
  result = result.replace(/<figure>([\s\S]*?)<\/figure>/g, (match, content) => {
    // 画像タグを抽出
    const imgMatch = content.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      // すでにマークダウン形式になっている場合はそのまま返す
      return imgMatch[0];
    }
    
    // img タグを処理
    const imgTagMatch = content.match(/<img\s+src="([^"]+)"[^>]*>/);
    if (imgTagMatch) {
      return `![image](${imgTagMatch[1]})`;
    }
    
    // どちらにもマッチしなければ元のコンテンツを返す
    return content;
  });

  // 1. <p>タグで囲まれたテーブル行 (|...|) を処理
  result = result.replace(/<p>\s*(\|.*?\|)\s*<\/p>/g, '$1\n');

  // 2. 残りの<p>タグを処理
  result = result.replace(/<p>([\s\S]*?)<\/p>/g, '$1\n\n');

  // 3. HTMLエンティティをデコード
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
  };
  Object.entries(entities).forEach(([entity, char]) => {
    const regex = new RegExp(entity, 'g');
    result = result.replace(regex, char);
  });

  // 4. 基本的なHTMLタグをMarkdown構文に変換
  result = result
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // 太字
    .replace(/<em>(.*?)<\/em>/g, '*$1*')       // 斜体
    .replace(/<h1>(.*?)<\/h1>/g, '# $1')       // 見出し1
    .replace(/<h2>(.*?)<\/h2>/g, '## $1')      // 見出し2
    .replace(/<h3>(.*?)<\/h3>/g, '### $1')     // 見出し3
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (match, content) => { // 引用
      // 引用内の各行の先頭に > を追加
      return content.trim().split('\n').map((line: string) => `> ${line.trim()}`).join('\n');
    })
    .replace(/<hr\s*\/?>/g, '---')             // 水平線
    .replace(/<li>(.*?)<\/li>/g, '- $1')       // リスト項目
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)'); // リンク

  // 5. 画像タグを処理 (まだ変換されていない場合)
  result = result.replace(/<img\s+src="([^"]+)"[^>]*>/g, '![image]($1)');

  // 6. 連続する改行を調整し、前後の空白をトリム
  result = result.replace(/\n{3,}/g, '\n\n').trim();
  result = result.replace(/(\|\s*-{3,}\s*\|)\n\n/g, '$1\n');

  console.log("Markdown準備後:", result.substring(0, 500));

  return result;
}

// 投稿データの型定義
type Category = {
  id: string;
  name: string;
};

// 投稿の種類を定義
type ArticleType = '普通の文章' | 'マークダウン' | 'HTML';
type Design = '1' | '2' | '3' | '4';

type Post = {
  id: string;
  title: string;
  publishedAt: string;
  content?: string;
  category?: Category;
  design?: Design[]; // 配列形式に対応
  articleType?: ArticleType[]; // 配列形式に対応
  // 必要に応じて他のプロパティを追加
};

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [markdownContent, setMarkdownContent] = useState(""); // Markdown用コンテンツ
  const [contentToDisplay, setContentToDisplay] = useState(""); // 表示用コンテンツ

  // 配列または単一値からデザイン値を取得 (APIレスポンスが配列のため修正)
  const getDesignValue = (design: Design[] | undefined): Design => {
    return design && design.length > 0 ? design[0] : '1'; // 配列の最初の要素、なければデフォルト
  };
  
  // 配列または単一値から記事タイプを取得 (APIレスポンスが配列のため修正)
  const getArticleTypeValue = (articleType: ArticleType[] | undefined): ArticleType => {
    return articleType && articleType.length > 0 ? articleType[0] : '普通の文章'; // 配列の最初の要素、なければデフォルト
  };

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
        console.log("APIレスポンス:", data); // APIレスポンス全体をログ出力
        setPost(data);
        
        // 文章タイプに応じたコンテンツ処理
        if (data.content) {
          // 配列から記事タイプを取得
          const currentArticleType = getArticleTypeValue(data.articleType);
          console.log("現在の記事タイプ:", currentArticleType); // 取得した記事タイプをログ出力

          switch (currentArticleType) {
            case 'マークダウン':
              // pタグを除去し、HTMLエンティティをデコードし、基本HTMLをMarkdownに変換
              const preparedMarkdown = prepareMarkdownContent(data.content);
              setMarkdownContent(preparedMarkdown);
              setContentToDisplay('');
              break;
            case 'HTML':
              console.log("HTML処理開始:", data.content.substring(0, 100) + "...");
              // HTMLエンティティのみデコード (pタグは保持)
              const decodedHTML = decodeHtmlEntities(data.content);
              setContentToDisplay(decodedHTML);
              setMarkdownContent('');
              break;
            case '普通の文章':
            default:
              // 既存のHTMLからMarkdownへの変換処理
              const markdown = extractMarkdownFromHTML(data.content);
              console.log("変換後のMarkdown:", markdown);
              setMarkdownContent(markdown);
              setContentToDisplay('');
              break;
          }
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

  // デザインに応じたCSSクラスを取得 (ヘルパー関数を使用)
  const getDesignClass = () => {
    const designValue = getDesignValue(post.design); // ヘルパー関数で値を取得
    switch (designValue) {
      case '1': return 'design-1';
      case '2': return 'design-2';
      case '3': return 'design-3';
      case '4': return 'design-4';
      default: return 'design-1';
    }
  };
  
  // 記事タイプを取得 (ヘルパー関数を使用)
  const currentArticleType = getArticleTypeValue(post.articleType);

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
      
      {/* コンテンツ表示 - デザインクラスを適用 */}
      <article className={`markdown-content prose prose-lg prose-slate max-w-none mb-12 ${getDesignClass()}`}>
        {/* 文章タイプに応じた表示 (ヘルパー関数で取得した値を使用) */}
        {currentArticleType === 'HTML' ? (
          // HTMLの場合はdangerouslySetInnerHTMLで表示
          <div dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
        ) : (
          // マークダウンまたは普通の文章の場合はReactMarkdownで表示
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} // HTMLタグを処理するプラグインを追加
            components={{
              table: (props) => <table className="md-table" {...props} />,
              th: (props) => <th className="md-th" {...props} />,
              td: (props) => <td className="md-td" {...props} />,
              blockquote: (props) => <blockquote className="md-quote" {...props} />,
              a: (props) => <a className="md-link" {...props} />,
              // 画像を適切に処理するためのコンポーネント - altテキストを表示しないように修正
              img: (props) => (
                <div className="my-4">
                  <img 
                    src={props.src} 
                    alt={props.alt || ''} 
                    className="mx-auto rounded-lg shadow-md"
                    style={{ maxWidth: '100%' }} 
                  />
                </div>
              ),
              // figureタグを処理するコンポーネント
              figure: (props) => (
                <figure className="my-6">{props.children}</figure>
              )
            }}
          >
            {markdownContent} 
          </ReactMarkdown>
        )}
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
