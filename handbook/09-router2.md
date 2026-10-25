# 9. ルーターの設定2：経路・DNS

SSHで自班ルーターを操作できる状態から、外部への経路、DNS転送、自班の名前を順に設定する。例は班1。`set`で変更を準備し、`commit`で動作中の設定へ反映、`save`で再起動後にも使う設定として保存する。詳しい意味とVyOSのping出力例は[第6章](06-router1.md)、Windowsのping出力例は[第7章](07-cabling.md)を参照する。

## ルーティングを設定する【VyOS】

```text
configure
set protocols static route 0.0.0.0/0 next-hop 192.168.1.1
commit
save
exit
show ip route
ping 192.168.1.1 count 4
ping 1.1.1.1 count 4
```

`0.0.0.0/0`は、より具体的な経路がない宛先に使う経路。次の中継先は共通GW。班ルーターの外側・内側LANは直接接続された経路になる。班ルーターにはNATを設定しない。

## ネームサーバーの設定1：待受と転送先【VyOS】

```text
configure
set system name-server 192.168.1.1
set service dns forwarding listen-address 192.168.21.1
set service dns forwarding listen-address 192.168.1.21
set service dns forwarding allow-from 192.168.0.0/16
set service dns forwarding name-server 192.168.1.1
commit
save
exit
```

`system name-server`はルーター自身の問い合わせ先。`dns forwarding`はPCからの問い合わせを受けるDNSサービス。待受IPは内側・共通側の2個で、標準ポートはUDP/TCP 53。待受IP、問い合わせ元の許可範囲、転送先は別々の設定である。

`allow-from 192.168.0.0/16`は授業の他班LANも受け付ける値で、班番号で置き換えない。受信フィルターがある場合は、教員がこの範囲から待受IPへのUDP/TCP 53を許可する。

## IPの疎通と経路を確認する【Windows】

```powershell
ping -n 4 192.168.21.1
ping -n 4 192.168.1.1
ping -n 4 1.1.1.1
tracert -d 1.1.1.1
ping -n 4 example.com
tracert example.com
```

最初は自班ルーターの内側NIC、次は実験室の共通GWのLAN側NIC、次は外部IP。`tracert`の最初の中継は自班ルーターを期待する。中継機器によっては応答せず`*`になるため、すべての行が埋まることを成功条件にしない。

`ping example.com`で名前がIPへ変われば名前解決は成功している。ICMPに応答しないサイトでは、その後のタイムアウトだけでDNS失敗と判断しない。

## ドメイン名解決を確認する【Windows】

```powershell
nslookup google.com 192.168.21.1
nslookup example.com 192.168.21.1
```

名前に対応するIPが返ることを確認する。公開サイトのIPは変わるため数値を固定の正解にしない。問い合わせ先の名前が`Unknown`でも回答が得られていれば、逆引き名の有無と分けて判断する。

表9-1 疎通・名前解決に失敗した段階と確認箇所

| 止まった段階 | 次に確認する場所 |
| --- | --- |
| 自班ルーターへ届かない | WindowsのIP・マスク、内側配線、NICリンク |
| 同じIPの機器を交換した直後だけ届かない | IP重複とMACを確認。旧ARP情報が残る場合は教員と確認して更新・再試行 |
| 共通GWへ届かない | 外側IP・共通スイッチ。VyOS自身からのpingとも比較 |
| 共通GWまで成功し外部IPへ届かない | デフォルト経路、共通GWの戻り経路・NAT対象。教員へ依頼 |
| 外部IPへ届くが名前解決できない | WindowsのDNS、UDP/TCP 53、待受、受付、上流DNS |
| DNSの回答はあるがpingはタイムアウト | 相手のICMP制限。HTTPSの接続も別に確認 |

## ネームサーバーの設定2：各班サービス・PCの名前【VyOS】

班1は`alf.lab`の名前を自班で管理する。班2～4は第2章のドメインとIPへ読み替える。

```text
configure
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

Aレコードは名前からIPv4アドレスへの対応、NSレコードはゾーンの担当DNS。`@`はゾーンの頂点を表す。`gw`は内側、`ns`は共通側IP。同じ機器でも用途により名前を分ける。`pc1`と`web`、`pc2`と`atk`はそれぞれ同じIPを示す。

**Windows・PowerShell：**

```powershell
nslookup gw.alf.lab 192.168.21.1
nslookup ns.alf.lab 192.168.21.1
nslookup pc1.alf.lab 192.168.21.1
nslookup pc2.alf.lab 192.168.21.1
nslookup web.alf.lab 192.168.21.1
nslookup atk.alf.lab 192.168.21.1
nslookup -type=NS alf.lab 192.168.21.1
nslookup missing.alf.lab 192.168.21.1
```

順に内側`.1`、共通側`.21`、PC1`.10`、PC2`.11`、Web`.10`、攻撃端末`.11`を期待する。NSは`ns.alf.lab`、未登録の`missing.alf.lab`はNXDOMAIN（名前なし）を期待する。レコードが引けてもサービス起動の証明にはならない。

教員が共通GWの委任・転送を設定したら、`nslookup web.alf.lab 192.168.1.1`でも同じIPを確認する。他班名は相手班の準備完了後に試す。詳しい共通GWの設定・他班への問い合わせは[DNS別冊](../network-construction/dns.md)を参照する。

## 完了の確認

IPでの段階的な疎通、外部名、各班の6個のAレコード、NS、未登録名の結果を記録する。

任意で[班LANのDHCPサービス](../network-construction/dhcp.md)を追加できる。自班ルーターから`.100`～`.199`のIPと、自班のGW・DNSを自動配布する。PC1・PC2の固定IPを維持したまま併用する。
