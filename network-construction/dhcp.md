# 任意：班LANでDHCPを使う

[第9章](../handbook/09-router2.md)まで完了した班向けの追加設定。DHCPは、接続した端末にIPアドレス・サブネットマスク・デフォルトゲートウェイ・DNSサーバーを自動配布する。各班のThinkPadルーターで、自班LANだけに提供する。

PC1の`.10`とPC2の`.11`は固定IPのまま使える。DHCP用の範囲は`.100`～`.199`とし、固定IPと重ならないようにする。この範囲を手動設定の端末へ割り当てない。DNSの`pc1`・`web`・`pc2`・`atk`の登録は変更しない。DHCPで取得した端末名が、自動でDNSに登録される設定ではない。

## 1. 自班の配布範囲を確認する

表P-1 各班のDHCP配布設定

| 班 | 班LAN | start（開始） | stop（終了） | GW・DNS | subnet-id |
| --- | --- | --- | --- | --- | --- |
| 1 | 192.168.21.0/24 | 192.168.21.100 | 192.168.21.199 | 192.168.21.1 | 21 |
| 2 | 192.168.22.0/24 | 192.168.22.100 | 192.168.22.199 | 192.168.22.1 | 22 |
| 3 | 192.168.23.0/24 | 192.168.23.100 | 192.168.23.199 | 192.168.23.1 | 23 |
| 4 | 192.168.24.0/24 | 192.168.24.100 | 192.168.24.199 | 192.168.24.1 | 24 |

開始と終了の両端を含む100個を配布できる。サブネットマスクは全班`255.255.255.0`。共通LANの`192.168.1.0/24`には、この設定を追加しない。

教員と確認し、自班LANに別のDHCPサーバーがいない状態で行う。検証端末は班専用スイッチへ接続し、Wi-Fiは切断する。設定操作は固定IPのPC1から、[第8章](../handbook/08-ssh.md)の方法で自班ルーターへSSH接続して行う。

**VyOS・操作モード（`$`）：** 既存のDHCP設定を確認する。

```text
show configuration commands | match dhcp-server
```

未設定なら該当行は出ない。既存の設定が出たら、追加前に教員へ確認する。同じサブネットの二重登録や`subnet-id`の重複を避け、既存設定を上書きしない。

## 2. 自班ルーターへ設定する

例は班1。班2～4は、表P-1に従い`192.168.21`を自班の先頭3組へ、`subnet-id 21`を自班の値へ読み替える。設定名`PBL`はそのまま使う。

**VyOS：** `configure`で設定モードへ入り、配布するLAN・GW・DNS・IP範囲を指定する。

```text
configure
set service dhcp-server shared-network-name PBL subnet 192.168.21.0/24 subnet-id 21
set service dhcp-server shared-network-name PBL subnet 192.168.21.0/24 option default-router 192.168.21.1
set service dhcp-server shared-network-name PBL subnet 192.168.21.0/24 option name-server 192.168.21.1
set service dhcp-server shared-network-name PBL subnet 192.168.21.0/24 range 0 start 192.168.21.100
set service dhcp-server shared-network-name PBL subnet 192.168.21.0/24 range 0 stop 192.168.21.199
commit
save
exit
```

`subnet-id`はDHCPのサブネット識別番号。`range 0`は配布範囲の番号で、`start`が開始、`stop`が終了を表す。`commit`で設定を反映し、`save`で再起動後にも残す。エラーが出たら次へ進まず、該当行を修正してから`commit`と`save`を行う。

## 3. Windowsで自動取得を確認する

追加のWindows端末があれば検証用に使う。PC2を一時的に使う場合は、現在の固定IP・マスク・GW・DNSを記録してから変更し、第5節で戻す。PC1は固定IPを維持し、SSH接続に使う。

