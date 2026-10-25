# 各班ルーターのDNS設定

E4 PBL サイバーセキュリティ／2026年10月23日

班LANの配線・固定IP・ルーティングを設定した後に行う。各班の学生が第1～4節を実施し、教員が第5節の共通GWを準備する。各班のDNSゾーンとレコードは実験時に設定し、教員は事前投入しない。使用版はVyOS Stream 2026.02。

## 1. 自班のドメインとホスト名を確認する

DNSは名前からIPアドレスを調べる仕組みである。各班ルーターが、自分の担当範囲（ゾーン）の名前に回答する。担当を示すNSレコードを共通GWへ置くことで、各班DNSへ委任する。名前とIPv4アドレスの対応にはAレコードを使う。

表B-1 各班のドメインとDNSの内外IP

| 班 | ドメイン | DNSの内側IP | DNSの共通側IP |
| --- | --- | --- | --- |
| 1 | `alf.lab` | `192.168.21.1` | `192.168.1.21` |
| 2 | `bra.lab` | `192.168.22.1` | `192.168.1.22` |
| 3 | `cha.lab` | `192.168.23.1` | `192.168.1.23` |
| 4 | `del.lab` | `192.168.24.1` | `192.168.1.24` |

班1の登録内容は次のとおり。班2～4はドメインとLAN番号を表に従って置き換える。

表B-2 班1のDNSレコードと用途

| DNS名 | AレコードのIP | 用途 |
| --- | --- | --- |
| `gw.alf.lab` | `192.168.21.1` | 班ルーターの内側 |
| `ns.alf.lab` | `192.168.1.21` | 同じルーターの共通側DNS |
| `pc1.alf.lab` | `192.168.21.10` | 端末AのWindows |
| `pc2.alf.lab` | `192.168.21.11` | 端末BのWindows |
| `web.alf.lab` | `192.168.21.10` | 端末AのWSL Ubuntu上のWeb |
| `atk.alf.lab` | `192.168.21.11` | 端末BのWSL Kali Linux |

`gw`と`ns`は同じ機器の別インターフェースである。端末の優先DNSには内側IPを指定する。`ns.alf.lab`は共通GWが問い合わせる共通側IPを指す。WSLはミラーモードなので、`web`・`atk`に別のLAN内IPを追加しない。これらは同じIPを指す別々のAレコードとして登録する。

## 2. 班ルーターへゾーンとレコードを設定する

Windows PCから自班のVyOSへSSHで接続し、運用モードで設定を確認する。

```text
show version
show interfaces
show configuration commands | match name-server
show configuration commands | match forwarding
```

内側`192.168.21.1/24`、共通側`192.168.1.21/24`が自班ルーターに設定されていることを確認する。旧上流DNS、他班のゾーン、`0.0.0.0/0`などの広すぎる受付が残っていれば教員と整理する。以下の`set`は既存設定へ追加するため、旧設定を自動では削除しない。

**班1のVyOS・SSH接続：**

```text
configure
set system name-server 192.168.1.1
set service dns forwarding listen-address 192.168.21.1
set service dns forwarding listen-address 192.168.1.21
set service dns forwarding allow-from 192.168.0.0/16
set service dns forwarding name-server 192.168.1.1
set service dns forwarding authoritative-domain alf.lab records ns @ target ns.alf.lab
set service dns forwarding authoritative-domain alf.lab records a ns address 192.168.1.21
set service dns forwarding authoritative-domain alf.lab records a gw address 192.168.21.1
set service dns forwarding authoritative-domain alf.lab records a pc1 address 192.168.21.10
set service dns forwarding authoritative-domain alf.lab records a pc2 address 192.168.21.11
set service dns forwarding authoritative-domain alf.lab records a web address 192.168.21.10
set service dns forwarding authoritative-domain alf.lab records a atk address 192.168.21.11
commit
save
exit
```

`set`は変更の準備、`commit`は変更を検証して現在の動作へ反映する操作、`save`は再起動後にも設定を残すための保存である。`commit`に失敗したら先へ進まない。表示例と設定操作の説明は[第6章](../handbook/06-router1.md)を参照する。

班2は`alf`を`bra`、`192.168.21.*`を`192.168.22.*`、`192.168.1.21`を`192.168.1.22`へ置き換える。班3・4も対応表に従う。共通GWの`192.168.1.1`は変えない。エラーが出たらその行で止め、設定画面を教員へ示す。

`system name-server`はルーター自身の問い合わせ先である。`service dns forwarding`は端末などの問い合わせを受けるサービスで、`@`はゾーンの頂点（ここでは`alf.lab`）を表す。自班名には自班DNSが回答し、それ以外は共通GWへ転送する。自班の未登録名にはNXDOMAINと回答し、共通GWへ戻して循環させない。

