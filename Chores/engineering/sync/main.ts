// 主程序
import { REPO_PATH, ruleGroups } from './config';
import { RuleProcessor } from './ruleProcessor';
import { downloadFile, ensureDirectoryExists } from '../utils.js';
import path from 'path';

async function main() {
  const processor = new RuleProcessor(REPO_PATH);

  for (const group of ruleGroups) {
    console.log(`Processing ${group.name} rules...`);
    
    for (const rule of group.files) {
      const filePath = path.join(REPO_PATH, rule.path);
      ensureDirectoryExists(path.dirname(filePath));
      
      try {
        await downloadFile(rule.url, filePath);
        await processor.processRule(rule);
      } catch (error) {
        console.error(`Error processing ${rule.path}:`, error);
      }
    }
  }
}

main().catch(console.error); 