import { ruleGroups, specialRules } from './rule-sources';
import { downloadFile, ensureDirectoryExists } from './utils';
import path from 'path';
import fs from 'fs'; // 添加这行

async function main() {

  // 处理常规规则组
  for(const group of ruleGroups) {
    for(const file of group.files) {
      const content = await downloadFile(file.url);
      const processed = await processor.processRuleFile(
        content,
        file.cleanup,
        file.header
      );
      
      const targetPath = path.join(process.cwd(), file.path);
      ensureDirectoryExists(path.dirname(targetPath));
      await fs.promises.writeFile(targetPath, processed);
    }
  }

  // 处理特殊规则
  for(const rule of specialRules) {
    const contents = await Promise.all(
      rule.sourceFiles.map(async file => {
        const filePath = path.join(process.cwd(), file);
        return fs.promises.readFile(filePath, 'utf-8');
      })
    );

    const merged = await processor.mergeRuleFiles(
      contents,
      rule.cleanup,
      rule.header
    );

    const targetPath = path.join(process.cwd(), rule.targetFile);
    ensureDirectoryExists(path.dirname(targetPath));
    await fs.promises.writeFile(targetPath, merged);
  }
}

main().catch(console.error); 