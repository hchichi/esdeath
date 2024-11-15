import { SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSort, generateNoResolveVersion, addRuleHeader } from './utils';

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { name, targetFile, sourceFiles, extraRules } = config;
    console.log(`Merging special rules: ${name}`);

    try {
      // 根据规则类型设置转换器选项
      switch (name) {
        case 'IP':
          this.converter = new RuleConverter('Surge', {
            enableNoResolve: true,
            preserveComments: false
          });
          break;
        case 'Reject':
          this.converter = new RuleConverter('Surge', {
            enablePreMatching: true,
            preserveComments: false
          });
          break;
        case 'CDN':
          this.converter = new RuleConverter('Surge', {
            enableExtended: true,
            preserveComments: false
          });
          break;
        case 'AI':
          this.converter = new RuleConverter('Surge', {
            preserveComments: false
          });
          break;
        default:
          this.converter = new RuleConverter('Surge', {
            preserveComments: true
          });
      }

      // 读取源文件
      const contents = await this.readSourceFiles(sourceFiles);
      let mergedContent = '';

      // 合并规则
      mergedContent = this.mergeBasicRules(contents);

      // 添加额外规则
      if (extraRules?.length) {
        const convertedExtraRules = extraRules.map((rule: string) => this.converter.convert(rule));
        mergedContent += '\n' + convertedExtraRules.join('\n');
      }

      // 清理和排序
      mergedContent = cleanAndSort(mergedContent, this.converter);

      // 获取源文件的下载 URL
      const sourceUrls = await this.getSourceUrls(sourceFiles);
      
      // 添加头部注释
      mergedContent = addRuleHeader(mergedContent, {
        title: config.header?.title || `${name} Rules`,
        description: config.header?.description || `${name} Rules`,
        sources: sourceUrls // 使用下载 URL 而不是文件路径
      });

      // 写入目标文件
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.writeFile(targetPath, mergedContent);

      // 生成 no-resolve 版本
      if (config.generateResolveVersion) {
        const noResolvePath = targetPath.replace('.list', '.noResolve.list');
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

  private mergeBasicRules(contents: string[]): string {
    return contents
      .join('\n')
      .split('\n')
      .filter(line => line.trim())
      .map(line => this.converter.convert(line))
      .filter(Boolean)
      .join('\n');
  }

  private async readSourceFiles(files: string[]): Promise<string[]> {
    return Promise.all(
      files.map(file => 
        fs.promises.readFile(path.join(this.repoPath, file), 'utf8')
      )
    );
  }

  private async cleanupSourceFiles(files: string[]): Promise<void> {
    await Promise.all(
      files.map(file =>
        fs.promises.unlink(path.join(this.repoPath, file))
          .catch((error: Error) => console.warn(`Failed to delete ${file}:`, error))
      )
    );
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