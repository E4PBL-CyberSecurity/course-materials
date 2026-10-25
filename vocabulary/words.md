# 実習で読む英単語一覧

コマンドや表示を見たときに、英単語の一般的な意味を日本語で答えるための一覧です。カタカナで読めることと、意味が分かることを分けて確かめます。

最初は第1〜6組の60語を、1組ずつ学びます。後半の追加語と略語は、実習中に調べるときに使います。[事前学習](preparation.md)を進め、学習後に[確認課題](assignment.md)へ取り組んでください。

「一般的な意味」は日常の意味の例で、すべての語義を載せたものではありません。右欄では実習での使われ方を示します。一般的な意味を問われたら、右欄の操作名だけで答えず、中央欄を手がかりに答えます。

複数形や形の変化は同じ行にまとめました。existsはexist、deniedはdeny、changedはchangeに戻して考えます。大文字のNAMEと小文字のnameも同じ語です。複合語は、keyboard-layoutならkeyboardとlayoutに分けて調べます。コマンドを入力するときは、元の綴りやハイフンを変えません。

## 先に学ぶ60語

### 第1組 操作を始める・終える

表F-1 第1組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `show` | 見せる、示す | `show version`：版を表示する［5］ |
| `set` | 置く、定める | `set system`：設定を定める［6］ |
| `save` | 保存する、取っておく | `save`：設定を保存する［6］ |
| `exit` | 出口、出る | `exit`：今の操作環境から抜ける［8］ |
| `install` | 取り付ける、導入する | `install image`：OSを導入する［5］ |
| `update` | 新しくする、更新する | `apt update`：ソフトの取得情報を更新する［11］ |
| `run / running` | 走る、動かす | `run show interfaces`：命令を実行する［6］ |
| `start` | 始める | 処理を開始する（一般例） |
| `stop` | 止める | 処理を止める（一般例） |
| `continue` | 続ける | `continue connecting`：接続を続ける［SSH］ |

### 第2組 一覧の見出しと状態

表F-2 第2組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `name` | 名前 | `NAME`：装置の名前［5］ |
| `size` | 大きさ | `SIZE`：装置の容量［5］ |
| `type` | 種類、型 | `TYPE`：装置の種類［5］ |
| `disk` | 円盤、ディスク | `disk`：ディスク全体を表す表示［5］ |
| `state` | 状態 | `State`：動作・管理の状態［6］ |
| `link` | つながり、結び付ける | `Link`：接続状態［6］ |
| `up` | 上へ、上がって | `UP`：有効・接続中などを表す［6］ |
| `down` | 下へ、下がって | `DOWN`：無効・未接続などを表す［6］ |
| `file` | 書類、ファイル | `--from-file`：ファイルから読み込む［11］ |
| `directory` | 名簿、一覧、ディレクトリー | `Directory`：フォルダーを指定する［8］ |

### 第3組 変更と拒否の表示

表F-3 第3組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `already` | すでに | `already exists`：すでに存在する［6］ |
| `exist / exists` | 存在する | existsはexistの形が変わったもの［6］ |
| `no` | いいえ、ない | `No configuration changes`：設定の変更がない［6］ |
| `change / changes / changed` | 変える、変わる、変更 | `HAS CHANGED`：変わった［8］ |
| `configuration / config` | 構成、配置 | `configuration changes`：設定の変更［6］ |
| `commit` | 約束する、委ねる、確定する | `commit`：設定変更を確定・反映する［6］ |
| `permission` | 許可 | `Permission denied`：許可が拒否された［8］ |
| `deny / denied` | 否定する、拒否する | `denied`：拒否された［8］ |
| `remote` | 遠く離れた | `REMOTE HOST`：接続先の機器［8］ |
| `host` | 主人、主催者、受け入れる側 | `HOST`：ネットワーク上の機器［8］ |

### 第4組 接続確認の文に使う語

表F-4 第4組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `identification` | 識別、身元の確認 | `HOST IDENTIFICATION`：接続先の識別［8］ |
| `have / has` | 持つ（hasはhaveの形） | hasとchangedの組合せで「変わった」［8］ |
| `be / are` | ～である、～にいる | `Are you sure ...?`：確かですか［SSH］ |
| `you` | あなた、あなたたち | `you want`：あなたが望む［SSH］ |
| `sure` | 確かな、確信して | `Are you sure ...?`：確かですか［SSH］ |
| `want` | 欲しい、～したい | `want to continue`：続けたい［SSH］ |
| `to` | ～へ、～すること | `to continue`：続けること［SSH］ |
| `connect / connecting` | つなぐ、つながる | `connecting`：接続すること・接続中［SSH］ |
| `enter` | 入る、入れる | `Enter passphrase`：合言葉を入力する［SSH］ |
| `passphrase` | 合言葉、認証に使う語句 | `Enter passphrase`：鍵の合言葉の入力［SSH］ |

