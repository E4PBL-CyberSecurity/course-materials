# Cisco公式ネットワークアイコン

図2-1のルーターとスイッチには、Cisco公式のPMS 3015 EPS原版を使用しています。

- 配布元：<https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html>
- 原版アーカイブ：<https://www.cisco.com/c/dam/en_us/about/ac50/ac47/3015_eps.zip>
- 利用条件：<https://www.cisco.com/c/en/us/about/brand-center/copyright-use.html>
- 一般利用ガイドライン：<https://www.cisco.com/c/en/us/about/brand-center/copyright-use/copyright-material-guidelines.html>
- 取得日：2026-10-24
- `router.eps`：アーカイブ内の `router.eps`（Router）。
- `workgroup-switch.eps`：アーカイブ内の `workgroup switch.eps`（Workgroup switch）。ファイル名だけを変更しています。
- EPS原版はバイト単位で変更していません。原版内の作成日は2002-12-10ですが、初出公開年は示されていないため、著作権表示に推定年を加えていません。
- PNGはGhostscript 10.07.1でEPSの境界に合わせて600 dpiで描画した表示用ファイルです。図柄の描き直し・色の指定変更・縦横比の変更はしていません。
- 編集元は `../network.drawio` です。PNGを埋め込み、機器名・IPアドレスはアイコン外の別のテキスト要素として配置しています。

表示用PNGの生成例：

```powershell
& 'C:\Program Files\gs\gs10.07.1\bin\gswin64c.exe' -dSAFER -dBATCH -dNOPAUSE -dEPSCrop -sDEVICE=pngalpha -r600 '-sOutputFile=router.png' 'router.eps'
```

These materials have been reproduced by Naoki Shima with the permission of Cisco Systems Inc. COPYRIGHT © CISCO SYSTEMS, INC. ALL RIGHTS RESERVED.

Ciscoの著作物にはCiscoの利用条件が適用されます。教材全体への利用許諾でアイコンの改変・再許諾を認めるものではありません。機器の役割を示すネットワーク図の記号として使用しており、Cisco製品の採用やCiscoによる公認を示すものではありません。
