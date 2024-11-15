import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { RuleFile, SpecialRuleConfig } from './rule-types';
import fs from 'node:fs';
import path from 'node:path';
import { downloadFile } from './utils';
import { getRuleStats } from './utils';

export class RuleProcessor {
  constructor(
    private repoPath: string,
    private converter: RuleConverter,
    private merger: RuleMerger
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
      
      // 清理和排序规则
      const cleanedContent = this.merger.cleanAndSort(content);
      
      // 写入处理后的内容
      await fs.promises.writeFile(filePath, cleanedContent);
    } catch (error) {
      console.error(`Error processing ${rule.path}:`, error);
      throw error;
    }
  }

  private convertRules(content: string): string {
    return content
      .split('\n')
      .map(line => this.converter.convert(line))
      .join('\n');
  }

  private addHeader(content: string, rule: RuleFile): string {
    const stats = getRuleStats(content);
    const timestamp = new Date().toISOString();
    
    const headers = [
      `# ${rule.title || path.basename(rule.path)}`,
      rule.description && `# ${rule.description}`,
      '',
      '# Rule Statistics:',
      `# Total: ${stats.total}`,
      `# Domain: ${stats.domain}`,
      `# Domain Suffix: ${stats.domainSuffix}`,
      `# Domain Keyword: ${stats.domainKeyword}`,
      `# IP-CIDR: ${stats.ipCidr}`,
      `# IP-CIDR6: ${stats.ipCidr6}`,
      `# User Agent: ${stats.userAgent}`,
      `# URL Regex: ${stats.urlRegex}`,
      `# Other: ${stats.other}`,
      '',
      '# Source:',
      ...(rule.sources || [rule.url]).filter(Boolean).map(source => `# - ${source}`),
      '',
      `# Updated: ${timestamp}`,
      '',
      content
    ].filter(Boolean);

    return headers.join('\n');
  }
} 