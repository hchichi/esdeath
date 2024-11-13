// 主程序
import { REPO_PATH, ruleGroups } from './config';
import { RuleProcessor } from './ruleProcessor';
import { downloadFile, ensureDirectoryExists } from './utils';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    const processor = new RuleProcessor(REPO_PATH);
    
    await Promise.all(ruleGroups.map(async (group) => {
      console.log(`Processing ${group.name} rules...`);
      
      await Promise.all(group.files.map(async (rule) => {
        const filePath = path.join(REPO_PATH, rule.path);
        ensureDirectoryExists(path.dirname(filePath));
        
        try {
          await downloadFile(rule.url, filePath);
          await processor.processRule(rule);
        } catch (error) {
          console.error(`Error processing ${rule.path}:`, error);
        }
      }));
    }));
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