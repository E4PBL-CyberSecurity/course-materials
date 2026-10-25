# 4. インストーラーUSBを作る

Windows PCで、実験室の共有フォルダーにあるVyOSのISOをインストーラーUSBへ書き込む。インストール先USBにはISOを書き込まず、第5章でVyOSをインストールするために残す。

## USBメモリ2個を確認・初期化する

:::caution
初期化とISOの書き込みで対象のUSBメモリのデータが消える。媒体の型番・容量を確認し、処理対象以外のUSBストレージは外す。授業資料やバックアップを置いた媒体を使わない。
:::

[SDメモリカードフォーマッター](https://www.sdcard.org/ja/downloads-2/formatter-2/)で、インストーラーUSBとインストール先USBを1個ずつ初期化する。

1. 公式ページでWindows用を選び、利用条件を確認してダウンロードする。ZIPを展開し、セットアップを実行してインストールする。「ユーザー アカウント制御」が表示されたら「はい」を選ぶ。
2. インストーラーUSBだけを接続する。エクスプローラーの「PC」でドライブ文字・ドライブ名・容量を記録し、本体に「インストーラーUSB」の札を付ける。
3. 「SD Card Formatter」を起動する。「カードの選択（Select card）」でインストーラーUSBのドライブを選び、ドライブ文字と容量を記録と照合する。対象を識別できなければ進まない。
4. 「クイックフォーマット（Quick format）」を選ぶ。ボリュームラベルはインストーラーUSBを`VYOS_BOOT`、インストール先USBを`VYOS_DISK`とする。
5. 「フォーマット（Format）」を押す。確認画面でも消去対象がインストーラーUSBであることを確認して進め、完了するまで外さない。完了後、安全な取り外しで外す。
6. インストール先USBだけを接続し、同様にドライブ文字・容量を記録して、本体に「インストール先USB」の札を付ける。手順3〜5をインストール先USBに読み替えて初期化する。

対象が一覧に出ない場合は「更新（Refresh）」を押す。それでも表示されない場合や初期化に失敗する場合は、教員と「ディスクの管理」で対象のUSBメモリを確認する。内蔵ディスクや不明なディスクを削除しない。

## 共有フォルダーのISOを確認する

1. エクスプローラーのアドレス欄に`\\192.168.1.10\images\VyOS`を入力して共有フォルダーを開く。認証を求められたら、教員から案内された資格情報を使う。
2. 使用するファイルは`vyos-2026.02-generic-amd64.iso`。共有フォルダーに別の版があっても選ばない。開けない場合や指定ファイルが見つからない場合は、教員へ確認する。
3. Rufusでは、次の共有パスのISOを直接選ぶ。PCへのダウンロードやコピーは行わない。

```text
\\192.168.1.10\images\VyOS\vyos-2026.02-generic-amd64.iso
```

配布元：[VyOS Stream 2026.02の公式案内](https://blog.vyos.io/vyos-stream-2026.02-is-available-for-download)。この授業では共有フォルダーのISOを使う。

## Windowsのターミナルを起動する

ここからWindows PCでコマンドを入力する。「ターミナル」はコマンドを入力・表示するためのアプリで、この手順ではその中でPowerShellを使う。次のどちらかの方法で起動する。

### タスクバーの検索ボックスから起動する

1. 画面下のタスクバーにある「検索ボックス」をクリックする。虫眼鏡の「検索」アイコンだけが表示されている場合は、そのアイコンをクリックして検索ボックスを開く。
2. 検索ボックスに「ターミナル」と入力する。
3. 表示された「検索結果」から、アプリの「ターミナル」（Windows Terminal）のアイコンをクリックする。

### スタートボタンを右クリックして起動する

1. タスクバーにあるWindowsロゴの「スタートボタン」を右クリックする。
2. 表示された「クイックリンクメニュー」から「ターミナル」をクリックする。

### PowerShellが開いていることを確認する

ターミナルが開き、「Windows PowerShell」または「PowerShell」のタブに、`PS`で始まる入力待ちの表示（プロンプト）が出ていれば準備完了。別の画面が開いている場合は、タブの「＋」の右側にある下向き矢印をクリックし、「Windows PowerShell」または「PowerShell」を選ぶ。

## wingetでRufusをインストールする

上で開いたWindows PCのPowerShellで、次を実行する。

```powershell
winget install Rufus.Rufus
```

同意を求められたら内容を確認して進める。`winget`が認識されない場合は、教員とMicrosoft Storeの「アプリ インストーラー」を更新してからやり直す。操作の説明は[Microsoftのwinget案内](https://learn.microsoft.com/ja-jp/windows/package-manager/winget/)を参照する。

インストール完了後、ターミナルを閉じて開き直し、次のコマンドでRufusを起動する。「ユーザー アカウント制御」が表示されたら「はい」を選ぶ。

```powershell
rufus
```

## Rufusでインストールメディアを作る

1. インストール先USBを外し、インストーラーUSBだけを接続する。
2. 「デバイス」でインストーラーUSBの型番・容量を確認し、「ブートの種類」の「選択」で上記の共有パスのISOを指定する。
3. 「スタート」を押す。ISO/DDの選択が出た場合はDDイメージモードで書き込む。画面に選択が出ない場合はその版の案内に従う。
4. 消去対象がインストーラーUSBであることを確認して進める。「準備完了」まで待ち、安全な取り外しで外す。書き込み後にWindowsがフォーマットを求めてもキャンセルする。

## 完了の確認

使用したISOの版・共有パスと、ISOを書き込んだインストーラーUSBを記録する。インストーラーUSBとインストール先USBの2個を持ってThinkPadへ移る。

ターミナルの起動方法の参照：[Microsoft公式：Windowsでファイルとアプリを見つける](https://support.microsoft.com/ja-jp/windows/experience/storage-filemanagement/find-your-files-and-apps-in-windows)、[クイックリンクメニューの名称](https://support.microsoft.com/ja-jp/accessibility/windows/keyboard-shortcuts-in-windows)、[Windowsターミナルの初期設定](https://learn.microsoft.com/ja-jp/windows/terminal/install)。
