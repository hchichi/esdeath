import { RuleProcessor } from './rule-processor';
import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { config, ruleGroups, specialRules } from './config';
import { ensureDirectoryExists } from './utils';
import path from 'node:path';

async function main() {
  try {
    console.log('Starting rule processing...');
    
    const converter = new RuleConverter('Surge');
    const merger = new RuleMerger(config.repoPath, converter);
    const processor = new RuleProcessor(config.repoPath, converter, merger);

    // 处理常规规则组
    for (const group of ruleGroups) {
      console.log(`Processing ${group.name} rules...`);
      
      for (const rule of group.files) {
        const filePath = path.join(config.repoPath, rule.path);
        ensureDirectoryExists(path.dirname(filePath));
        
        await processor.process(rule);
      }
    }

    // 处理特殊规则
    console.log('Processing special rules...');
    await processor.processSpecialRules(specialRules);

    console.log('Rule processing completed successfully.');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});

// 全局未处理的 Promise 拒绝处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 