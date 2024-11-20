// 工具函数
import fs from 'node:fs';
import path from 'node:path';
import https from 'https';
import { RuleStats, RuleGroup, SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
/**
 * 下载文件
 * @param url - 下载URL
 * @param dest - 目标路径
 */
export async function downloadFile(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
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
export function getRuleStats(content: string | Buffer): RuleStats {
  const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);
  
  const stats: RuleStats = {
    total: 0,
    // 域名类规则统计
    domain: 0,
    domainSuffix: 0,
    domainKeyword: 0,
    domainSet: 0,
    
    // IP 类规则统计
    ipCidr: 0,
    ipCidr6: 0,
    ipAsn: 0,
    ipSuffix: 0,
    
    // GEO 类规则统计
    geoip: 0,
    geosite: 0,
    
    // 进程类规则统计
    processName: 0,
    processPath: 0,
    
    // 端口类规则统计
    destPort: 0,
    srcPort: 0,
    
    // 协议类规则统计
    protocol: 0,
    network: 0,
    
    // HTTP 类规则统计
    ruleSet: 0,
    urlRegex: 0,
    userAgent: 0,
    header: 0,
    
    // 其他规则统计
    other: 0
  };

  const lines = contentStr.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  stats.total = lines.length;

  lines.forEach(line => {
    const type = line.split(',')[0]?.trim().toUpperCase();
    switch (type) {
      // 域名类规则
      case 'DOMAIN':
        stats.domain++;
        break;
      case 'DOMAIN-SUFFIX':
        stats.domainSuffix++;
        break;
      case 'DOMAIN-KEYWORD':
        stats.domainKeyword++;
        break;
      case 'DOMAIN-SET':
        stats.domainSet++;
        break;
      
      // IP 类规则
      case 'IP-CIDR':
        stats.ipCidr++;
        break;
      case 'IP-CIDR6':
        stats.ipCidr6++;
        break;
      case 'IP-ASN':
        stats.ipAsn++;
        break;
      case 'IP-SUFFIX':
        stats.ipSuffix++;
        break;
      
      // GEO 类规则
      case 'GEOIP':
        stats.geoip++;
        break;
      case 'GEOSITE':
        stats.geosite++;
        break;
      
      // 进程类规则
      case 'PROCESS-NAME':
        stats.processName++;
        break;
      case 'PROCESS-PATH':
        stats.processPath++;
        break;
      
      // 端口类规则
      case 'DEST-PORT':
      case 'DST-PORT':
        stats.destPort++;
        break;
      case 'SRC-PORT':
        stats.srcPort++;
        break;
      
      // 协议类规则
      case 'PROTOCOL':
        stats.protocol++;
        break;
      case 'NETWORK':
        stats.network++;
        break;
      
      // HTTP 类规则
      case 'RULE-SET':
        stats.ruleSet++;
        break;
      case 'URL-REGEX':
        stats.urlRegex++;
        break;
      case 'USER-AGENT':
        stats.userAgent++;
        break;
      case 'HEADER':
        stats.header++;
        break;
      
      default:
        stats.other++;
    }
  });

  return stats;
}

/**
 * Clean and sort rules
 * @param content - The content to clean and sort
 * @param converter - The rule converter
 * @param cleanup - Whether to perform cleanup and sorting
 * @returns - Cleaned and sorted content
 */
export function cleanAndSort(content: string, converter: RuleConverter, cleanup: boolean = false): string {
  if (!cleanup) {
    // 仅去重,保留注释和空行
    return removeDuplicateRules(content);
  }
  
  // 完整清理:去重、去注释、去空行、重排序
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .sort()
    .join('\n');
}

export function removeDuplicateRules(content: string): string {
  const lines = content.split('\n');
  const uniqueLines = new Set();
  return lines
    .filter(line => {
      if(!line.trim() || line.startsWith('#')) return true;
      if(uniqueLines.has(line)) return false;
      uniqueLines.add(line);
      return true;
    })
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

/**
 * 生成无解析版本
 * @param content - 规则内容
 * @returns - 无解析版本
 */
export function generateNoResolveVersion(content: string): string {
  return content
    .split('\n')
    .map(line => {
      if (line.startsWith('IP-CIDR') && !line.includes('no-resolve')) {
        return `${line},no-resolve`;
      }
      return line;
    })
    .join('\n');
}

interface HeaderInfo {
  title?: string;
  description?: string;
  url?: string;
}

/**
 * 添加规则文件头部注释
 * @param content - 规则内容
 * @param info - 头部信息
 * @param sourceUrls - 源文件URLs（用于合并规则）
 */
export function addRuleHeader(content: string | Buffer, info?: HeaderInfo, sourceUrls?: string[]): string {
  const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);
  
  const stats = getRuleStats(contentStr);
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  // 收集所有有效的 URLs 并去重
  const sources = [...new Set([
    info?.url,           // 单个规则的 URL
    ...(sourceUrls || []) // 合并规则的源文件 URLs
  ].filter(Boolean))];
  
  const headers = [
    '########################################',
    info?.title && `# ${info.title}`,
    `# Last updated: ${timestamp}`,
    
    // 域名类规则
    stats.domain > 0 && `# DOMAIN: ${stats.domain}`,
    stats.domainSuffix > 0 && `# DOMAIN-SUFFIX: ${stats.domainSuffix}`,
    stats.domainKeyword > 0 && `# DOMAIN-KEYWORD: ${stats.domainKeyword}`,
    stats.domainSet > 0 && `# DOMAIN-SET: ${stats.domainSet}`,
    
    // IP 类规则
    stats.ipCidr > 0 && `# IP-CIDR: ${stats.ipCidr}`,
    stats.ipCidr6 > 0 && `# IP-CIDR6: ${stats.ipCidr6}`,
    stats.ipAsn > 0 && `# IP-ASN: ${stats.ipAsn}`,
    stats.ipSuffix > 0 && `# IP-SUFFIX: ${stats.ipSuffix}`,
    
    // GEO 类规则
    stats.geoip > 0 && `# GEOIP: ${stats.geoip}`,
    stats.geosite > 0 && `# GEOSITE: ${stats.geosite}`,
    
    // 进程类规则
    stats.processName > 0 && `# PROCESS-NAME: ${stats.processName}`,
    stats.processPath > 0 && `# PROCESS-PATH: ${stats.processPath}`,
    
    // 端口类规则
    stats.destPort > 0 && `# DEST-PORT: ${stats.destPort}`,
    stats.srcPort > 0 && `# SRC-PORT: ${stats.srcPort}`,
    
    // 协议类规则
    stats.protocol > 0 && `# PROTOCOL: ${stats.protocol}`,
    stats.network > 0 && `# NETWORK: ${stats.network}`,
    
    // HTTP 类规则
    stats.ruleSet > 0 && `# RULE-SET: ${stats.ruleSet}`,
    stats.urlRegex > 0 && `# URL-REGEX: ${stats.urlRegex}`,
    stats.userAgent > 0 && `# USER-AGENT: ${stats.userAgent}`,
    stats.header > 0 && `# HEADER: ${stats.header}`,
    
    stats.other > 0 && `# OTHER: ${stats.other}`,
    `# Total: ${stats.total}`,
    
    // 只有在有 description 时才添加
    info?.description && `# ${info.description}`,
    // 只有在有 sources 时才添加数据来源部分
    sources.length > 0 && [
      '# Data sources:',
      ...sources.map(source => `#  - ${source}`)
    ],
    '########################################',
    '',
    contentStr
  ].flat().filter(Boolean);

  return headers.join('\n');
}

/**
 * 检查主机名是否为 IPv4 地址
 * 此实现针对已确认为有效主机名的情况优化
 */
export function isProbablyIpv4(hostname: string): boolean {
  // IPv4 长度检查: 最短 1.1.1.1, 最长 255.255.255.255
  if (hostname.length < 7 || hostname.length > 15) {
    return false;
  }

  let numberOfDots = 0;

  // 使用 charCode 检查而不是正则,性能更好
  for (let i = 0; i < hostname.length; i++) {
    const code = hostname.charCodeAt(i);

    if (code === 46) { // '.' 的 charCode
      numberOfDots++;
    } else if (code < 48 || code > 57) { // 非数字
      return false;
    }
  }

  // 确保有3个点且首尾不是点
  return (
    numberOfDots === 3 
    && hostname.charCodeAt(0) !== 46
    && hostname.charCodeAt(hostname.length - 1) !== 46
  );
}

/**
 * 检查主机名是否为 IPv6 地址
 * 支持标准格式和方括号格式
 */
export function isProbablyIpv6(hostname: string): boolean {
  if (hostname.length < 3) {
    return false;
  }

  // 处理可能的方括号
  let start = hostname[0] === '[' ? 1 : 0;
  let end = hostname.length;
  if (hostname[end - 1] === ']') {
    end--;
  }

  // 标准 IPv6 最大长度检查
  if (end - start > 39) {
    return false;
  }

  let hasColon = false;

  for (; start < end; start++) {
    const code = hostname.charCodeAt(start);

    if (code === 58) { // ':' 的 charCode
      hasColon = true;
    } else if (!(
      (code >= 48 && code <= 57) || // 0-9
      (code >= 97 && code <= 102) || // a-f
      (code >= 65 && code <= 70) // A-F
    )) {
      return false;
    }
  }

  return hasColon;
}