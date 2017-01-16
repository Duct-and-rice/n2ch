# n2ch
About
---
n2chは2ch互換機能を実装しつつ、P2Pっぽいやり方でデータの分散を図る2chServerです。

Install
---
今のところnpmに上げる予定はないので、これをcloneして下さい。

`npm install`後、`config/default.json`を編集するとかします。

`sync`以下に、共有したい(一方的にこちらが読み取ってパクりたい)サーバーのホストをぶち込みます(多分最後の`/`がないと動かない)。

そして`npm run start`で開始します。
