import { SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSort, addRuleHeader } from './utils';
import { ruleGroups } from './rule-sources'; 

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { name, targetFile, sourceFiles, extraRules } = config;
    console.log(`Merging special rules: ${name}`);

    try {
      // 1. 获取源文件的下载 URL
      const sourceUrls = await this.getSourceUrls(sourceFiles);
      
      // 2. 读取所有源文件内容
      const contents = await Promise.all(
        sourceFiles.map(async file => {
          const content = await fs.promises.readFile(
            path.join(this.repoPath, file), 
            'utf-8'
          );
          // Remove existing headers
          return content.replace(/^#.*\n/gm, '').trim();
        })
      );

      // 2. Merge contents
      let mergedContent = contents.join('\n');

      // 3. Add extra rules if provided
      if (extraRules) {
        mergedContent += '\n' + extraRules.join('\n');
      }

      // 4. Clean and sort the merged content (default is true)
      mergedContent = cleanAndSort(mergedContent, this.converter, config.cleanup ?? true);

      // 5. Add header if enabled (default is true)
      if (config.header?.enable !== false) {
        mergedContent = addRuleHeader(mergedContent, {
          title: config.header?.title,
          description: config.header?.description
        }, sourceUrls);
      }

      // 6. Write merged content to target file
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, mergedContent);

      console.log(`Successfully merged ${name} rules to ${targetFile}`);

      // 7. Delete source files
      await Promise.all(
        sourceFiles.map(async file => {
          const filePath = path.join(this.repoPath, file);
          await fs.promises.unlink(filePath);
          console.log(`Deleted source file: ${filePath}`);
        })
      );
    } catch (error) {
      console.error(`Error merging ${name} rules:`, error);
      throw error;
    }
  }

  private async getSourceUrls(files: string[]): Promise<string[]> {
    // 从 ruleGroups 中查找对应文件的 URL
    const urls = files.map(file => {
      for (const group of ruleGroups) {
        const ruleFile = group.files.find(f => f.path === file);
        if (ruleFile?.url) {
          return ruleFile.url;
        }
      }
      return file; // 如果找不到 URL，返回文件路径
    });
    return urls;
  }
} 