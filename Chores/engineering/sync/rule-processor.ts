import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { RuleFile, SpecialRuleConfig } from './rule-types';
import fs from 'node:fs';
import path from 'node:path';
import { downloadFile,cleanAndSort,addRuleHeader } from './utils';

export class RuleProcessor {
  constructor(
    private repoPath: string,
    private converter: RuleConverter,
    private merger: RuleMerger
  ) {}

  async process(rule: RuleFile): Promise<void> {
    try {
      const filePath = path.join(this.repoPath, rule.path);
      
      // 1. 下载文件
      if (rule.url) {
        await downloadFile(rule.url, filePath);
      }

      // 2. 读取内容
      let content = await fs.promises.readFile(filePath, 'utf-8');

      // 3. 转换规则
      content = content
        .split('\n')
        .map(line => this.converter.convert(line))
        .filter(Boolean)
        .join('\n');

      // 4. 只在明确指定时才清理和排序
      if (rule.cleanup === true) {
        content = cleanAndSort(content, this.converter);
      }

      // 5. 只在明确启用时才添加规则头部信息
      if (rule.header?.enable === true) {
        const headerInfo = {
          title: rule.title,
          description: rule.description,
          url: rule.url
        };
        content = addRuleHeader(content, headerInfo);
      }

      // 6. 写入文件
      await fs.promises.writeFile(filePath, content);

    } catch (error) {
      console.error(`Error processing ${rule.path}:`, error);
      throw error;
    }
  }

  async processSpecialRules(rules: SpecialRuleConfig[]): Promise<void> {
    for (const rule of rules) {
      await this.merger.mergeSpecialRules(rule);
    }
  }
} 