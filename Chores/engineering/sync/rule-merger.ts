import { SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSort, generateNoResolveVersion, addRuleHeader } from './utils';
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
          // 移除现有的头部信息
          return content.replace(/^#.*\n/gm, '').trim();
        })
      );

      // 3. 合并内容
      let mergedContent = contents.join('\n');

      // 4. 添加额外规则
      if (extraRules?.length) {
        mergedContent += '\n' + extraRules.join('\n');
      }

      // 只在明确指定时才清理和排序
      if (config.cleanup === true) {
        mergedContent = cleanAndSort(mergedContent, this.converter);
      }

      // 只在明确启用时才添加规则头部信息
      if (config.header?.enable === true) {
        mergedContent = addRuleHeader(mergedContent, {
          title: config.header?.title,
          description: config.header?.description
        }, sourceUrls);
      }

      // 7. 写入合并后的内容
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, mergedContent);

      console.log(`Successfully merged ${name} rules to ${targetFile}`);
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