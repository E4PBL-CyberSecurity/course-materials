import fs from 'node:fs/promises';
import path from 'node:path';

export const metadata = {
  "title": "E4 PBL ネットワーク構築",
  "author": "嶋 直樹",
  "version": "E4 PBL v2.1",
  "date": "2026-10-25"
};
export const base = '/course-materials';
export const publication = {
  "repository": "E4PBL-CyberSecurity/course-materials",
  "chapterCount": 12,
  "handbookTitle": "ネットワーク構築の手順",
  "scope": "public-network",
  "assets": [
    "network-construction/network.png"
  ],
  "aliases": {}
};

export const documents = [
  ["index", "handbook/README.md", "手順の全体像"],
  ["access", "handbook/01-access.md", "1. 資料へのアクセス"],
  ["network", "handbook/02-network.md", "2. 実験用ネットワーク"],
  ["hardware", "handbook/03-hardware.md", "3. ハードウェア"],
  ["media", "handbook/04-media.md", "4. インストーラーUSB"],
  ["install", "handbook/05-install.md", "5. VyOSのインストール"],
  ["router1", "handbook/06-router1.md", "6. NIC・IP・SSHサービス"],
  ["cabling", "handbook/07-cabling.md", "7. 配線変更・Windows固定IP"],
  ["ssh", "handbook/08-ssh.md", "8. SSHサインイン・公開鍵"],
  ["router2", "handbook/09-router2.md", "9. ルーティング・DNS"],
  ["vscode", "handbook/10-vscode.md", "10. VS Codeの準備"],
  ["wsl", "handbook/11-wsl.md", "11. WSL・Kali Linux・Ubuntu"],
  ["github-account", "github-account/GitHubアカウント作成手順.md", "GitHub登録の画面・詳細"],
  ["dns", "network-construction/dns.md", "DNSの詳細・共通GWの準備"],
  ["dhcp", "network-construction/dhcp.md", "任意・班LANのDHCP"],
  ["ssh-reference", "network-construction/vscode-vyos-ssh.md", "SSH認証の詳細・復旧"],
  ["teacher-tasks", "teacher/tasks.md", "教員用・ネットワーク構築の準備"],
  ["vocabulary", "vocabulary/words.md", "補充・英単語一覧"],
  ["vocabulary-abbreviations", "vocabulary/abbreviations.md", "補充・略語の補助一覧"],
  ["vocabulary-messages", "vocabulary/messages.md", "補充・表示メッセージ"],
  ["vocabulary-preparation", "vocabulary/preparation.md", "補充・英単語の事前学習"],
  ["vocabulary-assignment", "vocabulary/assignment.md", "補充・英単語の確認課題"],
].map(([slug, source, label]) => ({ slug, source, label, pdf: `${slug}.pdf`, chapters: [slug] }));

for (const [slug, pdf] of Object.entries({ dns: 'dns-setup.pdf', vscode: 'vscode-vyos-ssh.pdf' }))
  documents.find(doc => doc.slug === slug).pdf = pdf;

export async function readSources(root) {
  return new Map(await Promise.all(documents.map(async doc =>
    [doc.slug, (await fs.readFile(path.join(root, doc.source), 'utf8')).replace(/\r\n/g, '\n').trim() + '\n'])));
}

export function getDocuments(sources) {
  return documents.map(doc => ({ ...doc, title: sources.get(doc.slug).match(/^# (.+)/m)[1] }));
}
