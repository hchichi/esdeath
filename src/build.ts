/** @format */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { promises as fs, Dirent } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = "https://raw.githubusercontent.com/hchichi/esdeath/main/";
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, "public");

// 允许的文件类型和目录
const allowedExtensions = [".list", ".mmdb"];
const allowedDirectories = ["Surge", "GeoIP"];

// 规则分类映射
const RULE_CATEGORIES: { [key: string]: string } = {
  "AI": "AI Services",
  "Apple": "Apple Services",
  "Social": "Social Media",
  "Google": "Google Services",
  "Microsoft": "Microsoft Services",
  "Oracle": "Oracle Cloud",
  "Streaming": {
    "Video": "Video Streaming",
    "Music": "Music Services"
  },
  "Reject": "Advertising Rules",
  "Direct": "Direct Rules",
  "Anti": "Anti-IP Attribution",
  "Developer": "Developer Tools",
  "Domestic": "China Rules",
  "CCC-Global": "Global CDN",
  "SpeedTest": "Speed Test",
};

// 统计规则数量
async function countRules(filePath: string) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  
  const stats = {
    total: 0,
    domain: 0,
    domainSuffix: 0,
    domainKeyword: 0,
    ipCIDR: 0,
    ipCIDR6: 0,
    ipASN: 0,
    geoip: 0,
    userAgent: 0,
    urlRegex: 0
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    stats.total++;
    if (trimmedLine.startsWith('DOMAIN,')) stats.domain++;
    else if (trimmedLine.startsWith('DOMAIN-SUFFIX,')) stats.domainSuffix++;
    else if (trimmedLine.startsWith('DOMAIN-KEYWORD,')) stats.domainKeyword++;
    else if (trimmedLine.startsWith('IP-CIDR,')) stats.ipCIDR++;
    else if (trimmedLine.startsWith('IP-CIDR6,')) stats.ipCIDR6++;
    else if (trimmedLine.startsWith('IP-ASN,')) stats.ipASN++;
    else if (trimmedLine.startsWith('GEOIP,')) stats.geoip++;
    else if (trimmedLine.startsWith('USER-AGENT,')) stats.userAgent++;
    else if (trimmedLine.startsWith('URL-REGEX,')) stats.urlRegex++;
  }

  return stats;
}

// 文件排序
const prioritySorter = (a: Dirent, b: Dirent) => {
  if (a.isDirectory() && !b.isDirectory()) return -1;
  if (!a.isDirectory() && b.isDirectory()) return 1;
  return a.name.localeCompare(b.name);
};

// 生成目录树
async function walk(dir: string, baseUrl: string) {
  let tree = "";
  const entries = await fs.readdir(dir, { withFileTypes: true });
  entries.sort(prioritySorter);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath);
    const url = `${baseUrl}${encodeURIComponent(relativePath)}`;

    // 跳过不需要的目录和文件
    if (entry.name === 'src' || entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      const categoryName = RULE_CATEGORIES[entry.name] || entry.name;
      const subDirContent = await walk(fullPath, baseUrl);
      if (subDirContent) {
        tree += `
          <div class="category">
            <h2>${categoryName}</h2>
            <div class="rules-grid">
              ${subDirContent}
            </div>
          </div>`;
      }
    } else if (allowedExtensions.includes(path.extname(entry.name).toLowerCase())) {
      const stats = await countRules(fullPath);
      tree += `
        <div class="rule-card">
          <div class="rule-header">
            <span class="rule-name">${entry.name}</span>
            <div class="rule-stats">
              ${stats.total ? `<span title="总规则数">📋 ${stats.total}</span>` : ''}
              ${stats.domain ? `<span title="域名规则">🌐 ${stats.domain + stats.domainSuffix + stats.domainKeyword}</span>` : ''}
              ${(stats.ipCIDR || stats.ipCIDR6) ? `<span title="IP规则">🌍 ${stats.ipCIDR + stats.ipCIDR6}</span>` : ''}
            </div>
          </div>
          <div class="rule-actions">
            <button class="action-button copy-rule-button" data-url="${url}">
              <img src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png" 
                   alt="Copy Rule" 
                   style="height: 16px; vertical-align: middle;"/> 
              复制规则集
            </button>
          </div>
        </div>`;
    }
  }
  return tree;
}

function generateHtml(tree: string) {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Surge Rules Repository</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Surge Rules Repository</h1>
                <p>Last Updated: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
                <div class="search-box">
                    <input type="text" id="search" placeholder="🔍 搜索规则...">
                </div>
            </header>
            <main>
                ${tree}
            </main>
        </div>
        <script>
            // 搜索功能
            document.getElementById('search').addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                document.querySelectorAll('.rule-card').forEach(card => {
                    const text = card.textContent.toLowerCase();
                    const category = card.closest('.category');
                    card.style.display = text.includes(searchTerm) ? '' : 'none';
                    
                    if (category) {
                        const visibleCards = category.querySelectorAll('.rule-card[style="display: none"]');
                        category.style.display = visibleCards.length === category.querySelectorAll('.rule-card').length ? 'none' : '';
                    }
                });
            });

            // 复制规则集功能
            document.querySelectorAll('.copy-rule-button').forEach(button => {
                button.addEventListener('click', async () => {
                    const url = button.dataset.url;
                    try {
                        const response = await fetch(url);
                        const text = await response.text();
                        await navigator.clipboard.writeText(text);
                        button.textContent = '复制成功!';
                        setTimeout(() => {
                            button.innerHTML = \`<img src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png" 
                                                   alt="Copy Rule" 
                                                   style="height: 16px; vertical-align: middle;"/> 复制规则集\`;
                        }, 2000);
                    } catch (err) {
                        button.textContent = '复制失败';
                        console.error('复制失败:', err);
                    }
                });
            });
        </script>
    </body>
    </html>
  `;
}

async function writeHtmlFile(html: string) {
    const htmlFilePath = path.join(OUTPUT_DIR, "index.html");
    await fs.writeFile(htmlFilePath, html, "utf8");
}

// 构建
async function build() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const tree = await walk(ROOT_DIR, REPO_URL);
    const html = generateHtml(tree);
    await writeHtmlFile(html);
}

build().catch((err) => {
    console.error("Error during build:", err);
});