1. 検証端末で「スタート」→「設定」→「ネットワークとインターネット」→「イーサネット」を開く。
2. 「IP割り当て」の「編集」で「自動（DHCP）」を選び、保存する。
3. 「DNSサーバーの割り当て」の「編集」でも「自動（DHCP）」を選び、保存する。
4. PowerShellで、班専用スイッチにつないだイーサネットの設定を確認する。

**Windows・PowerShell：**

```powershell
ipconfig /all
```

表P-2 Windowsで確認するDHCP取得結果（班1の例）

| 項目 | 成功の目印 |
| --- | --- |
| DHCP有効 | はい（Yes） |
| IPv4アドレス | 192.168.21.100～192.168.21.199のどれか |
| サブネットマスク | 255.255.255.0 |
| デフォルトゲートウェイ | 192.168.21.1 |
| DHCPサーバー | 192.168.21.1 |
| DNSサーバー | 192.168.21.1 |

`.100`から順に取得するとは限らない。実際に取得したIPv4アドレスと、同じアダプターの物理アドレス（MACアドレス）を記録する。

## 4. リースと通信を確認する

PC1のSSH接続から、ルーターが貸し出したIP（リース）を確認する。

**VyOS・操作モード（`$`）：**

```text
show dhcp server leases
```

検証端末のIPとMACアドレスが同じ行にあり、状態が`active`になっていることを確かめる。MACアドレスの区切りがWindowsでは`-`、VyOSでは`:`でも、各組の値が同じなら同じ端末を表す。

**検証端末・PowerShell（班1の例）：**

```powershell
ping 192.168.21.1
nslookup web.alf.lab
```

pingの応答があり、`nslookup`の問い合わせ先が自班ルーターで、`web.alf.lab`の結果が固定IPの`192.168.21.10`なら成功。班2～4は表P-1と[第2章のドメイン](../handbook/02-network.md#自班のipを記録する)に読み替える。

取得できない場合は、結果に応じて次を確認する。

- `169.254`で始まるIP：DHCPから取得できていない。自班スイッチへの配線と、ルーターの`commit`時のエラーを確認する。修正後にイーサネットのLANケーブルを一度挿し直して再取得する。
- 他班や共通LANのIP：接続先スイッチ、または別のDHCPサーバーの混在を教員と確認する。
- IPは範囲内だが名前解決できない：DNSの自動取得と、第9章のDNS設定を確認する。

## 5. 固定IPへ戻す・追加設定を取り除く

PC2で試した場合は、第3節のWindows設定画面でIPとDNSの割り当てを「手動」へ戻し、[第7章](../handbook/07-cabling.md)と記録した値に従って保存する。班1ならIPは`192.168.21.11`、マスクは`255.255.255.0`、GWとDNSは`192.168.21.1`。`ipconfig /all`で固定IPへ戻ったことを確認してから実験へ進む。DNSの`pc2`・`atk`が指す`.11`と実際のPC2のIPを一致させるためである。

DHCPを使い続ける場合は、ルーターの設定を残してよい。追加設定を取り除く場合だけ、次を実行する。この手順で作った`PBL`だけを削除する。

**VyOS：**

```text
configure
delete service dhcp-server shared-network-name PBL
commit
save
exit
```

削除しても、取得済みの端末のIPが直ちに消えるわけではない。DHCPで使っていた端末も必要な固定IPへ戻すか、LANから外す。

## 完了の確認

班番号、配布範囲、検証端末の取得IP・MAC・GW・DNS、VyOSのリース、疎通と名前解決の結果を記録する。PC2を使った場合は固定IPへ戻したこと、DHCP設定を残したか削除したかも記録する。

参照：[VyOS DHCP Server（設定とリース確認）](https://docs.vyos.io/en/1.5/configuration/service/dhcp-server.html)、[Microsoft：Windowsのネットワーク設定](https://support.microsoft.com/ja-jp/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows)、[Microsoft：ipconfig](https://learn.microsoft.com/ja-jp/windows-server/administration/windows-commands/ipconfig)。
