# Cat Map SNS

Map上で「どこに猫がいるか」を共有できるSNSアプリです。

ハッカソン（2日間）でのプロトタイプ開発を目的としています。

## Features
- Map上に猫のいる場所をピン表示
- ピンをクリックすると写真とコメントを表示
- 猫を見つけた場所を新規投稿

## Tech Stack
- React
- TypeScript
- Vite

## Setup

```bash
git clone https://github.com/sakika774/cat-map-sns.git
cd cat-map-sns
npm install
npm run dev
```

## Requirements
- Node.js 18以上
- npm

## Notes
- Supabase を使用しています。
- APIキー（Supabase URL / ANON KEY）は環境変数として管理し、
- リポジトリには含めていません。
