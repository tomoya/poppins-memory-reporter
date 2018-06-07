# ポピンズメモリーレポーター

## これは何?

ポピンズナーサリースクールの会員マイページ https://ps.poppins.co.jp/nursery/login/index にある連絡ページ「ポピンズメモリー」の情報を取得してSlackに通知を行うツールです。

## 開発要件

以下の条件で開発しています。

- Node v8 以上
- [puppeteer](https://github.com/GoogleChrome/puppeteer) v1.4 以上
- [node-slack-sdk](https://github.com/slackapi/node-slack-sdk) v4.3 以上

## 環境変数について

| 環境変数名 | 説明 | 必要条件 |
| -- | -- | -- |
| USER_ID | ログインID | 必須 |
| PASSWORD | ログインパスワード | 必須 |
| SLACK_WEBHOOK_URL | Slack の Webhook URL | 必須 |
| SLACK_CHANNEL | 通知チャンネル（設定しない場合はデフォルト） | 任意 |
| REPORT_TODAY |デフォルトは前日。定義すると当日を通知する | 任意 |

## ToDo

- [ ] Google Spreadsheed に記録したい
- [ ] 取得する情報を増やしたり、表示／非表示を調整できるようにする
