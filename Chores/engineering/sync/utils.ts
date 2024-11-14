// 工具函数
import fs from 'node:fs';
import path from 'node:path';
import { RuleStats, RuleGroup, SpecialRuleConfig } from './types';

/**
 * 下载文件
 * @param url - 下载URL
 * @param dest - 目标路径
 */
export async function downloadFile(url: string, dest: string): Promise<void> {
  try {
    console.log(`Downloading ${url} to ${dest}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    await fs.promises.writeFile(dest, Buffer.from(buffer));
    console.log(`Downloaded: ${url}`);
  } catch (error) {
    console.error(`Download failed: ${url}`, error);
    throw error;
  }
}

/**
 * 确保目录存在
 * @param dirPath - 目录路径
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
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

/**
 * 清理和排序规则
 * @param content - 规则内容
 * @returns - 清理和排序后的规则
 */
export function cleanAndSortRules(content: string): string {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .sort()
    .join('\n');
}

/**
 * 验证规则
 * @param rule - 规则
 * @returns - 是否有效
 */
export function validateRule(rule: string): boolean {
  const validRuleTypes = [
    'DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD',
    'IP-CIDR', 'IP-CIDR6', 'GEOIP', 'URL-REGEX',
    'USER-AGENT', 'IP-ASN', 'AND', 'OR', 'NOT'
  ];
  
  const type = rule.split(',')[0]?.trim().toUpperCase();
  return validRuleTypes.includes(type);
}

/**
 * 初始化目录结构
 * @param repoPath - 仓库路径
 * @param ruleGroups - 规则组
 * @param specialRules - 特殊规则
 */
export function initializeDirectoryStructure(
  repoPath: string, 
  ruleGroups: RuleGroup[], 
  specialRules: SpecialRuleConfig[]
): void {
  // 从常规规则组收集目录
  const groupDirs = ruleGroups.flatMap(group => 
    group.files.map(file => path.dirname(file.path))
  );

  // 从特殊规则收集目录
  const specialDirs = specialRules.map(rule => 
    path.dirname(rule.targetFile)
  );

  // 合并所有目录并去重
  const allDirs = [...new Set([...groupDirs, ...specialDirs])];

  // 创建目录
  for (const dir of allDirs) {
    const fullPath = path.join(repoPath, dir);
    ensureDirectoryExists(fullPath);
  }
}