### 第5組 利用者・鍵・設定の基本

表F-5 第5組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `user` | 使う人、利用者 | `user vyos`：利用者を指定する［8］ |
| `password` | 合言葉、認証に使う文字列 | `password`：ログインの合言葉［SSH］ |
| `key` | 鍵、手がかり | `public-keys`：公開鍵［8］ |
| `public` | 公の、公開の | `public-keys`：公開する側の鍵［8］ |
| `address` | 住所、宛先 | `address`：通信先などのアドレス［6］ |
| `server` | 給仕する人、提供する側 | サービスを提供する側［11］ |
| `current` | 現在の | `CurrentUser`：現在の利用者［8］ |
| `default` | 指定しない場合の選択、既定 | `--set-default-version`：既定の版を設定する［11］ |
| `yes` | はい、そのとおり | `yes`：確認に同意する入力［8］ |
| `unknown` | 知られていない、不明の | `Unknown`：名前が不明という表示［9］ |

### 第6組 設定画面や結果の語

表F-6 第6組の10語

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `create` | 作る、生み出す | ファイルなどを新しく作る（一般例） |
| `reset` | 元に戻す、設定し直す | 設定などを元に戻す（一般例） |
| `database` | 情報を整理して蓄えるもの | 情報を整理して蓄える仕組み（一般例） |
| `security` | 安全、保護 | アカウントや通信の保護（一般例） |
| `low` | 低い | 低い値や位置を表す（一般例） |
| `impossible` | 不可能な | 不可能な状態を表す（一般例） |
| `submit` | 提出する、差し出す | 記入内容を提出する（一般例） |
| `upload` | データを相手側へ送る | ファイルを相手側へ送る（一般例） |
| `request` | 要求、依頼 | 通信などの要求（一般例） |
| `fail / failed` | 失敗する、うまくいかない | 操作や確認が失敗した状態（一般例） |

## 必要なときに調べる追加語

以下は一度に覚える範囲ではありません。先の60語にない語を、おおむねアルファベット順に並べました。

### 追加語 add から allow

表F-7 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `add` | 加える | `ssh-add`：鍵を追加する［8］ |
| `agent` | 代理人、代わりに働くもの | `ssh-agent`：鍵を使った認証を補助する［8］ |
| `algorithm` | 計算や処理の手順 | `Algorithm`：ハッシュの計算方式［11］ |
| `all` | すべて | `/all`：設定の詳細を表示する［7］ |
| `allow` | 許す | `allow-from`：問い合わせ元を許可する［9］ |

### 追加語 authentication から child

表F-8 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `authentication` | 本物であることの確認、認証 | `authentication`：本人確認の設定［8］ |
| `authoritative` | 権威のある、正式な | `authoritative-domain`：担当するドメイン［9］ |
| `body` | 体、本体、本文 | `PUBLIC_KEY_BODY`：公開鍵の本体［8］ |
| `child` | 子、配下のもの | `Get-ChildItem`：配下の項目を取得する［10］ |

### 追加語 code から connection

表F-9 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `code` | 符号、規則、プログラム | `code`：VS Codeの起動命令［10］ |
| `command` | 命令 | `Get-Command`：命令の情報を取得する［8］ |
| `configure` | 構成を整える、設定する | `configure`：設定モードに入る［5］ |
| `connection` | つながり、接続 | `Test-NetConnection`：通信接続を確かめる［7］ |

### 追加語 content から description

表F-10 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `content` | 中身、内容 | `Get-Content`：ファイルの内容を取得する［8］ |
| `copy` | 写す、複製 | `Copy-Item`：ファイルなどを複製する［11］ |
| `count` | 数える、数 | `count`：送信回数［6］ |
| `description` | 説明 | `description`：接続口の説明［6］ |

### 追加語 distribution / distributed から exact

表F-11 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `distribution / distributed` | 配布、分配／分配された | `distribution`：Linuxの配布版［11］ |
| `domain` | 領域、範囲 | `domain`：名前を管理する範囲［9］ |
| `ethernet` | 有線LANの通信方式名 | `ethernet`：接続口の種類［6］ |
| `exact` | 正確な、ぴったり一致した | `--exact`：完全に一致する指定［4］ |

### 追加語 fingerprint から from

表F-12 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `fingerprint` | 指紋 | `fingerprints`：鍵を識別する値［6］ |
| `force` | 力、強制する | `Force`：必要な作成などを強制する［8］ |
| `forward / forwarding` | 前へ、転送する／転送 | `forwarding`：DNSの問い合わせを転送する［9］ |
| `from` | ～から | `allow-from`：～からの利用を許可する［9］ |

