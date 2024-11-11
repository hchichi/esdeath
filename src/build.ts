/** @format */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { promises as fs, Dirent } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = "https://raw.githubusercontent.com/hchichi/esdeath/main/";
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, "public");

// 允许的文件类型
const allowedExtensions = [".list", ".mmdb"];

// 规则分类
const RULE_CATEGORIES: { [key: string]: string } = {
  "Surge": "Surge Rules",
  "GeoIP": "GeoIP Database",
  "AI": "AI Services",
  "Apple": "Apple Services",
  "Social": "Social Media",
  "Google": "Google Services",
  "Microsoft": "Microsoft Services",
  "Oracle": "Oracle Cloud",
  "Streaming": "Streaming Media",
  "Extra": "Extra Rules",
  "Reject": "Advertising Rules",
  "Direct": "Direct Rules",
  "Anti": "Anti-IP Attribution",
  "Developer": "Developer Tools",
  "Domestic": "China Rules",
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
    
    // 跳过 src 目录和其他不需要的文件
    if (entry.name === 'src' || entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      const categoryName = RULE_CATEGORIES[entry.name] || entry.name;
      tree += `
        <div class="category">
          <h2>${categoryName}</h2>
          <div class="rules-grid">
            ${await walk(fullPath, `${baseUrl}${encodeURIComponent(entry.name)}/`)}
          </div>
        </div>`;
    } else {
      const fileExt = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.includes(fileExt)) {
        const url = `${baseUrl}${encodeURIComponent(relativePath)}`;
        const stats = await countRules(fullPath);
        
        tree += `
          <div class="rule-card">
            <div class="rule-header">
              <a href="${url}" class="rule-name" target="_blank">${entry.name}</a>
              <div class="rule-stats">
                <span title="总规则数">📋 ${stats.total}</span>
                ${stats.domain ? `<span title="域名规则">🌐 ${stats.domain}</span>` : ''}
                ${stats.domainSuffix ? `<span title="域名后缀">🔍 ${stats.domainSuffix}</span>` : ''}
                ${stats.ipCIDR || stats.ipCIDR6 ? `<span title="IP规则">🌍 ${stats.ipCIDR + stats.ipCIDR6}</span>` : ''}
              </div>
            </div>
            <div class="rule-actions">
              <button class="action-button copy-button" data-url="${url}">复制链接</button>
              <button class="action-button copy-rule-button" data-url="${url}">复制规则集</button>
            </div>
          </div>`;
      }
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
            <title>Surge Rules</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <main class="container">
                <header>
                    <h1>Surge Rules</h1>
                    <p>自动更新的 Surge 规则集</p>
                    <p>Last Build: ${new Date().toLocaleString("zh-CN", {
                        timeZone: "Asia/Shanghai",
                    })}</p>
                </header>

                <div class="search-section">
                    <input type="text" id="search" placeholder="🔍 搜索规则文件..."/>
                    <div class="tips">
                        <p>💡 使用说明：</p>
                        <ul>
                            <li>规则文件(.list)：可直接导入规则集或复制规则集配置</li>
                            <li>模块文件(.sgmodule)：可选择远程导入或本地导入</li>
                            <li>点击文件名可查看原始内容</li>
                        </ul>
                    </div>
                </div>

                ${tree}
            </main>

            <script>
                // 复制链接
                document.querySelectorAll('.copy-button').forEach(button => {
                    button.addEventListener('click', async () => {
                        const url = button.dataset.url;
                        await navigator.clipboard.writeText(url);
                        button.textContent = '已复制';
                        setTimeout(() => button.textContent = '复制链接', 2000);
                    });
                });

                // 复制规则集格式
                document.querySelectorAll('.copy-rule-button').forEach(button => {
                    button.addEventListener('click', async () => {
                        const url = button.dataset.url;
                        const ruleset = \`RULE-SET,\${url},PROXY\`;
                        await navigator.clipboard.writeText(ruleset);
                        button.textContent = '已复制';
                        setTimeout(() => button.textContent = '复制规则集', 2000);
                    });
                });

                // 搜索功能
                document.getElementById('search').addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    document.querySelectorAll('.rule-item').forEach(item => {
                        const text = item.textContent.toLowerCase();
                        item.style.display = text.includes(searchTerm) ? '' : 'none';
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
