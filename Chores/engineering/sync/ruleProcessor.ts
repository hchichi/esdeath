// 规则处理
import fs from 'fs';
import path from 'path';
import { RuleFile, RuleStats } from './types';
import { getRuleStats } from '../utils.js';

export class RuleProcessor {
  constructor(private repoPath: string) {}

  async processRule(rule: RuleFile): Promise<void> {
    const filePath = path.join(this.repoPath, rule.path);
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // 清理和排序规则
    const cleanedContent = this.cleanAndSortRules(content);
    
    // 添加头部信息
    const processedContent = this.addHeader(cleanedContent, rule);
    
    await fs.promises.writeFile(filePath, processedContent);
  }

  private cleanAndSortRules(content: string): string {
    return content
      .split('\n')
      .filter(line => !line.trim().startsWith('#') && line.trim())
      .sort()
      .join('\n');
  }

  private addHeader(content: string, rule: RuleFile): string {
    const stats = getRuleStats(content);
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    return [
      `# ${rule.title || path.basename(rule.path)}`,
      '#',
      `# Last Updated: ${timestamp}`,
      '#',
      '# Rule Statistics:',
      this.formatStats(stats),
      '#',
      rule.description ? `# ${rule.description}` : '',
      '#',
      '# Data from:',
      ...(rule.sources || [rule.url]).map(source => `#  - ${source}`),
      '',
      content
    ].join('\n');
  }

  private formatStats(stats: RuleStats): string {
    return Object.entries(stats)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => `# ${key.toUpperCase()}: ${count}`)
      .join('\n');
  }
}