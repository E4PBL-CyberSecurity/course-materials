# 11. WSLでKali Linux・Ubuntuを準備する

ルーター・DNS・VS Codeの準備が終わったWindows PC2台で、Linux環境を用意する。PC1のUbuntuをサーバー役、PC2のKali Linuxを通信の確認用として使う。

## WSL本体をインストールする

対象はIntel/AMD 64ビットPC、Windows 11 22H2以降、WSL 2.4.10以降。「スタート」→「設定」→「システム」→「バージョン情報」を開き、「Windowsの仕様」でWindowsの版を確認する。次に「スタート」を右クリックして「タスクマネージャー」を開き、「パフォーマンス」→「CPU」で「仮想化」が「有効」であることを確認する。

**Windows・自分のPowerShell：**

```powershell
wsl --version
wsl --list --verbose
```

`wsl --version`はWSL本体の版を表示する。「WSL バージョン」が`2.4.10`以降であることを確認する。

`wsl --list --verbose`は、自分のWindowsアカウントに登録されているLinuxの名前・状態・WSLの方式を表示する。Kali LinuxとUbuntuが登録済みの場合の表示例：

```text
  NAME            STATE           VERSION
* kali            Stopped         2
  Ubuntu-26.04    Running         2
```

- `NAME`：Linuxの登録名。`kali`や`Ubuntu-26.04`の行があれば、そのLinuxは導入済み。
- `STATE`：`Running`は起動中、`Stopped`は停止中。導入済みかどうかの確認では、どちらでもよい。
- `VERSION`：そのLinuxを動かすWSLの方式。授業では`2`を使う。UbuntuやKali LinuxのOSの版、WSL本体の`2.4.10`などの版とは別である。
- 名前の左の`*`：名前を指定せず`wsl`を実行したときに起動する、既定のLinuxを示す。

「インストールされているディストリビューションがありません」などと表示されたら、Linuxはまだ登録されていない。初回の準備ではこの状態でもよい。これはWSL本体の未導入とは異なる。

WSL本体が未導入の場合だけ、自分のWindowsアカウントで「スタート」を右クリックし、「ターミナル（管理者）」を選ぶ。「ユーザー アカウント制御」が表示されたら「はい」を選び、PowerShellで次を実行する。

```powershell
wsl --install --no-distribution
```

再起動を求められたら作業を保存して再起動する。自分のWindowsアカウントで「ターミナル」を開き、PowerShellで次を実行する。

```powershell
wsl --update
wsl --set-default-version 2
```

Linuxの登録はWindowsユーザーごとに別なので、以降も自分のWindowsアカウントで作業する。

## Kali Linuxのイメージを取得する

本授業は公式配布元から取得・照合済みのWSLイメージを実験室サーバーからコピーして使う。共有へ到達するには第9章の戻り経路とサーバー側の受付が必要。

1. エクスプローラーで左側の「ダウンロード」を開く。「新規作成」→「フォルダー」を選び、`WSL-Images`という名前のフォルダーを作る。
2. 「表示」→「表示」→「ファイル名拡張子」をオンにし、ファイル名の末尾まで表示する。
3. アドレス欄に`\\192.168.1.10\images\kali`を入力する。認証を求められたら、教員から配布された資格情報を使う。
4. `kali-linux-2026.2-wsl-rootfs-amd64.wsl`を右クリックし、「コピー」を選ぶ。
5. 左側の「ダウンロード」から`WSL-Images`を開く。ファイル一覧の空いているところを右クリックし、「貼り付け」を選ぶ。
6. コピーの進行画面が閉じ、コピー先に`kali-linux-2026.2-wsl-rootfs-amd64.wsl`が表示されたらコピー完了。

### コピーしたファイルを照合する

ハッシュ値は、ファイルの内容から計算する値である。コピーした内容が配布元と同じかを確認するため、SHA256という方式で計算した値を照合する。

