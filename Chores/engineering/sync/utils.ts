// 工具函数
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { RuleStats } from './types.js';

const execAsync = promisify(exec);

/**
 * 下载文件
 * @param url - 下载URL
 * @param dest - 目标路径
 */
export async function downloadFile(url: string, dest: string): Promise<void> {
  try {
    const { stderr } = await execAsync(`curl -L -o "${dest}" "${url}"`);
    if (stderr) {
      throw new Error(`下载错误: ${stderr}`);
    }
    console.log(`成功下载文件: ${url} 到 ${dest}`);
  } catch (error) {
    console.error(`下载文件失败: ${url}`, error);
    throw error;
  }
}

/**
 * 确保目录存在
 * @param dirPath - 目录路径
 */
export function ensureDirectoryExists(dirPath: string): void {
  try {
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    console.log(`确保目录存在: ${dirPath}`);
  } catch (error) {
    console.error(`创建目录失败: ${dirPath}`, error);
    throw error;
  }
}

/**
 * 获取规则统计信息
 * @param content - 规则内容
 * @returns - 规则统计
 */
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

  const stats: RuleStats = {
    domain: 0,
    domainSuffix: 0,
    domainKeyword: 0,
    ipAsn: 0,
    ipCidr: 0,
    ipCidr6: 0,
    processName: 0,
    userAgent: 0,
    urlRegex: 0,
    geoip: 0
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = content.match(pattern);
    stats[key as keyof RuleStats] = matches ? matches.length : 0;
  }

  console.log('规则统计:', stats);
  return stats;
} 