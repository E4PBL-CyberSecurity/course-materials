# 6. ルーターの設定1：NIC・IP・SSH

第5章でインストールしたVyOSをThinkPad本体の画面で操作する。ここでは、本体とUSBアダプターのLANポートが`eth0`・`eth1`のどちらに対応するかを確認し、IP設定とSSHの有効化を行う。デフォルト経路とDNSは第9章で設定する。

## 本体・USBアダプターのLANポートとeth0・eth1を対応させる

```text
show interfaces
```

1. 有線NICの`eth0`・`eth1`が両方存在することを確認する。片方しかなければUSBアダプターを接続し直し、型番・ドライバーの対応を教員と確認する。
2. LANケーブルをいったん外す。本体NICだけを、電源が入ったスイッチへ接続して`show interfaces`を再実行する。
3. 状態表示の`State/Link`（版によって`S/L`）を確認する。`u/u`は管理状態・リンクともUP、`u/D`はリンクがDOWN。表示の凡例を見て、ケーブル接続でリンクがUPになったNICを記録する。
4. 本体NICを外してUSB NICへ同じケーブルを挿し、もう一方のリンクがUPになることを確認する。MACアドレスと接続口へ札を付ける。
5. 対応が分かったら、本体NICを共通スイッチへ接続し直す。内側NICと班専用スイッチは第7章で接続する。

本書の例は**本体NIC＝eth0＝外側、USB NIC＝eth1＝内側**。逆の場合は以降の`eth0`・`eth1`を実物に合わせて入れ替える。

## IPアドレスを設定して保存する

以下は班1。班2～4は第2章の表のIP・班番号へ読み替える。授業で引き継いだ機器に既存IPがある場合は、追加する前に教員と旧設定を確認する。

`set`を入力しただけでは、動作中のIP設定は変わらない。変更を準備し、`commit`で実際の動作へ反映し、`save`で次の起動にも使えるよう保存する。

表6-1 設定コマンドで行う操作

| 入力 | 行うこと |
| --- | --- |
| `configure` | 設定を変更するモードに入る |
| `set ...` | 指定した値への変更を準備する。まだ実際の動作には反映しない |
| `commit` | 準備した変更を検証し、問題がなければ動作中の設定に反映する。IPやSSHなどがこの時点で変わる |
| `save` | 反映済みの設定をインストール先USBへ保存する。これを省くと再起動で元の設定へ戻る |
| `exit` | 設定モードを終え、状態確認などを行う運用モードへ戻る |

`commit`でエラーが出たら、`save`や次の手順へ進まず教員と確認する。成功時は、エラーを出さず`[edit]`と入力待ちの画面へ戻る場合もある。`commit`の成功は設定を反映できたという意味で、通信できるかどうかは後の表示と`ping`で確認する。

```text
configure
set system host-name PBL-R1
set interfaces ethernet eth0 description COMMON
set interfaces ethernet eth0 address 192.168.1.21/24
set interfaces ethernet eth1 description PBL-LAN1
set interfaces ethernet eth1 address 192.168.21.1/24
commit
save
exit
show interfaces
```

### show interfacesの出力を読む

次は班1でIP設定後、本体NICだけを共通スイッチへ接続した状態の**出力例（入力しない）**。MACアドレスは例、`lo`のIPv6など一部の行は省略している。

```text
Codes: S - State, L - Link, u - Up, D - Down, A - Admin Down
Interface    IP Address       MAC                VRF        MTU  S/L    Description
-----------  ---------------  -----------------  -------  -----  -----  -------------
eth0         192.168.1.21/24  02:00:00:00:01:01  default   1500  u/u    COMMON
eth1         192.168.21.1/24  02:00:00:00:01:02  default   1500  u/D    PBL-LAN1
lo           127.0.0.1/8      00:00:00:00:00:00  default  65536  u/u
```

表6-2 show interfacesで見る欄と判断方法

| 欄 | 意味と確認すること |
| --- | --- |
| Interface | NICの名前。`eth0`・`eth1`が両方ある。`lo`はルーター自身の内部通信用で、LANケーブルの接続口ではない |
| IP Address | 設定したIPとネットワークの範囲。班1なら外側は`192.168.1.21/24`、内側は`192.168.21.1/24`。設定前の`-`はIP未設定を示す |
| S/L | 左がNICの管理状態、右が物理リンク。`u/u`は有効でリンクあり、`u/D`は有効だがリンクなし、`A/D`は設定で無効になっている状態 |
| MAC | NICを識別するアドレス。接続口の記録と照合する。値はNICごとに異なる |
| VRF | 経路を分ける仕組みの所属先。この授業では`default`のまま使う |
| MTU | 1回に送るIPパケットの最大長（バイト）。有線NICでは例のように1500。ここでは変更しない |
| Description | 自分で付けた説明。外側が`COMMON`、内側が`PBL-LAN1`。班番号は自班の値になる |

