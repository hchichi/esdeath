import { SpecialRuleConfig } from './types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSortRules, generateNoResolveVersion } from './utils';

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {
    this.converter = new RuleConverter('Surge', {
      forceNoResolve: true,
      preservePreMatching: true,
      preserveExtended: true
    });
  }

  public cleanAndSort(content: string): string {
    return cleanAndSortRules(content);
  }

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { name, targetFile, sourceFiles, extraRules, generateResolveVersion } = config;
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
        case 'NeteaseMusic':
          mergedContent = await this.mergeNeteaseMusicRules(contents);
          break;
        default:
          mergedContent = this.mergeBasicRules(contents);
      }

      // 清理和排序合并后的内容
      mergedContent = cleanAndSort(mergedContent, this.converter);

      // 写入合并后的文件
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.writeFile(targetPath, mergedContent);

      // 如果需要生成no-resolve版本
      if (generateResolveVersion) {
        const noResolvePath = targetPath.replace('.list', '.no-resolve.list');
        const noResolveContent = generateNoResolveVersion(mergedContent);
        await fs.promises.writeFile(noResolvePath, noResolveContent);
      }

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
    this.converter.options = {
      ...this.converter.options,
      enablePreMatching: true,
      preserveComments: false
    };

    return this.mergeBasicRules(contents);
  }

  private async mergeCDNRules(contents: string[]): Promise<string> {
    this.converter.options = {
      ...this.converter.options,
      preserveComments: false,
      enableExtended: true
    };

    return this.mergeBasicRules(contents);
  }

  private async mergeAIRules(contents: string[], extraRules: string[] = []): Promise<string> {
    this.converter.options = {
      ...this.converter.options,
      preserveComments: false
    };

    const rules = contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => this.converter.convert(line));

    return [...new Set([...rules, ...extraRules])].sort().join('\n');
  }

  private async mergeNeteaseMusicRules(contents: string[]): Promise<string> {
    const rules = contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => this.converter.convert(line))
      .filter(Boolean);

    const extraRules = [
      'USER-AGENT,NeteaseMusic*,MUSIC',
      'USER-AGENT,%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90*,MUSIC'
    ];

    return [...new Set([...rules, ...extraRules])].sort().join('\n');
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