### 追加語 get から import

表F-13 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `get` | 得る、手に入れる | `Get-Location`：現在地を取得する［10］ |
| `hash` | 細かく刻む／ハッシュ値 | `FileHash`：ファイル内容から計算する値［11］ |
| `help` | 助ける、助け | `--help`：使い方を表示する［11］ |
| `hop` | 跳ぶ、短く移動する | `next-hop`：次の中継先［9］ |
| `identity / identities` | 身元、同一性 | `IdentitiesOnly`：指定した認証用の鍵を使う［8］ |
| `image` | 像、画像、姿 | `image`：導入するOSのデータ［5］ |
| `import` | 輸入する、取り込む | `Import-Module`：機能を取り込む［8］ |

### 追加語 interface / interfaces から keyboard

表F-14 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `interface / interfaces` | 接点、境界 | `interfaces`：通信の接続口［6］ |
| `item` | 項目、ひとつのもの | `New-Item`：項目を作成する［8］ |
| `join` | つなぐ、結び付ける | `Join-Path`：パスをつなぐ［11］ |
| `keyboard` | 鍵盤、キーボード | `keyboard-layout`：キーの配列［5］ |

### 追加語 known から location

表F-15 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `known` | 知られている | `known_hosts`：記録済みの接続先［8］ |
| `language` | 言語、言葉 | `Display Language`：表示言語［10］ |
| `launch` | 打ち上げる、開始する | `no-launch`：導入後すぐには起動しない［11］ |
| `layout` | 配置、配列 | `keyboard-layout`：キーボード配列［5］ |
| `list` | 一覧、一覧にする | `--list`：一覧表示［11］ |
| `listen` | 聴く、耳を傾ける | `listen-address`：待受アドレス［6］ |
| `location` | 場所 | `Get-Location`：作業している場所［10］ |

### 追加語 login から network / networking

表F-16 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `login` | 利用を開始するための認証 | `login`：ログインする利用者の設定［8］ |
| `manual` | 手作業の、説明書 | `StartupType Manual`：手動での起動［8］ |
| `mode` | やり方、方式 | `networking-mode`：ネットワークの動作方式［11］ |
| `module` | 組み合わせて使う部品・単位 | `Install-Module`：追加機能を導入する［8］ |
| `mount` | 取り付ける、載せる | `MOUNTPOINTS`：利用するための取付先［5］ |
| `network / networking` | 網状のつながり | `networking-mode`：通信の動作方式［11］ |

### 追加語 new から part / partition

表F-17 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `new` | 新しい | `New-Item`：新しい項目を作る［8］ |
| `next` | 次の | `next-hop`：次の中継先［9］ |
| `null` | 何もない、無効の | `Out-Null`：出力を捨てる［11］ |
| `only` | ～だけ | `IdentitiesOnly`：指定した鍵だけ［8］ |
| `option` | 選択肢 | `system option`：システムの設定項目［5］ |
| `out` | 外へ | `Out-Null`：出力先を指定する命令の一部［11］ |
| `part / partition` | 一部分／区切り、区分 | `part`：ディスク内の区画［5］ |

### 追加語 path から protocol / protocols

表F-18 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `path` | 道、通り道 | `Path`：ファイルなどの場所［8］ |
| `point / points` | 点、場所 | `MOUNTPOINTS`：取り付ける場所［5］ |
| `port / ports` | 港、出入口 | `port`：通信の受付番号［6］ |
| `prefer / preferred` | より好む／優先された | `PreferredAuthentications`：優先する認証方式［8］ |
| `protocol / protocols` | 取り決め、手順 | `protocols`：通信の規則に関する設定［9］ |

### 追加語 raw から route

表F-19 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `raw` | 生の、加工前の | `Get-Content -Raw`：内容をまとめて読む［8］ |
| `record / records` | 記録、記録する | `records`：DNSの登録情報［9］ |
| `refresh` | 新しくする、元気を回復させる | `Refresh`：表示を更新する［4］ |
| `route` | 道筋、経路 | `ip route`：通信経路［9］ |

### 追加語 scope から source

表F-20 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `scope` | 範囲 | `scope user`：導入の対象範囲［4］ |
| `service` | 奉仕、提供する働き | `service ssh`：SSHのサービス［6］ |
| `shutdown` | 閉鎖、停止 | `--shutdown`：WSL全体を停止する［11］ |
| `source` | 源、出所 | `--source`：ソフトの取得元［4］ |

### 追加語 split から system

