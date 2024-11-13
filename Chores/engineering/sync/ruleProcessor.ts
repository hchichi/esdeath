// 规则处理
import fs from 'node:fs';
import path from 'node:path';
import { RuleFile, RuleStats } from './types.js';
import { getRuleStats } from '../utils.js';

export class RuleProcessor {
  constructor(private readonly repoPath: string) {}

  async processRule(rule: RuleFile): Promise<void> {
    try {
      const filePath = path.join(this.repoPath, rule.path);
      const content = await fs.promises.readFile(filePath, 'utf8');
      
      const cleanedContent = this.cleanAndSortRules(content);
      const processedContent = this.addHeader(cleanedContent, rule);
      
      await fs.promises.writeFile(filePath, processedContent, { mode: 0o644 });
    } catch (error) {
      console.error(`处理规则 ${rule.path} 时发生错误:`, error);
      // 根据需要决定是否继续或抛出错误
      throw error;
    }
  }

  private cleanAndSortRules(content: string): string {
    return content
      .split('\n')
      .filter(line => line.trim() && !line.trim().startsWith('#'))
      .sort((a, b) => a.localeCompare(b))
      .join('\n');
  }

  private addHeader(content: string, rule: RuleFile): string {
    const stats = getRuleStats(content);
    const timestamp = new Date().toLocaleString('zh-CN', { 
      timeZone: 'Asia/Shanghai',
      hour12: false 
    });

    const headers = [
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
    ];

    return headers.join('\n');
  }

  private formatStats(stats: RuleStats): string {
    return Object.entries(stats)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => `# ${key.toUpperCase()}: ${count}`)
      .join('\n');
  }
}