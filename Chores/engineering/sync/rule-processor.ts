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
      // 确保 converter 存在且已初始化
      if (!this.converter) {
        throw new Error('Rule converter not initialized');
      }

      // 下载规则文件
      if (rule.url) {
        await downloadFile(rule.url, path.join(this.repoPath, rule.path));
      }

      // 读取文件内容
      let content = await fs.promises.readFile(
        path.join(this.repoPath, rule.path),
        'utf-8'
      );

      // 转换规则时，如果需要清理，则不保留注释
      if (rule.cleanup === true) {
        this.converter.setOptions({ preserveComments: false });
      } else {
        this.converter.setOptions({ preserveComments: true });
      }

      content = content
        .split('\n')
        .map(line => this.converter.convert(line))
        .filter(Boolean)
        .join('\n');

      // 清理和排序
      if (rule.cleanup === true) {
        content = cleanAndSort(content, this.converter);
      }

      // 添加规则头
      const header = await addRuleHeader(rule);
      
      // 处理规则内容
      let processedContent = header + '\n' + content;

      // 写入文件
      await fs.promises.writeFile(
        path.join(this.repoPath, rule.path),
        processedContent
      );
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