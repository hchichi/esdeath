import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { RuleFile, SpecialRuleConfig } from './rule-types';
import fs from 'node:fs';
import path from 'node:path';
import { downloadFile } from './utils';
import { cleanAndSort } from './utils';

export class RuleProcessor {
  constructor(
    private repoPath: string,
    private converter?: RuleConverter,
    private merger?: RuleMerger
  ) {}

  async process(rule: RuleFile): Promise<void> {
    await this.processRule(rule);
  }

  async processSpecialRules(rules: SpecialRuleConfig[]): Promise<void> {
    for (const rule of rules) {
      await this.merger.mergeSpecialRules(rule);
    }
  }

  private async processRule(rule: RuleFile): Promise<void> {
    try {
      const filePath = path.join(this.repoPath, rule.path);
      
      // 如果文件不存在且有 URL，先下载
      if (rule.url && !fs.existsSync(filePath)) {
        await downloadFile(rule.url, filePath);
      }

      // 读取文件内容
      const content = await fs.promises.readFile(filePath, 'utf-8');
      
      // 使用 utils 中的 cleanAndSort
      const processedContent = cleanAndSort(content, this.converter);
      
      // 写入处理后的内容
      await fs.promises.writeFile(filePath, processedContent);
    } catch (error) {
      console.error(`Error processing ${rule.path}:`, error);
      throw error;
    }
  }
} 