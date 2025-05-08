"use client";
import { useEffect, useState } from "react";
import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { FiCalendar, FiTag, FiTwitter, FiFacebook } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import './markdown-styles.css';
import './design-styles.css';

// クライアントコンポーネントを動的インポート
const ProfileCard = dynamic(() => import('@/components/ProfileCard'), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-100 rounded">プロフィール読み込み中...</div>
});

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;

// HTMLタグを削除してMarkdownテキストを抽出する関数
function extractMarkdownFromHTML(html: string): string {
  if (!html) return '';
  
  
  // ★追加: <br>のみを含む空の<p>タグを削除
  html = html.replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

  html = html.replace(/!\[(.*?)\]\(<a href="([^"]+)">[^<]+<\/a>\)/g, '![$1]($2)');
  html = html.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  const tablePattern = new RegExp('(\\<p\\>\\|.*?\\|<\\/p\\>\\s*){2,}', 'g');
  const tables = html.match(tablePattern);
  
  if (tables) {
    tables.forEach(tableHtml => {
      const rows = tableHtml.match(/<p>\|(.*?)\|<\/p>/g);
      if (!rows) return;
      
      let markdownTable = '';
      rows.forEach((row, index) => {
        const cleanRow = row.replace(/<p>|<\/p>/g, '').trim();
        markdownTable += cleanRow + '\n';
        
        if (index === 0) {
          const headerCells = cleanRow.split('|').filter(Boolean).length;
          const separatorRow = '|' + '---|'.repeat(headerCells) + '\n';
          markdownTable += separatorRow;
        }
      });
      html = html.replace(tableHtml, markdownTable);
    });
  }
  
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<hr\s*\/?>/g, '---\n\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function decodeHtmlEntities(html: string): string {
  if (!html) return '';
  let result = html;

  // ★追加: 空の<p>タグや &nbsp; のみの<p>タグを削除
  result = result.replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '');
  // ★追加: <br>のみを含む空の<p>タグを削除
  result = result.replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

  const entities: Record<string, string> = {
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&nbsp;': ' '
  };
  Object.entries(entities).forEach(([entity, char]) => {
    const regex = new RegExp(entity, 'g');
    result = result.replace(regex, char);
  });
  console.log("HTMLエンティティデコード後:", result.substring(0, 200));
  return result;
}

function prepareMarkdownContent(html: string): string {
  if (!html) return '';
  let result = html;

  // ★追加: 空の<p>タグや &nbsp; のみの<p>タグを削除
  result = result.replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '');
  // ★追加: <br>のみを含む空の<p>タグを削除
  result = result.replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

  result = result.replace(/<figure>([\s\S]*?)<\/figure>/g, (match, content) => {
    const imgMatch = content.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) return imgMatch[0];
    const imgTagMatch = content.match(/<img\s+src="([^"]+)"[^>]*>/);
    if (imgTagMatch) return `![image](${imgTagMatch[1]})`;
    return content;
  });
  result = result.replace(/<p>\s*(\|.*?\|)\s*<\/p>/g, '$1\n');
  result = result.replace(/<p>([\s\S]*?)<\/p>/g, '$1\n\n');
  const entities: Record<string, string> = {
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&nbsp;': ' '
  };
  Object.entries(entities).forEach(([entity, char]) => {
    const regex = new RegExp(entity, 'g');
    result = result.replace(regex, char);
  });
  result = result
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1')
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (match, content) => {
      return content.trim().split('\n').map((line: string) => `> ${line.trim()}`).join('\n');
    })
    .replace(/<hr\s*\/?>/g, '---')
    .replace(/<li>(.*?)<\/li>/g, '- $1')
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  result = result.replace(/<img\s+src="([^"]+)"[^>]*>/g, '![image]($1)');
  result = result.replace(/\n{3,}/g, '\n\n').trim();
  result = result.replace(/(\|\s*-{3,}\s*\|)\n\n/g, '$1\n');
  console.log("Markdown準備後:", result.substring(0, 500));
  return result;
}

