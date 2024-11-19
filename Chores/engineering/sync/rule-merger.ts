import { SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import fs from 'node:fs';
import path from 'node:path';
import { cleanAndSort, addRuleHeader } from './utils';

export class RuleMerger {
  constructor(
    private repoPath: string,
    private converter: RuleConverter
  ) {}

  async mergeSpecialRules(config: SpecialRuleConfig): Promise<void> {
    const { name, targetFile, sourceFiles, extraRules } = config;
    console.log(`Merging special rules: ${name}`);

    try {
      // 1. Read all source file contents
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
      mergedContent = cleanAndSort(mergedContent, this.converter, config.cleanup ?? true);

      // 5. Add header if enabled (default is true)
      if (config.header?.enable !== false) {
        mergedContent = addRuleHeader(mergedContent, {
          title: config.header?.title,
          description: config.header?.description
        });
      }

      // 6. Write merged content to target file
      const targetPath = path.join(this.repoPath, targetFile);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, mergedContent);

      console.log(`Successfully merged ${name} rules to ${targetFile}`);

      // 7. Delete source files
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
} 