エクスプローラーでコピー先の`WSL-Images`を開き、ファイル一覧の空いているところを右クリックして「ターミナルで開く」を選ぶ。PowerShellで次を実行する。ファイル名の前の`.\`は、今開いているフォルダー内のファイルを指定する表記である。

```powershell
Get-FileHash .\kali-linux-2026.2-wsl-rootfs-amd64.wsl
```

結果の`Algorithm`欄が`SHA256`、`Hash`欄の64文字が次の値とすべて一致すれば照合完了。英字の大文字・小文字は区別しない。`Hash`欄が表示されなければ、ファイル名と、`WSL-Images`でターミナルを開いたかを確認する。不一致ならインストールせず、エクスプローラーでコピーし直す。

```text
1b172389e9109e9bb0c3d1fa18eda078271484dbcef8dbee4aab8b1f369466c6
```

## Kali Linuxをインストールし、ユーザーを作る

上で開いたPowerShellで`wsl --list --verbose`を実行し、`NAME`欄に`kali`の行があるかを見る。あれば再インストールせず、その環境を起動して下のOS名と版を確認する。行がない場合だけ新規インストールする。

```powershell
wsl --install --from-file .\kali-linux-2026.2-wsl-rootfs-amd64.wsl --no-launch
wsl -d kali
```

初回起動時のユーザー作成画面では、次の値を入力する。各項目で入力後にEnterキーを押す。

1. ユーザー名：`kali`。
2. パスワード：`kali`。
3. パスワードの再入力：もう一度`kali`。

パスワードの入力中は文字が表示されないが、正常な動作である。作成後、`whoami`の結果が`kali`であり、`cat /etc/os-release`にKali Linuxの名前と版が表示されることを確認する。`exit`でPowerShellへ戻る。

```bash
whoami
cat /etc/os-release
exit
```

Kali Linuxの登録名は`kali`。

## サーバー役Ubuntuのイメージを取得する

1. エクスプローラーのアドレス欄に`\\192.168.1.10\images\ubuntu`を入力する。
2. `ubuntu-26.04.1-wsl-amd64.wsl`を右クリックし、「コピー」を選ぶ。
3. 左側の「ダウンロード」から`WSL-Images`を開き、ファイル一覧の空いているところを右クリックして「貼り付け」を選ぶ。
4. コピーの進行画面が閉じ、コピー先に`ubuntu-26.04.1-wsl-amd64.wsl`が表示されたらコピー完了。

Kali Linuxと同様に、コピーした内容の一致を確認する。`WSL-Images`の空いているところを右クリックして「ターミナルで開く」を選び、PowerShellで次を実行する。

```powershell
Get-FileHash .\ubuntu-26.04.1-wsl-amd64.wsl
```

`Algorithm`欄が`SHA256`、`Hash`欄の64文字が次の値とすべて一致すれば照合完了。英字の大文字・小文字は区別しない。不一致の場合は、Kali Linuxと同様にエクスプローラーでコピーし直す。

```text
48d56724b5c8e60f24893e83e73bbb58c60b3ca22fba3da977075420acd54104
```

## Ubuntuをインストールし、ユーザーを作る

上で開いたPowerShellを使う。先ほどの一覧の`NAME`欄に`Ubuntu-26.04`の行があるかを見る。あれば再インストールせず、その環境を起動して下のOS名と版を確認する。行がない場合だけ新規インストールする。

```powershell
wsl --install --from-file .\ubuntu-26.04.1-wsl-amd64.wsl --no-launch
wsl -d Ubuntu-26.04
```

初回起動時のユーザー作成画面では、次の値を入力する。Windowsのユーザー名が候補に表示されても、そのまま確定せず、`ubuntu`と入力する。ユーザー名を統一し、ユーザー名を含む操作やパスを全員が手順書の記述どおり使えるようにするためである。

1. ユーザー名：`ubuntu`。
2. パスワード：`ubuntu`。
3. パスワードの再入力：もう一度`ubuntu`。

各項目で入力後にEnterキーを押す。パスワードの入力中は文字が表示されない。作成後、`whoami`の結果が`ubuntu`であり、`cat /etc/os-release`にUbuntu 26.04が表示されることを確認する。`exit`でPowerShellへ戻る。

```bash
whoami
cat /etc/os-release
exit
```

PowerShellで`wsl --list --verbose`を実行する。`NAME`欄で`kali`と`Ubuntu-26.04`の行を探し、両方の`VERSION`欄が`2`なら確認完了。`STATE`欄は`Running`でも`Stopped`でもよい。名前がなければ登録が完了していない。`VERSION`が`1`ならWSL 1なので、次のミラーモード設定へ進まず教員に確認する。稼働するWSLのディスクはローカルディスクに置き、SMB共有上には置かない。

## ミラーモードを設定する

Windowsで`notepad.exe "$env:USERPROFILE\.wslconfig"`を実行する。既存ファイルは別名でバックアップし、既存項目を残して`[wsl2]`節に次の値を設定する。同名の節や項目を重複させない。

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
```

