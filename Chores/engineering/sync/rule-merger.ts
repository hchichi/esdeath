// rule-merger.ts
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

  async mergeRules(
    contents: string[],
    cleanup: boolean = false,
    header?: { enable?: boolean; title?: string; description?: string },
    flags?: { noResolve?: boolean; preMatching?: boolean; extendedMatching?: boolean },
    sourceUrls?: string[]
  ): Promise<string> {
    // 1. 设置转换器选项
    this.converter.setOptions({
      enableNoResolve: flags?.noResolve ?? false,
      enablePreMatching: flags?.preMatching ?? false,
      enableExtended: flags?.extendedMatching ?? false
    });

    // 2. 转换和合并内容
    let mergedContent = contents
      .map(content => 
        content
          .split('\n')
          .map(line => this.converter.convert(line, cleanup))
          .filter(Boolean)
          .join('\n')
      )
      .join('\n');

    // 3. 清理和排序
    if (cleanup) {
      mergedContent = cleanAndSort(mergedContent, this.converter, true);
    }

    // 4. 添加头部信息
    if (header?.enable !== false) {
      mergedContent = addRuleHeader(mergedContent, {
        title: header?.title,
        description: header?.description
      }, sourceUrls);
    }

    return mergedContent;
  }

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { 
      name, 
      targetFile, 
      sourceFiles, 
      extraRules, 
      cleanup = true,
      header,
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
          const filePath = path.join(this.repoPath, file);
          try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            // 移除现有的头部注释
            return content.replace(/^#.*\n/gm, '').trim();
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            return '';
          }
        })
      );

      // 3. 添加额外规则
      if (extraRules?.length) {
        contents.push(extraRules.join('\n'));
      }

      // 4. 合并规则
      const mergedContent = await this.mergeRules(
        contents,
        cleanup,
        header,
        {
          noResolve,
          preMatching,
          extendedMatching
        },
        sourceUrls
      );

      // 5. 写入目标文件
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, mergedContent);
      
      console.log(`Successfully merged ${name} rules to ${targetFile}`);

      // 6. 清理源文件（如果需要）
      if (config.cleanup) {
        await Promise.all(
          sourceFiles.map(async file => {
            const filePath = path.join(this.repoPath, file);
            try {
              await fs.promises.unlink(filePath);
              console.log(`Deleted source file: ${file}`);
            } catch (error) {
              console.warn(`Failed to delete source file ${file}:`, error);
            }
          })
        );
      }

    } catch (error) {
      console.error(`Error merging ${name} rules:`, error);
      throw error;
    }
  }

  private async getSourceUrls(files: string[]): Promise<string[]> {
    return files.map(file => {
      for (const group of ruleGroups) {
        const ruleFile = group.files.find(f => f.path === file);
        if (ruleFile?.url) {
          return ruleFile.url;
        }
      }
      return file;
    });
  }
}