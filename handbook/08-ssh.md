# 8. SSHでルーターへサインインする

第7章で自班ルーターへ通信できたWindows PCのPowerShellを使う。例は班1。班2〜4は接続先IPを自班の内側IPへ読み替える。

## サインインとサインアウト

```powershell
ssh vyos@192.168.21.1
```

1. 初回に表示された鍵の種類とSHA256指紋を、第6章で記録した本体の表示と照合する。一致したら`yes`を入力する。
2. VyOSユーザーのパスワードを入力する。入力した文字は表示されない。`vyos@PBL-R1:~$`などに変われば接続できた。
3. `exit`でサインアウトし、Windowsの`PS C:\…>`へ戻る。

SSHで接続すると、同じターミナルでも入力先がVyOSに変わる。設定モードの`[edit]`が出ている場合、最初の`exit`は運用モードへ戻る操作になる。

## 公開鍵を用意する

公開鍵認証は、Windowsに保管する秘密鍵と、ルーターへ登録する公開鍵を使う本人確認の方法。秘密鍵は提出・共有しない。

WindowsのPowerShellで起動する。

```powershell
ssh-keygen.exe
```

1. `Enter file in which to save the key ...:`は保存先の確認。そのままEnterを押す。`Overwrite (y/n)?`が出たら`n`で中止し、既存の鍵を使うか教員と確認する。
2. `Enter passphrase ...:`に、自分で決めた鍵のパスフレーズを入力する。`Enter same passphrase again:`にも同じものを入力する。入力文字は表示されない。
3. `Your identification has been saved ...`と`Your public key has been saved ...`に、秘密鍵と公開鍵の保存先が表示されれば完了。

以下は既定のファイル名`id_ed25519`を使う例。末尾`.pub`が公開鍵、末尾なしが秘密鍵である。別のファイル名が表示された場合は、以降のファイル名を読み替える。

## 公開鍵ファイルをルーターへ送る

Windowsは、ユーザーごとのファイルや設定を「ユーザープロファイル」として管理する。その保存先は、例えば`C:\Users\student`というフォルダーである。

環境変数は、OSやアプリが使う情報を「名前」と「値」の組で持つ仕組み。`USERPROFILE`という環境変数には、今サインインしているユーザーのプロファイルフォルダーの場所が入っている。

PowerShellの`$env:`は環境変数の値を読み取る書き方。`$env:USERPROFILE`が`C:\Users\student`なら、`"$env:USERPROFILE\.ssh\id_ed25519.pub"`は`C:\Users\student\.ssh\id_ed25519.pub`を指す。

WindowsのPowerShellで、SSHのファイルコピーコマンド`scp`を実行する。末尾の`:`の後ろは省略し、ルーターのホームフォルダーへ送る。

```powershell
scp "$env:USERPROFILE\.ssh\id_ed25519.pub" vyos@192.168.21.1:
```

VyOSのパスワードを入力し、コピーが完了してPowerShellへ戻るのを待つ。続けてルーターへ接続する。

```powershell
ssh vyos@192.168.21.1
```

## VyOSの標準機能で公開鍵を取り込む

VyOSの運用モードで次を実行する。送った公開鍵ファイルから、登録に必要なコマンドが生成される。

```text
generate public-key-command user vyos path id_ed25519.pub
```

表示された`configure`と2行の`set`、合計3行だけをまとめてコピーし、同じSSHターミナルへ貼り付けて実行する。鍵の文字列や登録名は書き換えない。`[edit]`が表示された設定モードで、反映と保存を行う。

```text
commit
save
exit
```

`commit`は設定を動作へ反映し、`save`は再起動後にも使うために保存する。エラーが出たら先へ進まず、画面を教員へ示す。VyOSでは公開鍵も設定として保存するため、この反映・保存が必要である。

## 通常のsshコマンドで接続を確認する

運用モードでもう一度`exit`を入力してWindowsへ戻り、接続し直す。

```powershell
ssh vyos@192.168.21.1
```

`Enter passphrase for key ...:`はWindowsにある秘密鍵のパスフレーズを尋ねている。鍵を作ったときのものを入力する。`vyos@192.168.21.1's password:`はVyOSのパスワードを尋ねており、この場合は公開鍵認証に成功していない。

## known_hostsと接続先の鍵変更に対処する

`$env:USERPROFILE\.ssh\known_hosts`には、接続先サーバーのホスト公開鍵が記録される。自分のログイン用公開鍵とは役割が異なる。

再インストールや機器交換でホスト鍵が変わると、`REMOTE HOST IDENTIFICATION HAS CHANGED`が出る。本体の`show ssh fingerprints`と交換履歴を確認し、正しい変更と確認できた場合だけ、Windowsで該当IPの古い記録を消す。

```powershell
ssh-keygen.exe -R 192.168.21.1
```

接続し直し、新しい指紋を本体の表示と照合する。DNS名で接続していた場合は、その名前の記録も確認する。

## 完了の確認

PC1・PC2のそれぞれで、公開鍵の作成、送付、取り込み・保存、接続し直した結果を記録する。VyOSのパスワードを入力せずに接続できればよい。秘密鍵やパスフレーズは記録しない。

参照：[VyOS公式：公開鍵から登録コマンドを生成する](https://docs.vyos.io/en/1.5/configuration/service/ssh.html#operation)。