DNSの受付は`192.168.0.0/16`にまとめる。自班LAN、他班LAN、共通LANからの問い合わせを許可する設定で、各班ともこの値は置き換えない。実験LAN以外の`192.168.x.x`も受付範囲に含まれる。既存の狭い`allow-from`は残っていても問題ない。

`allow-from`は問い合わせ元のIPで判定する。例えば`192.168.29.10`から`192.168.1.21`へ直接問い合わせても、送信元は`192.168.29.10`のままである。`192.168.1.0/24`の許可だけでは29番LANは対象にならない。VyOSに受信フィルターがある場合は、教員と次の通信のUDP/TCP 53を許可する。`allow-from`だけでは待受アドレスやファイアウォールの設定は変わらない。

表B-3 班DNSが受け付ける送信元・宛先・ポート

| 送信元 | 宛先 | ポート |
| --- | --- | --- |
| 自班LAN `192.168.21.0/24` | 内側 `192.168.21.1` | UDP/TCP 53 |
| 実験用ネットワーク `192.168.0.0/16` | 共通側 `192.168.1.21` | UDP/TCP 53 |

## 3. 自班・共通GW経由・他班の順に確認する

班1のWindows端末で、優先DNSを`192.168.21.1`、代替DNSを空欄にする。班2～4は自班の内側IPを使う。

`ipconfig /all`はWindowsのIP・DNS設定を表示する。実験用の有線アダプターの「DNSサーバー」が自班ルーターの内側IP（班1は`192.168.21.1`）であり、IP・マスク・ゲートウェイも自班の設定表と一致することを確認する。表示例と読み方は[第7章](../handbook/07-cabling.md)を参照する。

**班1の端末・PowerShell：**

```powershell
ipconfig /all
nslookup gw.alf.lab 192.168.21.1
nslookup ns.alf.lab 192.168.21.1
nslookup pc1.alf.lab 192.168.21.1
nslookup pc2.alf.lab 192.168.21.1
nslookup web.alf.lab 192.168.21.1
nslookup atk.alf.lab 192.168.21.1
nslookup -type=NS alf.lab 192.168.21.1
nslookup missing.alf.lab 192.168.21.1
nslookup web.alf.lab 192.168.1.1
```

各Aレコードは第1節の表、NSは`ns.alf.lab`、`missing.alf.lab`はNXDOMAINを期待する。共通GW経由でも`web.alf.lab`が`192.168.21.10`になることを確認する。DNSサーバー名が「Unknown」と出ても、問い合わせた名前への回答で判断する。

教員が設定完了を確認した相手班を指定する。相手が班2なら次を実行し、相手班からも逆方向に確認する。

```powershell
nslookup web.bra.lab 192.168.21.1
nslookup atk.bra.lab 192.168.21.1
nslookup -type=NS bra.lab 192.168.21.1
```

応答は順に`192.168.22.10`、`192.168.22.11`、`ns.bra.lab`を期待する。キャッシュにない他班名の問い合わせ経路は、自班端末→自班DNS→共通GW→相手班DNSとなる。Wiresharkの表示フィルター`dns`で名前と宛先を記録する。未設定の班はタイムアウトやSERVFAILになり得る。

他班DNSの共通側IPへの直接問い合わせも確認する。次は拡張枠LAN29の端末`192.168.29.10`から、班1のDNSへ問い合わせる例である。

```powershell
nslookup web.alf.lab 192.168.1.21
```

`192.168.21.10`が返ることを確認する。他班DNSへ直接問い合わせる場合も、端末の優先DNSは自班ルーターの内側IPのままにする。Wiresharkで、直接問い合わせと自班DNS・共通GWを経由する問い合わせの宛先を比較する。

WSLの設定後はKali Linuxでも`nslookup web.alf.lab 192.168.21.1`と`getent ahostsv4 web.alf.lab`を実行する。前者は指定DNS、後者はKali Linuxの通常の名前解決の確認である。両方で`.10`を確認してから、`http://web.alf.lab:8000/`へ接続する。DNS登録はWebサービスの起動や受信許可とは別に行う。

## 4. 失敗した場所を切り分け、結果を保存する

表B-4 DNSの症状と確認箇所

| 症状 | 確認する場所 |
| --- | --- |
| 自班DNSへ問い合わせても応答がない | 内側IP、待受、受付、UDP/TCP 53 |
| 自班DNSでは成功、共通GW経由で失敗 | 共通側待受、共通GWからの受付、第5節の転送先 |
| 他班名だけ失敗 | 相手班の設定完了、共通GWの委任・転送、相手の共通側DNS |
| 他班DNSへの直接問い合わせだけ失敗 | 相手DNSの`allow-from 192.168.0.0/16`、共通側待受、UDP/TCP 53、戻り経路 |
| 共通GWで相手の共通側IPのARP応答がない | 相手ルーターの電源、共通LANの配線・リンク、IP。DNSの受付設定より先に確認 |
| `nslookup`は成功、`getent`は失敗 | WSL側の通常の名前解決先とWindows側の優先DNS |
| 正しいIPが返るがWebへ接続できない | 接続先Webサービスの起動、TCP/8000、Windows・Hyper-Vの受信許可 |

