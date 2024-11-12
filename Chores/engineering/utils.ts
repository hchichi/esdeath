// 工具函数
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { RuleStats } from './types';

const execAsync = promisify(exec);

export async function downloadFile(url: string, dest: string): Promise<void> {
  await execAsync(`curl -L -o "${dest}" "${url}"`);
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getRuleStats(content: string): RuleStats {
  return {
    domain: (content.match(/^DOMAIN,/gm) || []).length,
    domainSuffix: (content.match(/^DOMAIN-SUFFIX,/gm) || []).length,
    domainKeyword: (content.match(/^DOMAIN-KEYWORD,/gm) || []).length,
    ipAsn: (content.match(/^IP-ASN,/gm) || []).length,
    ipCidr: (content.match(/^IP-CIDR,/gm) || []).length,
    ipCidr6: (content.match(/^IP-CIDR6,/gm) || []).length,
    processName: (content.match(/^PROCESS-NAME,/gm) || []).length,
    userAgent: (content.match(/^USER-AGENT,/gm) || []).length,
    urlRegex: (content.match(/^URL-REGEX,/gm) || []).length,
    geoip: (content.match(/^GEOIP,/gm) || []).length
  };
} 