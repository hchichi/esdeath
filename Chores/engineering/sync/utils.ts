// 工具函数
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { RuleStats } from './types.js';

const execAsync = promisify(exec);

export async function downloadFile(url: string, dest: string): Promise<void> {
  const { stderr } = await execAsync(`curl -L -o "${dest}" "${url}"`);
  if (stderr) {
    throw new Error(`Download error: ${stderr}`);
  }
}

export function ensureDirectoryExists(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
}

export function getRuleStats(content: string): RuleStats {
  const patterns = {
    domain: /^DOMAIN,/gm,
    domainSuffix: /^DOMAIN-SUFFIX,/gm,
    domainKeyword: /^DOMAIN-KEYWORD,/gm,
    ipAsn: /^IP-ASN,/gm,
    ipCidr: /^IP-CIDR,/gm,
    ipCidr6: /^IP-CIDR6,/gm,
    processName: /^PROCESS-NAME,/gm,
    userAgent: /^USER-AGENT,/gm,
    urlRegex: /^URL-REGEX,/gm,
    geoip: /^GEOIP,/gm
  };

  return Object.entries(patterns).reduce((stats, [key, pattern]) => ({
    ...stats,
    [key]: (content.match(pattern) || []).length
  }), {} as RuleStats);
} 