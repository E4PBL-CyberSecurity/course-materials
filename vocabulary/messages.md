# 表示メッセージを単語に分けて読む

[英単語一覧](words.md)で一般的な意味を確かめてから、短い表示を読んでみましょう。ここに載せるのは、現行手順書が紹介している表示や画面上の項目名です。新しく実機で採取した表示ではありません。版や実行条件によって文言が変わることがあります。

表全体の訳を先に覚えるより、知っている語を探し、「何について」「どうなったか」を日本語で言ってみます。英文が分からない場合は、分からない語を囲んで一覧へ戻ってください。

## ディスクと接続状態の表示を読む

表H-1 ディスク一覧と接続状態の表示

| 表示 | 単語から読む意味 | 実習で確かめること |
| --- | --- | --- |
| `NAME`・`SIZE`・`TYPE` | 名前・大きさ・種類 | 装置名、容量、ディスク全体か区画かを見る |
| `MOUNTPOINTS` | mount＝取り付ける、points＝場所 | 装置が利用されている場所を見る |
| `disk`・`part` | ディスク・一部分 | partはディスク内の区画。名前の順だけで対象を決めない |
| `State/Link`・`UP`・`DOWN` | 状態／つながり・上／下 | 管理状態と物理接続の状態を分けて見る |

出典：[第5章](../handbook/05-install.md)、[第6章](../handbook/06-router1.md)。UPの一般的な意味は「上へ」ですが、この表示では有効・接続中などの意味になります。

## 設定や認証についての表示を読む

表H-2 設定変更と認証の表示

| 表示 | 単語から読む意味 | 実習で確かめること |
| --- | --- | --- |
| `already exists` | already＝すでに、exists＝存在する | 同じ設定が存在するという表示。構文エラーと区別する |
| `No configuration changes to commit` | no＝ない、configuration＝構成・設定、changes＝変更、commit＝確定する | 確定する設定変更がない。保存や再起動後の確認まで完了した意味ではない |
| `Permission denied` | permission＝許可、denied＝拒否された | 認証方式・利用者・鍵などを確認する。原因を一つに決め付けない |
| `REMOTE HOST IDENTIFICATION HAS CHANGED` | remote＝遠くの、host＝接続先、identification＝識別、has changed＝変わった | 接続先の識別情報が変わった。本体の指紋と交換履歴を確認する |

出典：[第6章](../handbook/06-router1.md)、[第8章](../handbook/08-ssh.md)。単語が読めても、警告を無視して進める根拠にはなりません。

## 質問と入力待ちの表示を読む

表H-3 SSHの質問と入力待ち

| 表示 | 単語から読む意味 | 実習で確かめること |
| --- | --- | --- |
| `Are you sure you want to continue connecting ...?` | are you sure＝確かですか、want to＝～したい、continue connecting＝接続を続ける | 「接続を続けてよいと確信していますか」。指紋を照合してから答える |
| `Enter passphrase ...:` | enter＝入れる、passphrase＝合言葉 | 鍵のパスフレーズの入力待ち。文字が表示されないことがある |
| `password:` | password＝認証に使う合言葉 | ログイン用パスワードの入力待ち。鍵のパスフレーズと区別する |
| `Unknown` | 知られていない、不明 | DNSの問い合わせ先の名前が不明でも、回答の有無を別に確かめる |

出典：[SSH別冊](../network-construction/vscode-vyos-ssh.md)、[第9章](../handbook/09-router2.md)。`...`は省略を表し、入力する文字ではありません。

## 形が変わった語を元に戻す

`exists`の末尾のsは、主語に合わせた形です。`changes`では変更が複数あることを表します。同じsでも働きが違います。

`denied`は`deny`、`changed`は`change`、`connecting`は`connect`に戻して調べます。`has changed`ではhasとchangedを組み合わせて「変わった」と読みます。英文全体を読むときには、単語の意味に加え、このような組み合わせも確かめます。

## 追加の表示と画面項目を読む

表H-6 接続・上書きの表示

| 表示 | 単語から読む意味 | 出典と実習での注意 |
| --- | --- | --- |
| `Select card`・`Quick format` | カードを選ぶ・短時間の初期化 | 第4章。対象のドライブを照合してから操作する |
| `Overwrite (y/n)?` | 上書きしますか | SSH別冊。同名の鍵がある場合はnで中止する |
| `Connection refused` | 接続が拒否された | SSH別冊。接続先IP、SSHの有効化、待受を確認する |
| `Could not open a connection` `to your authentication agent` | 自分の認証代理への接続を開けなかった | SSH別冊。ssh-agentの起動状態を確認する |
| `TcpTestSucceeded : True`・`False` | 接続確認が成功した：真・偽 | 第7章とSSH別冊。Trueはログイン成功まで保証しない |
| `Running` | 動いている | SSH別冊。runの形が変わったもの。サービスの状態を示す |

出典：[第4章](../handbook/04-media.md)、[第7章](../handbook/07-cabling.md)、[SSH別冊](../network-construction/vscode-vyos-ssh.md)。

## 初めて見る警告に備える補助語

次の短文は教員が作った練習用の例です。selectとoverwrite自体は上表の手順書中の表示にも現れます。特定の機器がこの文を表示すると確認したものではありません。実機の表示語をすべて集め終えた一覧でもありません。

表H-8 警告や選択を読むための補助語

| 語 | 一般的な意味 | 練習用の短文と意味 |
| --- | --- | --- |
| `warning` | 警告 | Warning：警告 |
| `select` | 選ぶ | Select a disk：ディスクを一つ選ぶ |
| `confirm` | 確かめる | Confirm the name：その名前を確かめる |
| `erase` | 消す | Erase all data：すべてのデータを消す |
| `overwrite` | 上から書く、上書きする | Overwrite the file：そのファイルを上書きする |
| `delete` | 削除する | Delete the file：そのファイルを削除する |
| `cancel` | 取り消す | Cancel：取り消す |
| `data` | 資料、情報、データ | all data：すべてのデータ |

表H-9 練習用の短文をつなぐ語

| 語 | 一般的な意味 | 練習用の短文と意味 |
| --- | --- | --- |
| `a` | 一つの、ある | a disk：一つのディスク |
| `the` | 話題にしているその | the file：そのファイル |
| `not` | ～ない | not saved：保存されていない |
| `will` | これから～する、～になることを表す | will erase：消すことになる |

読めない確認には、意味を確かめてから答えます。分からない表示は、その画面と分からない語を教員へ示してください。意味を確かめるために、実際の削除や上書きを実行する必要はありません。

[英単語一覧](words.md)／[略語の補助一覧](abbreviations.md)／[事前学習](preparation.md)
