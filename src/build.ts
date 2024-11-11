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

// 生成目录树
async function walk(dir: string, baseUrl: string) {
  let tree = "";
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath);
    const url = `${baseUrl}${encodeURIComponent(relativePath)}`;

    if (entry.name === 'src' || entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory() && allowedDirectories.includes(entry.name)) {
      tree += `
        <li class="folder">
          ${entry.name}
          <ul>
            ${await walk(fullPath, baseUrl)}
          </ul>
        </li>
      `;
    } else if (allowedExtensions.includes(path.extname(entry.name).toLowerCase())) {
      tree += `
        <li>
          <a class="file" href="${url}" target="_blank">${entry.name}
            <button class="copy-button" data-url="${url}" style="border: none; background: none; padding: 0; cursor: pointer;">
              <img
                alt="复制链接"
                title="复制链接"
                style="height: 22px"
                src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png"
              />
            </button>
          </a>
        </li>
      `;
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
        <link rel="stylesheet" href="https://cdn.skk.moe/ruleset/css/21d8777a.css" />
        <style>
          /* ... 之前的样式保持不变 ... */
        </style>
    </head>
    <body>
    <main class="container">
        <h1>Surge Rules Repository</h1>
        <p>Last Updated: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
        
        <div class="search-section">
          <input type="text" id="search" placeholder="🔍 搜索文件和文件夹..."/>
          <span>ℹ️ 复制链接说明</span>
          <br>
          <small>
            <img
              alt="复制链接"
              title="复制链接"
              style="height: 22px"
              src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png"
            />
            点击此图标可复制规则文件链接
          </small>
        </div>

        <ul class="directory-list">
          ${tree}
        </ul>
    </main>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        // 搜索功能保持不变...

        // 添加复制链接功能
        document.querySelectorAll('.copy-button').forEach(button => {
          button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = button.dataset.url;
            try {
              await navigator.clipboard.writeText(url);
              const img = button.querySelector('img');
              const originalTitle = img.title;
              img.title = '复制成功!';
              setTimeout(() => {
                img.title = originalTitle;
              }, 2000);
            } catch (err) {
              console.error('复制失败:', err);
              const img = button.querySelector('img');
              img.title = '复制失败';
            }
          });
        });

        // 文件夹折叠功能保持不变...
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
