# Supabase セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのSettings > APIから以下を取得：
   - Project URL
   - anon/public key

## 2. 環境変数の設定

`.env.example`を`.env`にコピーして、実際の値を設定してください：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Zoom API設定（オプション）
VITE_ZOOM_API_KEY=your_zoom_api_key
VITE_ZOOM_API_SECRET=your_zoom_api_secret
VITE_ZOOM_ACCOUNT_ID=your_zoom_account_id
```

**注意**: Zoom APIの設定はオプションです。設定しない場合、Zoom URLはモック値が使用されます。
実際のZoom連携には、サーバーサイドでの実装を推奨します。

## 3. データベーステーブルの作成

SupabaseのSQL Editorで以下のSQLを実行してください：

```sql
-- estimates テーブル
CREATE TABLE estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building_type TEXT NOT NULL,
  building_age INTEGER NOT NULL,
  floor_area DECIMAL(10, 2) NOT NULL,
  floors INTEGER NOT NULL,
  work_types TEXT[] NOT NULL,
  deterioration_level TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  estimate_min INTEGER NOT NULL,
  estimate_max INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) の設定
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- 誰でも読み書き可能にする（本番環境では適切な権限設定を推奨）
CREATE POLICY "Allow all operations" ON estimates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- reservations テーブル
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('現地調査', 'Zoomオンライン相談')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE,
  address TEXT,
  notes TEXT,
  zoom_url TEXT,
  status TEXT NOT NULL DEFAULT '予約待ち' CHECK (status IN ('予約待ち', '確定', '完了', 'キャンセル')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) の設定
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 誰でも読み書き可能にする（本番環境では適切な権限設定を推奨）
CREATE POLICY "Allow all operations" ON reservations
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 4. Storage バケットの作成

1. Supabase Dashboard > Storage に移動
2. 新しいバケットを作成：
   - バケット名: `estimate-photos`
   - Public bucket: 有効にする
3. バケットのポリシーを設定（SQL Editorで実行）：

```sql
-- Storage ポリシー
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'estimate-photos');

CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'estimate-photos');
```

## 5. 動作確認

1. 開発サーバーを起動: `npm run dev`
2. `/estimate` ページにアクセス
3. フォームを入力して見積もりを計算
4. データがSupabaseに保存されることを確認
5. `/reservation` ページで予約をテスト
6. 予約データがSupabaseに保存されることを確認

## 6. Zoom API連携（オプション）

現在、Zoom API連携はモック実装になっています。
実際のZoomミーティング作成には、サーバーサイドでの実装を推奨します。

### 推奨実装方法

1. バックエンドAPIエンドポイントを作成（例: `/api/create-zoom-meeting`）
2. Zoom API SDKを使用してミーティングを作成
3. フロントエンドからバックエンドAPIを呼び出す

セキュリティ上の理由から、Zoom APIの認証情報はサーバーサイドで管理してください。
