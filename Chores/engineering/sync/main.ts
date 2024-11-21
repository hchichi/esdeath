import { RuleProcessor } from './rule-processor';
import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { ruleGroups, specialRules } from './rule-sources';
import { downloadFile, ensureDirectoryExists } from './utils';
import path from 'path';
import fs from 'fs';

async function main() {
  // 初始化 converter 并设置选项
  const converter = new RuleConverter('Surge');
  converter.setOptions({
    enableNoResolve: true,
    enablePreMatching: true,
    enableExtended: true
  });

  // 初始化 merger
  const merger = new RuleMerger(process.cwd(), converter);

  // 初始化 processor
  const processor = new RuleProcessor(
    process.cwd(),
    converter,
    merger
  );

  // 处理常规规则组
  for(const group of ruleGroups) {
    for(const file of group.files) {
      if (!file.url || !file.path) {
        console.warn(`Skipping file with missing url or path: ${JSON.stringify(file)}`);
        continue;
      }

      try {
        const content = await downloadFile(file.url, path.join(process.cwd(), file.path));
        const processed = await processor.processRuleFile(
          content,
          file.cleanup,
          file.header,
          {
            noResolve: file.noResolve,
            preMatching: file.preMatching,
            extendedMatching: file.extendedMatching
          }
        );
      
        const targetPath = path.join(process.cwd(), file.path);
        ensureDirectoryExists(path.dirname(targetPath));
        await fs.promises.writeFile(targetPath, processed);
        console.log(`Processed and saved: ${file.path}`);
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }
  }

  // 处理特殊规则
  for(const rule of specialRules) {
    try {
      const contents = await Promise.all(
        rule.sourceFiles.map(async file => {
          const filePath = path.join(process.cwd(), file);
          return fs.promises.readFile(filePath, 'utf-8');
        })
      );

      const merged = await processor.mergeRuleFiles(
        contents,
        rule.cleanup,
        rule.header,
        {
          noResolve: rule.noResolve,
          preMatching: rule.preMatching,
          extendedMatching: rule.extendedMatching
        }
      );

      const targetPath = path.join(process.cwd(), rule.targetFile);
      ensureDirectoryExists(path.dirname(targetPath));
      await fs.promises.writeFile(targetPath, merged);
      console.log(`Merged and saved: ${rule.targetFile}`);
    } catch (error) {
      console.error(`Error processing special rule ${rule.name}:`, error);
    }
  }
}

// 添加错误处理
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 