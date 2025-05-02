import { NextRequest, NextResponse } from 'next/server';

// APIのベースURLと認証情報
const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // URLからクエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const filters = searchParams.get('filters');
    const orders = searchParams.get('orders');
    
    // エンドポイントが指定されていない場合はエラー
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }
    
    // APIリクエストのベースURLを構築
    let apiUrl = `https://${SERVICE_ID}.microcms.io/api/v1/${endpoint}`;
    
    // IDが指定されている場合、詳細取得用のURLを構築
    if (id) {
      apiUrl += `/${id}`;
    }
    
    // クエリパラメータの構築
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit);
    if (offset) queryParams.append('offset', offset);
    if (filters) queryParams.append('filters', filters);
    if (orders) queryParams.append('orders', orders);
    
    // クエリパラメータがある場合、URLに追加
    const queryString = queryParams.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }
    
    // microCMS APIへのリクエスト
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-KEY': API_KEY || '',
      },
      cache: 'no-store', // キャッシュしない
    });
    
    // エラーレスポンスの処理
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: `API request failed: ${errorData.message || response.status}` },
        { status: response.status }
      );
    }
    
    // 成功レスポンスを返す
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