表F-21 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `split` | 分ける、割る | `Split`：文字列を分ける［8］ |
| `startup` | 開始、起動 | `StartupType`：起動方法［8］ |
| `static` | 動かない、固定の | `static route`：固定の経路［9］ |
| `syntax` | 語句の並べ方、構文 | `Syntax`：コマンドの書式［8］ |
| `system` | 仕組み、制度、体系 | `system`：システム全体の設定［5］ |

### 追加語 target から verbose

表F-22 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `target` | 的、目標、対象 | `target`：名前の参照先［9］ |
| `test` | 試す、試験 | `Test-NetConnection`：接続を調べる［7］ |
| `trim` | 切りそろえる、余分を取り除く | `Trim`：文字列の両端を整える［8］ |
| `verbose` | 言葉数の多い、詳しい | `--verbose`：詳しく表示する［11］ |

### 追加語 version

表F-23 追加語の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `version` | 版、形の違うもの | `version`：ソフトの版［5］ |

## 表示画面と復旧手順から追加で調べる語

下表も参照用です。ここにあるpruneやunregisterは、手順書が使わないよう注意している操作名です。意味を調べるために実行しません。

### 表示と復旧の語 1

表F-24 表示項目や復旧操作の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `additional` | 追加の | `Install Additional Languages`：追加言語の導入［SSH］ |
| `card` | 札、カード | `Select card`：カードを選ぶ［4］ |
| `could` | ～できた、～できるだろう | `Could not open`：開けなかった［SSH］ |
| `false` | 誤った、正しくない | `False`：接続確認が成功していない［SSH］ |
| `for` | ～のための、～に対する | `passphrase for key`：鍵のための合言葉［SSH］ |
| `live` | 生きている、実演の | `live`：一時起動環境のパスに現れる［5］ |
| `loop` | 輪、繰り返し | `loop0`：イメージを装置として扱う名前［5］ |
| `medium` | 中間の、媒体 | `medium`：起動媒体を指すパスの一部［5］ |

### 表示と復旧の語 2

表F-25 表示項目や復旧操作の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `mirror / mirrored` | 鏡、映す／映された | `mirrored`：ネットワークの動作方式名［11］ |
| `missing` | 欠けている、見つからない | `missing`：未登録名の例に使う語［9］ |
| `not` | ～ない | `Could not open`：開けなかった［SSH］ |
| `open` | 開く、開いている | `Could not open`：開けなかった［SSH］ |
| `overwrite` | 上から書く、上書きする | `Overwrite (y/n)?`：上書きするかという確認［SSH］ |
| `pack` | 包み、ひとまとめ | `Language Pack`：追加言語のひとまとめ［SSH］ |

### 表示と復旧の語 3

表F-26 表示項目や復旧操作の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `quick` | 速い、短時間の | `Quick format`：短時間での初期化［4］ |
| `refuse / refused` | 断る、拒否する | `Connection refused`：接続が拒否された［SSH］ |
| `root` | 根、根本 | `root`：Linuxの管理者の利用者名［11］ |

### 表示と復旧の語 4

表F-27 表示項目や復旧操作の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `select` | 選ぶ | `Select card`：対象のカードを選ぶ［4］ |
| `succeed / succeeded` | 成功する | `TcpTestSucceeded`：TCP接続確認の成否［SSH］ |
| `terminal` | 終点、端末 | `terminal`：文字で操作する画面［SSH］ |
| `true` | 本当の、正しい | `True`：接続確認が成功した表示［7］ |
| `unregister` | 登録を解除する | `--unregister`：WSL環境を削除する操作名［11］ |

### 表示と復旧の語 5

表F-28 表示項目や復旧操作の一般的な意味

| 英単語と表示形 | 一般的な意味 | 実習での使われ方 |
| --- | --- | --- |
| `your` | あなたの、あなたたちの | `your authentication agent`：あなたの認証代理［SSH］ |

[コマンド名と略語の補助一覧](abbreviations.md)も参照できます。

## 出現箇所を確認する

右欄の番号は実験手順の章です。［SSH］はSSH別冊を指します。[表示メッセージの読み方](messages.md)には、単語を組み合わせた訳と出典を載せています。

- ［4］[USBメモリの準備](../handbook/04-media.md)、［5］[VyOSの導入](../handbook/05-install.md)、［6］[NIC・IP・SSH](../handbook/06-router1.md)。
- ［7］[WindowsのIP設定](../handbook/07-cabling.md)、［8］[SSH接続](../handbook/08-ssh.md)、［9］[経路・DNS](../handbook/09-router2.md)。
- ［10］[VS Code](../handbook/10-vscode.md)、［11］[WSL](../handbook/11-wsl.md)。
- ［SSH］[SSH別冊](../network-construction/vscode-vyos-ssh.md)。

分からない語が残ったら、語と出てきた画面を教員へ示してください。パスワードや秘密鍵は提出物へ写しません。
