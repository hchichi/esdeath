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
    const { name, targetFile, sourceFiles, extraRules, cleanup } = config;
    console.log(`Merging special rules: ${name}`);

    try {
      // 获取源文件的下载 URL
      const sourceUrls = await this.getSourceUrls(sourceFiles);
      
      // 读取所有源文件内容
      const contents = await Promise.all(
        sourceFiles.map(file =>
          fs.promises.readFile(path.join(this.repoPath, file), 'utf-8')
        )
      );

      // 合并内容
      let mergedContent = contents.join('\n');

      // 添加额外规则
      if (extraRules?.length) {
        mergedContent += '\n' + extraRules.join('\n');
      }

      // 只在明确指定 cleanup: true 时才进行清理和排序
      if (cleanup === true) {
        mergedContent = cleanAndSort(mergedContent, this.converter);
      }

      // 添加头部注释
      if (config.header) {
        mergedContent = addRuleHeader(mergedContent, {
          title: config.header.title || `${name} Rules`,
          description: config.header.description || `Combined ${name} rules`,
          sources: sourceUrls
        });
      }

      // 写入合并后的内容
      await fs.promises.writeFile(
        path.join(this.repoPath, targetFile),
        mergedContent
      );

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