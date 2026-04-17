# test-code

シンプルな Todo アプリ。HTML / CSS / JavaScript のみで動作し、データは `localStorage` に保存されます。

## 機能

- タスクの追加 / 削除
- 完了 / 未完了の切り替え
- フィルタ（すべて / 未完了 / 完了）
- 完了済みタスクの一括削除
- 残りタスク数の表示
- `localStorage` による永続化

## 使い方

`index.html` をブラウザで開くだけで利用できます。

```sh
# 例: Python で簡易サーバを起動
python3 -m http.server 8000
# その後 http://localhost:8000 にアクセス
```

## ファイル構成

- `index.html` — マークアップ
- `styles.css` — スタイル
- `app.js` — ロジック
