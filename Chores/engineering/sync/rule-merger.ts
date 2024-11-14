import { SpecialRuleConfig } from './types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSortRules } from './utils';

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  public cleanAndSort(content: string): string {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        // 保留注释但不参与排序
        if (line.startsWith('#')) return true;
        // 过滤空行和无效规则
        return line && validateRule(line);
      })
      .filter((value, index, self) => {
        // 对非注释行去重
        if (value.startsWith('#')) return true;
        return self.indexOf(value) === index;
      })
      .sort((a, b) => {
        // 注释行保持在原位置
        if (a.startsWith('#') || b.startsWith('#')) return 0;
        return a.localeCompare(b);
      })
      .join('\n');
  }

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
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
      .map(line => this.converter.convert(line))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
      .join('\n');

    return rules;
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
      .map(line => this.converter.convert(line))
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