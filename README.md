# HardOff めぐり - 海外店舗チェックインアプリ

GPS位置情報を使用して、世界中のハードオフ海外店舗を訪問・チェックインできるウェブアプリケーションです。

![HardOff めぐり](https://img.shields.io/badge/stores-23-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 主な機能

- **GPS チェックイン**: 店舗から500m以内でGPS位置情報を使ってチェックイン
- **23店舗対応**: アメリカ（ハワイ、カリフォルニア）、タイ、台湾、カンボジアの海外店舗
- **写真とコメント**: チェックイン時に写真とコメントを投稿して思い出を記録
- **訪問履歴**: マイページで過去のチェックイン履歴を確認
- **バッジシステム**: 訪問店舗数に応じてバッジを獲得
  - ビギナー（1-4店舗）
  - アドベンチャー（5-9店舗）
  - エキスパート（10-14店舗）
  - マスター（15-22店舗）
  - コンプリート（23店舗）
- **最寄り店舗検索**: GPS位置情報から最寄りの店舗を自動表示
- **レスポンシブデザイン**: モバイル・デスクトップ両対応

## 🛠️ 技術スタック

### フロントエンド
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - スタイリング
- **tRPC** - 型安全なAPI通信
- **Wouter** - ルーティング
- **shadcn/ui** - UIコンポーネント

### バックエンド
- **Node.js** - ランタイム
- **Express** - Webフレームワーク
- **tRPC 11** - API層
- **Drizzle ORM** - データベースORM
- **MySQL/TiDB** - データベース

### インフラ
- **S3** - 画像ストレージ
- **Manus OAuth** - 認証
- **Vitest** - テストフレームワーク

## 📦 セットアップ

### 前提条件
- Node.js 22.x
- pnpm
- MySQL/TiDB データベース

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/tomorrow56/hardoff-checkin.git
cd hardoff-checkin
```

2. 依存関係をインストール
```bash
pnpm install
```

3. 環境変数を設定
```bash
# .env ファイルを作成し、以下の変数を設定
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
# その他の環境変数...
```

4. データベースのマイグレーション
```bash
pnpm db:push
```

5. 店舗データをシード
```bash
pnpm exec tsx seed-stores.mjs
```

6. 開発サーバーを起動
```bash
pnpm dev
```

アプリケーションは http://localhost:3000 で起動します。

## 🧪 テスト

```bash
pnpm test
```

## 📁 プロジェクト構造

```
hardoff_checkin/
├── client/                 # フロントエンド
│   ├── src/
│   │   ├── pages/         # ページコンポーネント
│   │   ├── components/    # 再利用可能なコンポーネント
│   │   ├── lib/          # ユーティリティ
│   │   └── App.tsx       # ルーティング設定
├── server/                # バックエンド
│   ├── routers.ts        # tRPC ルーター
│   ├── db.ts             # データベースヘルパー
│   └── *.test.ts         # テストファイル
├── drizzle/              # データベーススキーマ
│   └── schema.ts
└── seed-stores.mjs       # 店舗データシード
```

## 🗺️ 対応店舗

### アメリカ（5店舗）
- ハワイ州: ECO TOWN HAWAII（2店舗）
- カリフォルニア州: ECO TOWN USA、ECO TEK（3店舗）

### タイ（4店舗）
- HARD OFF（バンコク、サムットプラーカーン、チョンブリー）

### 台湾（7店舗）
- HARDOFF TAIWAN（台南、桃園、屏東、南投）

### カンボジア（7店舗）
- MOTTAINAI WORLD ECO TOWN（プノンペン、カンダール）

## 🔒 セキュリティ

- GPS位置情報は店舗から500m以内でのみチェックイン可能
- 写真は自動的にS3にアップロードされ、安全に保存
- ユーザー認証はManus OAuthを使用

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 お問い合わせ

質問や提案がある場合は、GitHubのissueを作成してください。

---

Made with ❤️ for HardOff enthusiasts worldwide
