# 営業進捗管理ダッシュボード セットアップガイド

## 1. Supabaseテーブルの拡張

SupabaseのSQL Editorで以下のSQLを実行してください：

```sql
-- estimates テーブルにカラムを追加（1つずつ実行）
DO $$ 
BEGIN
  -- status カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='status') THEN
    ALTER TABLE estimates ADD COLUMN status TEXT DEFAULT '仮見積';
  END IF;
  
  -- memo カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='memo') THEN
    ALTER TABLE estimates ADD COLUMN memo TEXT;
  END IF;
  
  -- sales_notes カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='sales_notes') THEN
    ALTER TABLE estimates ADD COLUMN sales_notes TEXT;
  END IF;
  
  -- customer_name カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='customer_name') THEN
    ALTER TABLE estimates ADD COLUMN customer_name TEXT;
  END IF;
  
  -- customer_phone カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='customer_phone') THEN
    ALTER TABLE estimates ADD COLUMN customer_phone TEXT;
  END IF;
  
  -- customer_email カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='customer_email') THEN
    ALTER TABLE estimates ADD COLUMN customer_email TEXT;
  END IF;
  
  -- updated_by カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='updated_by') THEN
    ALTER TABLE estimates ADD COLUMN updated_by TEXT;
  END IF;
  
  -- status_updated_at カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='estimates' AND column_name='status_updated_at') THEN
    ALTER TABLE estimates ADD COLUMN status_updated_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- reservations テーブルのestimate_idカラムを確認・修正
DO $$ 
BEGIN
  -- estimate_idが存在しない場合、追加
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='estimate_id') THEN
    ALTER TABLE reservations ADD COLUMN estimate_id UUID REFERENCES estimates(id);
  END IF;
  
  -- estimate_idがTEXT型の場合、UUID型に変更（既存データがある場合は注意）
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='reservations' 
    AND column_name='estimate_id' 
    AND data_type='text'
  ) THEN
    -- 既存のestimate_idがTEXT型の場合、UUID型に変換
    -- 注意: 既存データがある場合は、この変換は手動で行う必要があります
    -- ALTER TABLE reservations ALTER COLUMN estimate_id TYPE UUID USING estimate_id::UUID;
    -- 上記のコメントを外して実行してください（既存データがある場合）
  END IF;
END $$;

-- ステータスの制約を追加（既に存在する場合はスキップ）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name='check_status' 
    AND table_name='estimates'
  ) THEN
    ALTER TABLE estimates 
    ADD CONSTRAINT check_status 
    CHECK (status IN ('仮見積', '予約済', '現地調査完了', '本見積提出', '成約', '失注'));
  END IF;
END $$;

-- インデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_estimate_id ON reservations(estimate_id);
```

## 2. 環境変数の設定

Vercel Dashboardで以下の環境変数を追加：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_ADMIN_PASSWORD` | （管理者パスワード） | 管理画面のログインパスワード |

**注意**: 本番環境では、より堅牢な認証システム（Supabase Auth等）の使用を推奨します。

## 3. 管理画面のアクセス

- URL: `/admin`
- デフォルトパスワード: 環境変数 `VITE_ADMIN_PASSWORD` で設定

## 4. 機能説明

### ダッシュボード
- ステータス別の件数集計
- リアルタイム更新

### 一覧画面
- 全案件のテーブル表示
- ステータス別フィルタ
- 日付順ソート
- ステータス変更

### 詳細画面
- 顧客情報表示・編集
- 写真表示
- 仮見積内容表示
- PDF見積ダウンロード
- 営業メモ入力
- ステータス変更

## 5. ステータス遷移

```
仮見積 → 予約済 → 現地調査完了 → 本見積提出 → 成約/失注
```

## 6. モバイル対応

- レスポンシブデザイン
- タッチ操作対応
- スマホでも使いやすいUI
