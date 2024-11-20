import { SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSort, addRuleHeader } from './utils';
import { ruleGroups } from './rule-sources'; 

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { 
      name, 
      targetFile, 
      sourceFiles, 
      extraRules, 
      cleanup,
      noResolve,
      preMatching,
      extendedMatching 
    } = config;
    
    console.log(`Merging special rules: ${name}`);

    try {
      // 1. 获取源文件的下载 URL
      const sourceUrls = await this.getSourceUrls(sourceFiles);
      
      // 2. 读取所有源文件内容
      const contents = await Promise.all(
        sourceFiles.map(async file => {
          const content = await fs.promises.readFile(
            path.join(this.repoPath, file), 
            'utf-8'
          );
          // Remove existing headers
          return content.replace(/^#.*\n/gm, '').trim();
        })
      );

      // 2. Merge contents
      let mergedContent = contents.join('\n');

      // 3. Add extra rules if provided
      if (extraRules) {
        mergedContent += '\n' + extraRules.join('\n');
      }

      // 4. Clean and sort the merged content (default is true)
      mergedContent = cleanAndSort(mergedContent, this.converter, cleanup ?? true);

      // 5. 根据配置应用规则标志
      if (noResolve || preMatching || extendedMatching) {
        mergedContent = mergedContent
          .split('\n')
          .map(line => {
            if (!line || line.startsWith('#')) return line;
            
            const parts = line.split(',');
            const type = parts[0].toUpperCase();
            const flags: string[] = [];

            // 添加 no-resolve 标志
            if (noResolve && 
                ['IP-CIDR', 'IP-CIDR6', 'GEOIP'].includes(type)) {
              flags.push('no-resolve');
            }

            // 添加 pre-matching 标志
            if (preMatching && parts[2]?.toUpperCase() === 'REJECT') {
              flags.push('pre-matching');
            }

            // 添加 extended-matching 标志
            if (extendedMatching && type.startsWith('DOMAIN')) {
              flags.push('extended-matching');
            }

            // 合并标志
            if (flags.length > 0) {
              return [...parts, ...flags].join(',');
            }
            return line;
          })
          .join('\n');
      }

      // 6. Add header
      if (config.header?.enable !== false) {
        mergedContent = addRuleHeader(mergedContent, {
          title: config.header?.title,
          description: config.header?.description
        }, sourceUrls);
      }

      // 7. Write merged content to target file
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, mergedContent);

      console.log(`Successfully merged ${name} rules to ${targetFile}`);

      // 8. Delete source files
      await Promise.all(
        sourceFiles.map(async file => {
          const filePath = path.join(this.repoPath, file);
          await fs.promises.unlink(filePath);
          console.log(`Deleted source file: ${filePath}`);
        })
      );
    } catch (error) {
      console.error(`Error merging ${name} rules:`, error);
      throw error;
    }
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