# 10. VS Codeを準備する

ルーターとPCの接続ができたら、WindowsにVS Codeを用意して記録とターミナル操作をまとめる。インストールと日本語化にはインターネット接続を使う。

## インストールする【Windows・PowerShell】

スタートメニューからVS Codeが開ける場合は再導入しない。未導入なら自分の通常権限のPowerShellで実行する。

```powershell
winget install Microsoft.VisualStudioCode
```

インストールが完了したら、「スタート」メニューからVisual Studio Codeを開く。

## Copilotのサインイン表示に対応する

VS Codeの基本的な編集とターミナル操作にはCopilotへのサインインは不要。Copilotの設定・サインインを求められたら、閉じるか後で設定する選択で本体の操作へ進む。授業でCopilotを使う指示がある場合だけ、第1章で用意した自分のGitHubアカウントを使う。

参照：[VS Code公式のCopilot設定](https://code.visualstudio.com/docs/setup/copilot)。画面の文言は版によって異なる。

## 日本語化し、フォルダーとファイルを開く

1. `Ctrl + Shift + P`→`Configure Display Language`→日本語を選ぶ。必要ならMicrosoft提供のJapanese Language Packを導入して再起動する。
2. エクスプローラーで自分のドキュメントに`E4PBL`フォルダーを作る。
3. VS Codeの「ファイル」→「フォルダーを開く」で`E4PBL`を選ぶ。
4. 左のファイル一覧から新しいファイルを作り、`experiment-log.md`として保存する。既存ファイルは「ファイルを開く」または`Ctrl + O`でも開ける。
5. 班番号、日付、操作場所、コマンド、結果を書く。`Ctrl + S`で保存する。パスワードや秘密鍵は書かない。

## ターミナルとリモート接続を使う

「ターミナル」→「新しいターミナル」を選ぶ。`＋`横のメニューからPowerShellを選び、`PS C:\…>`を確認する。編集画面へコマンドを書くだけでは実行されない。

```powershell
ssh vyos@192.168.21.1
```

SSHで接続したら、同じターミナルの入力先がVyOSへ変わる。`show interfaces`で確認し、`exit`でPowerShellへ戻る。

## 完了の確認

記録用フォルダー・ファイルを開け、ターミナルからSSH接続と終了ができたことを記録する。公開鍵認証で困ったときは[SSH別冊](../network-construction/vscode-vyos-ssh.md)を参照する。