変更前の結果が残る場合は、まず自班DNSへの直接問い合わせで登録値を確認する。Windowsの通常の名前解決キャッシュは`Clear-DnsClientCache`で消せる。VyOSのキャッシュを消す必要がある場合は、教員が運用モードで`reset dns forwarding alf.lab`のように対象ドメインを指定する。共通GWは教員が操作する。

班番号、ゾーン、NS・Aレコード、問い合わせ先、結果、失敗時の変更内容を記録する。最後にVyOSの`save`を確認する。設定不明・エラー・期待値との不一致は教員へ、実行したコマンドと回答を示して相談する。認証情報や完全設定は提出物に貼らない。

## 5. 教員が共通GWに委任と転送先を準備する

ここは教員用で、学生は共通GWを編集しない。共通GW/DNSは`192.168.1.1`。各班への戻り経路、DNSの共通側待受、自班DNSから共通GWへの問い合わせ受付、UDP/TCP 53の受信・応答を既存設定と照合する。上流DNS・管理経路・ファイアウォールを一括で置き換えない。

```text
show ip route
show configuration commands | match forwarding
show configuration commands | match firewall
```

`lab`側にNSレコードと、そのNSのIPを示すグルーレコードを準備する。VyOS内蔵PowerDNS RecursorのプライベートIPへの問い合わせ制限に対応するため、ドメイン別の明示的な転送も併記する。これはNSの紹介だけをたどる構成とは異なる。既存の各行を確認し、不足分を教員が追加する。

```text
configure
set service dns forwarding authoritative-domain lab records ns alf target ns.alf.lab
set service dns forwarding authoritative-domain lab records a ns.alf address 192.168.1.21
set service dns forwarding domain alf.lab name-server 192.168.1.21
set service dns forwarding authoritative-domain lab records ns bra target ns.bra.lab
set service dns forwarding authoritative-domain lab records a ns.bra address 192.168.1.22
set service dns forwarding domain bra.lab name-server 192.168.1.22
set service dns forwarding authoritative-domain lab records ns cha target ns.cha.lab
set service dns forwarding authoritative-domain lab records a ns.cha address 192.168.1.23
set service dns forwarding domain cha.lab name-server 192.168.1.23
set service dns forwarding authoritative-domain lab records ns del target ns.del.lab
set service dns forwarding authoritative-domain lab records a ns.del address 192.168.1.24
set service dns forwarding domain del.lab name-server 192.168.1.24
commit
save
exit
```

E4は4班分を使う。共通設備の拡張枠LAN25～29（`ech.lab`・`fox.lab`・`gol.lab`・`hot.lab`・`ind.lab`）は既存の教員管理設定を維持する。共通GWに各班の`web`・`atk`を直接登録すると、班DNSの設定不備を隠すため、各班のホストレコードは班ルーターへ置く。

共通ネットの名前は`zul.lab`とする設計である。以下は反映済みの記録ではない。教員が既存の共通名との関係と機器の稼働を確認してから適用する。

```text
configure
set service dns forwarding authoritative-domain lab records ns zul target ns.zul.lab
set service dns forwarding authoritative-domain lab records a ns.zul address 192.168.1.1
set service dns forwarding authoritative-domain zul.lab records ns @ target ns.zul.lab
set service dns forwarding authoritative-domain zul.lab records a ns address 192.168.1.1
set service dns forwarding authoritative-domain zul.lab records a gw address 192.168.1.1
set service dns forwarding authoritative-domain zul.lab records a web address 192.168.1.80
commit
save
exit
```

共通GWから各班DNSの共通側IPへ直接問い合わせ、UDP・TCPで応答を確認する。`dig`が利用できる確認用シェルの例を示す。班2～4もIPとドメインを置き換えて確認する。

```bash
dig @192.168.1.21 web.alf.lab +norecurse
dig @192.168.1.21 web.alf.lab +norecurse +tcp
dig @192.168.1.21 missing.alf.lab +norecurse
```

確認用シェルの送信元が`192.168.0.0/16`内なら、他班端末からも直接確認できる。この範囲外の管理端末から調べる場合は、共通GW上で確認するか、教員が必要な確認元だけを明示的に許可して終了後に戻す。共通GW経由の確認は第3節の端末から行う。共通名を適用した場合は`nslookup web.zul.lab 192.168.21.1`で`192.168.1.80`も確認する。

設定構文の参照：[VyOS 1.5 DNS Forwarding公式資料](https://docs.vyos.io/en/1.5/configuration/service/dns.html)。本教材のStream 2026.02実機での構文・動作確認は授業前に行う。