ファイル名を`.wslconfig.txt`にしない。設定はそのWindowsユーザーの全WSL 2環境に適用される。WSL内の作業を保存し、PowerShellから再起動する。

```powershell
wsl --shutdown
wsl -d Ubuntu-26.04
```

**Ubuntu内：**

```bash
wslinfo --networking-mode
ip -4 address
ip -4 route
nslookup web.alf.lab 192.168.21.1
getent ahostsv4 web.alf.lab
```

`mirrored`、実験用IP、経路、名前解決を確認する。`nslookup`がなければ`sudo apt update`と`sudo apt install -y dnsutils`で導入する。Kali Linuxでも同様に確認する。Ubuntu内へWindowsとは別の班LAN用固定IPを追加しない。

## Kali Linux・Ubuntuのトラブルを切り分ける

表11-1 Kali Linux・Ubuntu・WSLのトラブルと対処

| 症状 | 対処 |
| --- | --- |
| インストール時に`--from-file`が無効なオプションと表示される | `wsl --update`で更新する。`wsl --version`の「WSL バージョン」が`2.4.10`以降であることを確認する |
| 仮想マシンを起動できない | CPU仮想化、Windows機能、再起動を教員と確認する |
| 共有に届かない | `Test-NetConnection 192.168.1.10 -Port 445`で共有サーバーのTCP接続を調べる。`RemoteAddress`が`192.168.1.10`、`RemotePort`が`445`、`TcpTestSucceeded`が`True`なら接続成功。`False`ならIP・経路・通信制限を確認する。`True`でも共有を開けなければ資格情報・共有名を確認する。表示の読み方は[第7章](07-cabling.md)を参照する |
| ユーザー作成画面が出ない | 既存登録の有無と登録名を確認。既存環境を削除しない |
| `whoami`が指定の名前にならない | Kali Linuxでは`kali`、Ubuntuでは`ubuntu`が正しい。作成したユーザーと起動するLinux環境を教員と確認する。`root`のまま作業しない |
| Linuxのパスワードが通らない | Kali Linuxでは`kali`、Ubuntuでは`ubuntu`を入力する。解決しなければ、作成したユーザー名と利用中のLinux環境を教員と確認する |
| ミラーモードにならない | Windows版、WSL版、`.wslconfig`の保存先・拡張子、WSL再起動を確認する |
| DNSだけ失敗 | Windowsの優先DNS、`dnsTunneling`、指定DNSと通常の名前解決を比較する |

参照：[Ubuntu WSL](https://documentation.ubuntu.com/wsl/latest/)、[Kali Linux WSL](https://www.kali.org/docs/wsl/)。

## 完了の確認

Linuxの登録名・版、`whoami`の結果がKali Linuxでは`kali`、Ubuntuでは`ubuntu`であること、ミラーモード、班LANのIP・経路、指定DNSと通常の名前解決の結果を記録する。

Windowsの版の確認：[Microsoft公式：Windowsデバイスに関する情報を検索する](https://support.microsoft.com/ja-jp/windows/experience/find-information-about-your-windows-device)。
