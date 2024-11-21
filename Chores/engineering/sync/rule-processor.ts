// rule-processor.ts
import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { RuleFile, SpecialRuleConfig } from './rule-types';
import fs from 'node:fs';
import path from 'node:path';
import { downloadFile, cleanAndSort, addRuleHeader } from './utils';

export class RuleProcessor {
  constructor(
    private repoPath: string,
    private converter: RuleConverter,
    private merger: RuleMerger
  ) {}

  async processRuleFile(
    content: string,
    cleanup: boolean = false,
    header?: { enable?: boolean; title?: string; description?: string },
    flags?: { noResolve?: boolean; preMatching?: boolean; extendedMatching?: boolean }
  ): Promise<string> {
    try {
      // 1. 设置转换器选项
      this.converter.setOptions({
        enableNoResolve: flags?.noResolve ?? false,
        enablePreMatching: flags?.preMatching ?? false,
        enableExtended: flags?.extendedMatching ?? false
      });

      // 2. 转换规则
      let processedContent = content
        .split('\n')
        .map(line => this.converter.convert(line, cleanup))
        .filter(Boolean)
        .join('\n');

      // 3. 清理和排序
      if (cleanup) {
        processedContent = cleanAndSort(processedContent, this.converter, true);
      }

      // 4. 添加头部信息
      if (header?.enable !== false) {
        processedContent = addRuleHeader(processedContent, {
          title: header?.title,
          description: header?.description
        });
      }

      return processedContent;
    } catch (error) {
      console.error('Error processing rule file:', error);
      throw error;
    }
  }

  async mergeRuleFiles(
    contents: string[],
    cleanup: boolean = false,
    header?: { enable?: boolean; title?: string; description?: string },
    flags?: { noResolve?: boolean; preMatching?: boolean; extendedMatching?: boolean }
  ): Promise<string> {
    try {
      // 1. 设置转换器选项
      this.converter.setOptions({
        enableNoResolve: flags?.noResolve ?? false,
        enablePreMatching: flags?.preMatching ?? false,
        enableExtended: flags?.extendedMatching ?? false
      });

      // 2. 处理每个文件内容
      const processedContents = contents.map(content => 
        content
          .split('\n')
          .map(line => this.converter.convert(line, cleanup))
          .filter(Boolean)
          .join('\n')
      );

      // 3. 合并内容
      let mergedContent = processedContents.join('\n');

      // 4. 清理和排序
      if (cleanup) {
        mergedContent = cleanAndSort(mergedContent, this.converter, true);
      }

      // 5. 添加头部信息
      if (header?.enable !== false) {
        mergedContent = addRuleHeader(mergedContent, {
          title: header?.title,
          description: header?.description
        });
      }

      return mergedContent;
    } catch (error) {
      console.error('Error merging rule files:', error);
      throw error;
    }
  }

  async processRuleGroup(
    files: RuleFile[],
    cleanup: boolean = false,
    header?: { enable?: boolean; title?: string; description?: string },
    flags?: { noResolve?: boolean; preMatching?: boolean; extendedMatching?: boolean }
  ): Promise<void> {
    try {
      console.log('Processing rule group...');

      // 1. 下载和处理每个规则文件
      const processedContents = await Promise.all(
        files.map(async file => {
          const { path: filePath, url } = file;
          console.log(`Processing file: ${filePath}`);

          // 下载文件
          if (url) {
            const targetPath = path.join(this.repoPath, filePath);
            await downloadFile(url, targetPath);
          }

          // 读取文件内容
          const content = await fs.promises.readFile(
            path.join(this.repoPath, filePath),
            'utf-8'
          );

          // 处理规则
          return this.processRuleFile(content, cleanup, header, flags);
        })
      );

      // 2. 合并处理后的内容
      const mergedContent = await this.mergeRuleFiles(
        processedContents,
        cleanup,
        header,
        flags
      );

      // 3. 写入合并后的文件
      if (files.length > 0) {
        const targetPath = path.join(this.repoPath, files[0].path);
        await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.promises.writeFile(targetPath, mergedContent);
        console.log(`Successfully processed and merged rules to ${files[0].path}`);
      }
    } catch (error) {
      console.error('Error processing rule group:', error);
      throw error;
    }
  }

  async processSpecialRules(rules: SpecialRuleConfig[]): Promise<void> {
    try {
      console.log('Processing special rules...');
      
      for (const rule of rules) {
        console.log(`Processing special rule: ${rule.name}`);
        await this.merger.mergeSpecialRules(rule);
      }
      
      console.log('Completed processing special rules');
    } catch (error) {
      console.error('Error processing special rules:', error);
      throw error;
    }
  }

  async downloadAndProcessFile(
    url: string,
    targetPath: string,
    cleanup: boolean = false,
    header?: { enable?: boolean; title?: string; description?: string },
    flags?: { noResolve?: boolean; preMatching?: boolean; extendedMatching?: boolean }
  ): Promise<void> {
    try {
      console.log(`Downloading and processing file from ${url}`);

      // 1. 下载文件
      const content = await downloadFile(url, targetPath);

      // 2. 处理规则
      const processedContent = await this.processRuleFile(
        content,
        cleanup,
        header,
        flags
      );

      // 3. 写入处理后的文件
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, processedContent);
      
      console.log(`Successfully processed file: ${targetPath}`);
    } catch (error) {
      console.error(`Error processing file from ${url}:`, error);
      throw error;
    }
  }
}