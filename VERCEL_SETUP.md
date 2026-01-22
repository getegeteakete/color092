# Vercel デプロイ設定ガイド

## 1. Vercelにプロジェクトを接続

### 方法1: Vercel CLIを使用
```bash
# Vercel CLIをインストール（初回のみ）
npm i -g vercel

# プロジェクトにログイン
vercel login

# プロジェクトをデプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

### 方法2: Vercel Dashboardを使用
1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 「Add New...」→「Project」をクリック
3. GitHub/GitLab/Bitbucketからリポジトリをインポート
4. プロジェクト設定を確認して「Deploy」をクリック

## 2. 環境変数の設定

Vercel Dashboardで環境変数を設定します：

### 手順
1. Vercel Dashboardでプロジェクトを選択
2. 「Settings」タブをクリック
3. 「Environment Variables」を選択
4. 以下の環境変数を追加：

### 必須の環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://dvndekddoomokbvdwisa.supabase.co` | SupabaseプロジェクトURL |
| `VITE_SUPABASE_ANON_KEY` | （取得したanon key） | Supabaseの匿名キー |

### オプションの環境変数（Zoom API使用時）

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_ZOOM_API_KEY` | （Zoom API Key） | Zoom APIキー |
| `VITE_ZOOM_API_SECRET` | （Zoom API Secret） | Zoom APIシークレット |
| `VITE_ZOOM_ACCOUNT_ID` | （Zoom Account ID） | ZoomアカウントID |

### 環境変数の適用範囲
- **Production**: 本番環境
- **Preview**: プレビュー環境（PRなど）
- **Development**: 開発環境

すべての環境に適用することを推奨します。

## 3. ビルド設定の確認

Vercelは自動的にViteプロジェクトを検出しますが、以下の設定を確認してください：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

`vercel.json`ファイルで設定済みです。

## 4. デプロイ後の確認

デプロイが完了したら、以下を確認してください：

1. **サイトが正常に表示されるか**
   - トップページが表示される
   - ロゴが正しく表示される

2. **環境変数が正しく設定されているか**
   - ブラウザのコンソールでエラーがないか確認
   - `/estimate`ページで見積もり機能が動作するか確認

3. **Supabase接続の確認**
   - 見積もりを保存して、Supabaseにデータが保存されるか確認
   - `/reservation`ページで予約が保存されるか確認

## 5. カスタムドメインの設定（オプション）

1. Vercel Dashboardでプロジェクトを選択
2. 「Settings」→「Domains」を選択
3. ドメイン名を入力して「Add」をクリック
4. DNS設定を確認

## 6. トラブルシューティング

### ビルドエラーが発生する場合
- Node.jsのバージョンを確認（推奨: 18.x以上）
- `package.json`の依存関係を確認
- ビルドログを確認

### 環境変数が反映されない場合
- 環境変数の設定後、再デプロイが必要
- 変数名が正しいか確認（`VITE_`プレフィックス必須）
- 値に余分なスペースや改行がないか確認

### ルーティングが正しく動作しない場合
- `vercel.json`の`rewrites`設定を確認
- SPA（Single Page Application）として設定されているか確認

## 7. 継続的デプロイ（CI/CD）

GitHub/GitLab/Bitbucketと連携している場合：
- **main/masterブランチ**: 自動的に本番環境にデプロイ
- **その他のブランチ**: プレビュー環境としてデプロイ

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
