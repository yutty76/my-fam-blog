import type { Metadata, ResolvingMetadata } from 'next';
import PostClientPage from './post-client-page'; // クライアントコンポーネントをインポート

const SERVICE_ID = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_ID;
const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1/blogs`;

export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<{ slug: string }> }, // params を Promiseとして型定義し、別名で受け取る
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await paramsPromise; // paramsPromise を await で解決
  const slug = params.slug;

  if (!API_KEY) {
    console.error("API key is missing for metadata generation");
    const previousImages = (await parent).openGraph?.images || [];
    return {
      title: "記事が見つかりません",
      openGraph: {
        images: previousImages,
      },
    };
  }

  try {
    // APIから記事データをフェッチ
    const post = await fetch(`${ENDPOINT}/${slug}`, {
      headers: { "X-API-KEY": API_KEY }
    }).then(res => {
      if (!res.ok) throw new Error("Failed to fetch post for metadata");
      return res.json();
    });

    // 親のメタデータを取得
    const previousImages = (await parent).openGraph?.images || [];
    const previousTwitterImages = (await parent).twitter?.images || [];

    // 説明文の生成ロジックを改善
    let description = '';
    const contentSource = post.summary || post.content || ''; // 概要があれば優先、なければ本文

    if (contentSource) {
      // contentSource (post.summary または post.content) が存在する場合の処理
      let processedText = contentSource;

     
      // これにより、<p>&nbsp;</p> のようなタグが後続の処理で不要な空白を残すことを防ぎます。
      processedText = processedText.replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '');
      // ★追加: <br>のみを含む空の<p>タグを削除
      processedText = processedText.replace(/<p>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

      // 1. HTMLエンティティをデコード (主要なもののみ)
      const entities: Record<string, string> = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' ',
        // 必要に応じて他のエンティティを追加
      };
      for (const key in entities) {
        const regex = new RegExp(key, 'g');
        processedText = processedText.replace(regex, entities[key]);
      }

      // 2. HTMLタグを除去
      processedText = processedText.replace(/<[^>]+>/g, '');
      
      // 3. 連続する空白文字(改行含む)を半角スペース1つに置換し、前後の空白をトリム
      processedText = processedText.replace(/\s+/g, ' ').trim();

      // 4. 適切な長さに丸める (例: 120文字)
      description = processedText.substring(0, 120);
      if (processedText.length > 120) {
        description += '...';
      }
    } else {
      // contentSource が空の場合 (post.summary も post.content もない場合)
      description = '記事の詳細'; // フォールバック
    }

    return {
      title: `${post.title} | OB夫婦ブログ`,
      description: description, // SEOのため、検索結果に表示されうるページの要約
      openGraph: {
        title: `${post.title} | OB夫婦ブログ`,
        description: description, // ソーシャルメディア共有時の説明文
        url: `https://peaceful-brigadeiros-6717be.netlify.app/posts/${slug}`, // 実際のドメインに合わせてください
        images: [
          // post.eyecatch?.url のような記事固有のアイキャッチ画像があればここに追加
          // { url: post.eyecatch?.url || '/default-og-image.png', width: 1200, height: 630, alt: post.title },
          ...previousImages,
        ],
        type: 'article',
        publishedTime: post.publishedAt,
        // modifiedTime: post.updatedAt, // 更新日時
        // authors: ['ブログ運営者名'],
        // tags: post.category?.name ? [post.category.name] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | OB夫婦ブログ`,
        description: description,
        images: [
            // post.eyecatch?.url のような記事固有のアイキャッチ画像があればここに追加
            // post.eyecatch?.url || '/default-twitter-image.png',
            ...previousTwitterImages,
        ],
        // creator: '@YourTwitterHandle',
      },
    };
  } catch (error) {
    console.error("Error fetching post for metadata:", error);
    const previousImages = (await parent).openGraph?.images || [];
    return {
      title: "記事情報の取得エラー | 筋トレブログ",
      description: "記事のメタデータの取得中にエラーが発生しました。",
      openGraph: {
        images: previousImages,
      },
    };
  }
}

// サーバーコンポーネントとしてPageをエクスポート
export default async function Page({ params: paramsPromise }: { params: Promise<{ slug: string }> }) { // params を Promiseとして型定義し、別名で受け取る
  const params = await paramsPromise; // paramsPromise を await で解決
  // PostClientPageにslugを渡してレンダリング
  return <PostClientPage slug={params.slug} />;
}
