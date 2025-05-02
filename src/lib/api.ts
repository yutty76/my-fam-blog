import { ArticleType, CategoryType } from '../types';

interface FetchOptions {
  limit?: number;
  offset?: number;
  filters?: string;
  orders?: string;
}

// microCMSのAPIに直接アクセスする関数
async function fetchFromAPI(endpoint: string, id?: string, options: FetchOptions = {}) {
  // microCMSのAPIエンドポイント
  const BASE_URL = 'https://blog-test-next-jsdesu.microcms.io/api/v1';
  const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY || '';
  
  let url = `${BASE_URL}/${endpoint}`;
  if (id) url += `/${id}`;
  
  // クエリパラメータの構築
  const queryParams = new URLSearchParams();
  if (options.limit) queryParams.append('limit', options.limit.toString());
  if (options.offset) queryParams.append('offset', options.offset.toString());
  if (options.filters) queryParams.append('filters', options.filters);
  if (options.orders) queryParams.append('orders', options.orders);
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  // APIリクエストの実行
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

// 記事一覧の取得
export async function getArticles(options: FetchOptions = {}): Promise<{ contents: ArticleType[], totalCount: number }> {
  return fetchFromAPI('blogs', undefined, options);
}

// 特定の記事を取得
export async function getArticleById(id: string): Promise<ArticleType> {
  return fetchFromAPI('blogs', id);
}

// カテゴリ一覧の取得
export async function getCategories(): Promise<{ contents: CategoryType[] }> {
  return fetchFromAPI('categories');
}

// 特定のカテゴリを取得
export async function getCategoryById(id: string): Promise<CategoryType> {
  return fetchFromAPI('categories', id);
}

// HTMLテキストをMarkdown形式に変換
export function extractMarkdownFromHTML(html: string): string {
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