**この段階では、外側eth0が`u/u`で、自班のIP2個が正しければよい。** 内側eth1はまだケーブルを挿していないので、例の`u/D`でよい。第7章で両側の配線を終えたら、2口とも`u/u`になることを確認する。`u/u`だけでは相手とのIP通信の成功までは分からない。

IPが違う、設定後も`-`のまま、外側が`u/D`なら先へ進まず、入力したIP、`commit`の結果、ケーブルとスイッチの電源を確認する。`A/D`ならケーブルだけでは直らないため、教員とNICの設定を確認する。

`already exists`や`No configuration changes to commit`は同じ値が設定済み・反映する変更がないという意味で、構文エラーや設定検証の失敗とは分けて読む。

本体NICを共通スイッチに接続できたら、運用モードで次を実行する。

```text
ping 192.168.1.1 count 4
```

### pingの出力を読む【VyOS】

`ping`は、指定した相手に応答を求める小さな通信を送り、返事が届くかを調べる。`count 4`は4回送って終了する指定。次は成功時の**出力例（入力しない。時間は例）**。

```text
PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.264 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.255 ms
64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.223 ms
64 bytes from 192.168.1.1: icmp_seq=4 ttl=64 time=0.232 ms

--- 192.168.1.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3107ms
rtt min/avg/max/mdev = 0.223/0.243/0.264/0.016 ms
```

表6-3 VyOSのping出力の読み方

| 表示 | 意味 |
| --- | --- |
| PINGの行 | 調べている宛先。ここでは共通GWの`192.168.1.1`。名前で指定した場合は、名前に続く括弧内にIPが出る |
| 56(84) bytes、64 bytes | 通信の長さ。送信データ56バイト、IPv4・ICMPのヘッダー込みで84バイト。返信の64はICMPの長さ。成功の判定には下の応答元・受信数・損失を見る |
| from 192.168.1.1 | 応答した相手。調べたい宛先からの返事であることを確認する |
| icmp_seq=1～4 | 送った通信の番号。例では4回とも返事が来ている |
| ttl=64 | 受信した返信があと何台のルーターを通過できるかを示す値。実際に通った台数や通信時間ではない。64を固定の正解にしない |
| time=0.264 ms | 1回の通信の往復時間。msはミリ秒で、1msは1000分の1秒。時間の値は毎回変わる |
| 4 packets transmitted、4 received、0% packet loss | 4回送信、4回受信、損失0%。この例では宛先から4回とも応答があり、疎通成功と判断する |
| time 3107ms、rttの行 | 前者は試験全体にかかった時間。rttは往復時間の最小・平均・最大・ばらつき（min・avg・max・mdev）をミリ秒で示す |

失敗時の集計の**出力例（入力しない、抜粋）**：

```text
4 packets transmitted, 0 received, +4 errors, 100% packet loss, time 3103ms
```

これは4回送って返事が0回、すべて失敗したという意味。`Destination Host Unreachable`（宛先へ到達できない）や`100% packet loss`が出たら成功ではない。エラー行の`From ...`はエラーを知らせた機器で、宛先からの正常な返事とは異なる。一部だけ欠けた場合も損失を記録し、配線や設定を確認して再試行する。応答がない原因は相手の停止だけとは限らず、配線・IP・経路・通信の制限なども考えられる。

共通GWは外側と同じLANなので、デフォルト経路をまだ設定していなくても到達できる。応答がなければ本体NICと共通スイッチの配線、IP重複、共通GWの稼働を確認する。内側からの確認は第7章で行う。

## SSHサービスを有効にする

```text
configure
set service ssh
commit
save
exit
show ssh fingerprints
```

SSHは標準のTCP/22で接続を受け付ける。第8章では自班ルーターの内側IPへ接続する。最後のコマンドで本体が表示した鍵の種類とSHA256指紋を記録し、第8章でWindowsに表示された値と照合する。

## 完了の確認

次の内容を記録する。

- ThinkPad本体のLANポートとUSBネットワークアダプターのLANポートが、それぞれ`eth0`・`eth1`のどちらに対応するか
- 外側・内側NICに設定したIPアドレス
- `save`で設定を保存できたこと
- SSHサーバーの指紋

パスワードや認証設定を含む完全な設定出力は提出物へ貼らない。

参照：[VyOS公式の設定操作](https://docs.vyos.io/en/rolling/cli.html)、[iputilsのping解説](https://man7.org/linux/man-pages/man8/ping.8.html)。
