## 開発環境構築

```sh
. generate_env.sh
make upb
```

- フロントエンド
  - VSCode の PORTS で `3000` をポートフォワード
  - lint 実行：`make front-lint`
  - format 実行：`make front-format`
- バックエンド
  - VSCode の PORTS で `8000` をポートフォワード
  - lint 実行：`make back-lint`
  - format 実行：`make back-format`

## 本番環境構築

```sh
. generate_env.sh
make upb-prod
```

- ポート `3030` にアクセス
