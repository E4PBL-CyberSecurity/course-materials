# 5. インストール先USBへVyOSをインストールする

ThinkPadでインストーラーUSBから起動し、インストール先USBへVyOSをインストールする。インストーラーUSBから起動する一時的なOSの環境を「ライブ環境」という。完成後は、インストール先USBからVyOSを起動して設定を保存する。

## インストーラーUSBから起動する

1. ThinkPadをシャットダウンし、インストーラーUSBだけを接続する。インストール先USBはまだ接続しない。AC電源を接続する。
2. 電源を入れる。授業用ThinkPadはUSBから優先して起動する設定なので、通常はブートメニューの操作は不要。インストーラーUSBから起動するのを待つ。
3. ライブ環境のログイン画面でユーザー名`vyos`、初期パスワード`vyos`を入力する。パスワードは表示されない。
4. インストーラーUSBから起動しない場合は、教員と起動時の`F12`メニューで対象USBを選ぶ。それでも起動しなければRufusの書き込み・UEFI設定を確認する。Secure Bootなど学校管理の設定を自分の判断で変更しない。

## 日本語キーボード配列に設定する

ThinkPad E530cは日本語キーボードだが、VyOSの初期配列はUSのため、一部の記号がキートップの表記と異なる。ログイン直後、パスワードの設定や記号の入力を始める前に、次を1行ずつ入力する。`configure`で設定モードに入り、`exit`で運用モードへ戻る。

```text
configure
set system option keyboard-layout jp106
commit
save
exit
```

`set`は配列の変更を準備し、`commit`はその変更を今動いているVyOSに反映する。`save`は反映した設定をファイルへ保存し、後でインストール先USBへ引き継げるようにする。`commit`でエラーが出たら先へ進まず、教員に画面を示す。

設定後、`@`と`:`のキーを押し、キートップどおりに表示されることを確認する。Enterは押さず、`Ctrl`＋`U`で入力を消す。

## インストール先USBを接続する前後でディスクを確認する

VyOSが使っているLinuxは、この実験で使うSSDやUSBメモリを`sda`、`sdb`、`sdc`といった「デバイス名」で区別する。これらの名前は、基本的にカーネル（OSの中心部分）がストレージを認識した順に付けられる。授業用ThinkPadでVyOSを起動すると、内蔵SSDは`sda`、USBメモリ2個は`sdb`と`sdc`として認識される。

以下では、インストーラーUSBとインストール先USBのどちらが`sdb`・`sdc`なのかを、接続前後の表示を比べて確認する。内蔵SSDの`sda`はインストール先に選ばない。

### 1. インストーラーUSBだけを接続した状態で確認する

**ThinkPad・VyOS運用モード：**

```text
show version
lsblk
```

`show version`でStream 2026.02を確認する。`lsblk`では`NAME`（デバイス名）、`SIZE`（容量）、`TYPE`（種類）、`MOUNTPOINTS`（使用されている場所）を見る。

次は画面の見方を示す**出力例（入力しない）**。容量・パーティション構成は例であり、一部の行を省略している。

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0 465.8G  0 disk
sdb      8:16   1  14.9G  0 disk
└─sdb1   8:17   1   498M  0 part /usr/lib/live/mount/medium
```

この例では`sdb1`の`MOUNTPOINTS`にライブ環境の媒体を示す`/usr/lib/live/mount/medium`がある。その親の`sdb`がインストーラーUSBである。環境によって`/lib/live/mount/medium`と表示される場合もある。親のdisk行だけでなく、その下のpart行も見る。`loop0`などはOSのイメージで、インストール先ではない。

画面を記録する。起動中のインストーラーUSBは外さない。

### 2. install imageの直前にインストール先USBを接続する

インストール先USBを接続し、認識を待ってから次を入力する。

```text
lsblk
```

接続後の**出力例（入力しない、一部の行を省略）**：

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0 465.8G  0 disk
sdb      8:16   1  14.9G  0 disk
└─sdb1   8:17   1   498M  0 part /usr/lib/live/mount/medium
sdc      8:32   1  14.9G  0 disk
└─sdc1   8:33   1  14.9G  0 part
```

新しく増えた`TYPE`が`disk`の行がインストール先USB。この例では`sdc`を選ぶ。その`NAME`と`SIZE`を記録し、USBメモリ本体の容量と照合する。16GBの媒体が約14.9Gと表示されることはある。`part`の行はディスク内の区画なので、`sdc1`は選ばない。

`MOUNTPOINTS`が空欄、`RM`が1、容量が同じという条件だけでは判定できない。`RM`はリムーバブル属性で、USB接続かどうかを示す欄ではない。接続前後で増えたdisk行を確認する。増えていなければ少し待って`lsblk`を再実行し、識別できなければ停止して教員へ確認する。

**もし`sdc1`に`/usr/lib/live/mount/medium`が付いていれば、インストーラーUSBは`sdc`なので選ばない。** この場合も接続前後で増えたdisk行をインストール先にする。`sda`はこの授業の内蔵ストレージであり、インストーラーUSBとは判断しない。

## インストール先USBへインストールする

```text
install image
```

1. 続行確認に同意し、イメージ名は対象版を識別できる名前にする。
2. `vyos`ユーザーの新しいパスワードを設定し、確認入力する。授業で定められた方法で保管する。
3. 本体画面とキーボードを使うため、コンソール種別はKVMを選ぶ。
4. **ディスクの選択でインストール先USBを指定する。** 直前の`lsblk`で新しく増えたdisk行の名前を入力する。上の例なら`sdc`だが、実際の表示を優先する。内蔵ストレージの`sda`・インストーラーUSBではないことを班員と確認し、既定値を無条件に採用しない。
5. 選んだディスク全体の消去、使用容量、設定ファイル、ブートローダーに関する質問に答える。設定ファイルの選択では、今回日本語配列を保存した現在の`config.boot`（選択肢1、既定）をEnterで選び、インストール先USBへ引き継ぐ。以前のインストールから設定を取り込まない。
6. 完了メッセージを確認して、次で電源を切る。

```text
poweroff
```

インストーラーUSBを外し、インストール先USBだけを接続して起動する。新しく設定したパスワードでログインし、次を確認する。

```text
show version
show system image
```

## 完了の確認

インストール先USBだけで起動し、インストール済みイメージであることを確認する。起動確認に失敗したら第6章へ進まず、起動媒体・インストール先を見直す。

再起動後も`@`と`:`がキートップどおりに入力できることを確認し、Enterは押さずに`Ctrl`＋`U`で消す。配列が戻っていたら、設定ファイルを引き継いだか教員と確認してから先へ進む。

参照：[VyOS公式インストール手順](https://docs.vyos.io/en/latest/installation/install.html)。

キーボード設定の参照：[VyOS公式のシステムオプション](https://docs.vyos.io/en/rolling/configuration/system/option.html#keyboard-layout)。

デバイス名の参照：[systemd公式のudev解説](https://www.freedesktop.org/software/systemd/man/latest/udev.html)。
