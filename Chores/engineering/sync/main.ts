import { RuleProcessor } from './rule-processor';
import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { ruleGroups, specialRules } from './rule-sources';
import { downloadFile, ensureDirectoryExists } from './utils';
import path from 'path';
import fs from 'fs';

async function main() {
  // Initialize converter and set options
  const converter = new RuleConverter('Surge');
  converter.setOptions({
    enableNoResolve: true,
    enablePreMatching: true,
    enableExtended: true
  });

  // Initialize merger
  const merger = new RuleMerger(process.cwd(), converter);

  // Initialize processor
  const processor = new RuleProcessor(
    process.cwd(),
    converter,
    merger
  );

  // Process regular rule groups
  for (const group of ruleGroups) {
    for (const file of group.files) {
      if (!file.url || !file.path) {
        console.warn(`Skipping file with missing url or path: ${JSON.stringify(file)}`);
        continue;
      }

      try {
        const targetPath = path.join(process.cwd(), file.path);

        // Ensure the directory exists before downloading
        ensureDirectoryExists(path.dirname(targetPath));

        // Download the file
        await downloadFile(file.url, targetPath);

        // Determine the file extension
        const ext = path.extname(file.path).toLowerCase();

        if (ext === '.mmdb') {
          // Binary file; skip processing
          console.log(`Skipping processing for binary file: ${file.path}`);
        } else {
          // Read the content as text
          let content = await fs.promises.readFile(targetPath, 'utf-8');

          // Process the content
          const processed = await processor.processRuleFile(
            content,
            file.cleanup,
            file.header,
            {
              noResolve: file.noResolve,
              preMatching: file.preMatching,
              extendedMatching: file.extendedMatching
            }
          );

          // Write the processed content back to the file
          await fs.promises.writeFile(targetPath, processed, 'utf-8');
          console.log(`Processed and saved: ${file.path}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
      }
    }
  }

  // Process special rules
  for (const rule of specialRules) {
    try {
      const contents = await Promise.all(
        rule.sourceFiles.map(async file => {
          const filePath = path.join(process.cwd(), file);
          return fs.promises.readFile(filePath, 'utf-8');
        })
      );

      const merged = await processor.mergeRuleFiles(
        contents,
        rule.cleanup,
        rule.header,
        {
          noResolve: rule.noResolve,
          preMatching: rule.preMatching,
          extendedMatching: rule.extendedMatching
        }
      );

      const targetPath = path.join(process.cwd(), rule.targetFile);
      ensureDirectoryExists(path.dirname(targetPath));
      await fs.promises.writeFile(targetPath, merged, 'utf-8');
      console.log(`Merged and saved: ${rule.targetFile}`);
    } catch (error) {
      console.error(`Error processing special rule ${rule.name}:`, error);
    }
  }
}

// Add error handling
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 