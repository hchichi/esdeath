import { RuleFile, SpecialRuleMerge, MergeConfig } from './types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  async mergeSpecialRules(config: SpecialRuleMerge): Promise<void> {
    const { name, targetFile, sourceFiles, extraRules } = config;
    console.log(`Merging special rules: ${name}`);

    try {
      // 读取源文件
      const contents = await this.readSourceFiles(sourceFiles);
      let mergedContent = '';

      // 根据规则类型进行特殊处理
      switch (name) {
        case 'IP':
          mergedContent = await this.mergeIPRules(contents);
          break;
        case 'Reject':
          mergedContent = await this.mergeRejectRules(contents);
          break;
        case 'CDN':
          mergedContent = await this.mergeCDNRules(contents);
          break;
        case 'AI':
          mergedContent = await this.mergeAIRules(contents, extraRules);
          break;
        default:
          mergedContent = this.mergeBasicRules(contents);
      }

      // 写入合并后的文件
      await this.writeTargetFile(targetFile, mergedContent);
      
      // 清理源文件
      if (config.cleanup !== false) {
        await this.cleanupSourceFiles(sourceFiles);
      }
    } catch (error) {
      console.error(`Error merging ${name} rules:`, error);
      throw error;
    }
  }

  private async mergeIPRules(contents: string[]): Promise<string> {
    const rules = contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        if (line.includes(':')) {
          // IPv6
          return line.startsWith('IP-CIDR6,') ? line : `IP-CIDR6,${line},no-resolve`;
        } else if (/^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/.test(line)) {
          // IPv4
          return line.startsWith('IP-CIDR,') ? line : `IP-CIDR,${line},no-resolve`;
        }
        return line;
      });

    return [...new Set(rules)].sort().join('\n');
  }

  private async mergeRejectRules(contents: string[]): Promise<string> {
    const rules = contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const rule = this.converter.convertRule(line);
        if (rule.includes('REJECT') && !rule.includes('pre-matching')) {
          return `${rule},pre-matching`;
        }
        return rule;
      });

    return [...new Set(rules)].sort().join('\n');
  }

  private async mergeCDNRules(contents: string[]): Promise<string> {
    return this.mergeBasicRules(contents);
  }

  private async mergeAIRules(contents: string[], extraRules: string[] = []): Promise<string> {
    let rules = contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => this.converter.convert(line));

    // 添加额外规则
    if (extraRules?.length) {
      rules.push(...extraRules);
    }

    return [...new Set(rules)].sort().join('\n');
  }

  private mergeBasicRules(contents: string[]): string {
    return contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => this.converter.convertRule(line))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
      .join('\n');
  }

  private async readSourceFiles(files: string[]): Promise<string[]> {
    return Promise.all(
      files.map(file => 
        fs.promises.readFile(path.join(this.repoPath, file), 'utf8')
      )
    );
  }

  private async writeTargetFile(file: string, content: string): Promise<void> {
    const targetPath = path.join(this.repoPath, file);
    await fs.promises.writeFile(targetPath, content, { mode: 0o644 });
  }

  private async cleanupSourceFiles(files: string[]): Promise<void> {
    await Promise.all(
      files.map(file =>
        fs.promises.unlink(path.join(this.repoPath, file))
          .catch(error => console.warn(`Failed to delete ${file}:`, error))
      )
    );
  }
} 