// URLからクエリパラメータを取得する関数
function getQueryParams(): { [key: string]: string } {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const result: { [key: string]: string } = {};
  
  for(const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

type Category = { id: string; name: string; };
type ArticleType = '普通の文章' | 'マークダウン' | 'HTML';
type Design = '1' | '2' | '3' | '4';
type Post = {
  id: string;
  title: string;
  publishedAt: string;
  content?: string;
  category?: Category;
  design?: Design[];
  articleType?: ArticleType[];
};

export default function PostClientPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [contentToDisplay, setContentToDisplay] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const getDesignValue = (design: Design[] | undefined): Design => {
    return design && design.length > 0 ? design[0] : '1';
  };
  
  const getArticleTypeValue = (articleType: ArticleType[] | undefined): ArticleType => {
    return articleType && articleType.length > 0 ? articleType[0] : '普通の文章';
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);
    
    if (!API_KEY) {
      setError("API key is missing");
      setLoading(false);
      return;
    }

    // クエリパラメータを取得
    const queryParams = getQueryParams();
    const contentId = queryParams.contentId;
    const draftKey = queryParams.draftKey;
    
    // プレビューモードかどうかを判定
    const preview = !!(contentId && draftKey);
    setIsPreview(preview);

    // APIリクエスト用のURLとヘッダーを準備
    let url = `${ENDPOINT}/${slug}`;
    const headers: HeadersInit = { "X-API-KEY": API_KEY };
    
    // プレビューモードの場合はURLとヘッダーを変更
    if (preview) {
      url = `${ENDPOINT}/${contentId}?draftKey=${draftKey}`;
    }

    fetch(url, { headers })
      .then(res => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(data => {
        let cleanedContent = data.content || '';
        // ★追加: data.content を受け取った直後にクリーニング処理
        if (cleanedContent) {
          cleanedContent = cleanedContent.replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '');
          // ★追加: <br>のみを含む空の<p>タグを削除
          cleanedContent = cleanedContent.replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');
        }

        setPost({ ...data, content: cleanedContent }); // クリーンなコンテンツでpostを更新

        if (cleanedContent) { // クリーンなコンテンツを使用
          const currentArticleType = getArticleTypeValue(data.articleType);
          switch (currentArticleType) {
            case 'マークダウン':
              const preparedMarkdown = prepareMarkdownContent(cleanedContent);
              setMarkdownContent(preparedMarkdown);
              setContentToDisplay('');
              break;
            case 'HTML':
              const decodedHTML = decodeHtmlEntities(cleanedContent);
              setContentToDisplay(decodedHTML);
              setMarkdownContent('');
              break;
            case '普通の文章':
            default:
              const markdown = extractMarkdownFromHTML(cleanedContent);
              setMarkdownContent(markdown);
              setContentToDisplay('');
              break;
          }
        } else {
          setMarkdownContent('');
          setContentToDisplay('');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("記事取得エラー:", err);
        setError("記事が見つかりません");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8">記事を読み込み中...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!post) return null;

  const getDesignClass = () => {
    const designValue = getDesignValue(post.design);
    switch (designValue) {
      case '1': return 'design-1';
      case '2': return 'design-2';
      case '3': return 'design-3';
      case '4': return 'design-4';
      default: return 'design-1';
    }
  };
  
  const currentArticleType = getArticleTypeValue(post.articleType);

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      {isPreview && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-bold">プレビューモード</p>
          <p className="text-sm">これは下書き記事のプレビューです。公開後は表示されません。</p>
        </div>
      )}
      {post.title && <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>}
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
      <article className={`markdown-content prose prose-lg prose-slate max-w-none mb-12 ${getDesignClass()}`}>
        {currentArticleType === 'HTML' ? (
          <div dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              table: (props) => <table className="md-table" {...props} />,
              th: (props) => <th className="md-th" {...props} />,
              td: (props) => <td className="md-td" {...props} />,
              blockquote: (props) => <blockquote className="md-quote" {...props} />,
              a: (props) => <a className="md-link" {...props} />,
              img: (props) => (
                <img 
                  src={props.src} 
                  alt={props.alt || ''} 
                  className="my-4 mx-auto rounded-lg shadow-md"
                  style={{ maxWidth: '100%', display: 'block' }}
                />
              ),
              figure: (props) => (
                <figure className="my-6">{props.children}</figure>
              )
            }}
          >
            {markdownContent} 
          </ReactMarkdown>
        )}
      </article>
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
      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">この記事を書いた人</h2>
        <ProfileCard isCompact={true} />
      </div>
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
