// 工具函数
import fs from 'node:fs';
import path from 'node:path';
import { RuleStats, RuleGroup, SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
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
export function getRuleStats(content: string | Buffer): RuleStats {
  const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);
  
  const stats: RuleStats = {
    total: 0,
    domain: 0,
    domainSuffix: 0,
    domainKeyword: 0,
    ipCidr: 0,
    ipCidr6: 0,
    userAgent: 0,
    urlRegex: 0,
    other: 0
  };

  const lines = contentStr.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  stats.total = lines.length;

  lines.forEach(line => {
    const type = line.split(',')[0]?.trim().toUpperCase();
    switch (type) {
      case 'DOMAIN':
        stats.domain++;
        break;
      case 'DOMAIN-SUFFIX':
        stats.domainSuffix++;
        break;
      case 'DOMAIN-KEYWORD':
        stats.domainKeyword++;
        break;
      case 'IP-CIDR':
        stats.ipCidr++;
        break;
      case 'IP-CIDR6':
        stats.ipCidr6++;
        break;
      case 'USER-AGENT':
        stats.userAgent++;
        break;
      case 'URL-REGEX':
        stats.urlRegex++;
        break;
      default:
        stats.other++;
    }
  });

  return stats;
}

/**
 * 清理和排序规则
 * @param content - 规则内容
 * @param converter - 可选的规则转换器
 * @returns - 清理和排序后的规则
 */
export function cleanAndSort(content: string | Buffer, converter?: RuleConverter): string {
  const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);
  
  // 将内容分行并过滤空行
  const lines = contentStr.split('\n').map(line => line.trim()).filter(Boolean);
  const rules = new Set<string>();

  for (let line of lines) {
    // 跳过注释行
    if (line.startsWith('#') || line.startsWith(';') || line.startsWith('//')) {
      continue;
    }

    // 基础清理
    line = line
      .replace(/^payload:/, '')
      .replace(/^ *- */, '')
      .replace(/(^[^#].+)\x20+\/\/.+/, '$1') // 删除行尾注释
      .replace(/(\{[0-9]+)\,([0-9]*\})/g, '$1t&zd;$2')
      .replace(/'|"/g, '')
      .trim();

    // 跳过空行或包含特殊字符的行
    if (!line || line.includes('[object Object]') || line.match(/(\[|=|{|\\|\/.*\.js)/)) {
      continue;
    }

    // 处理没有类型前缀的规则
    if (!line.includes(',')) {
      if (line.match(/[0-9]\/[0-9]/)) {
        line = 'IP-CIDR,' + line;
      } else if (line.match(/([0-9]|[a-z]):([0-9]|[a-z])/)) {
        line = 'IP-CIDR6,' + line;
      } else {
        line = 'DOMAIN,' + line;
      }
    }

    // 标准化规则类型
    line = line
      .replace(/^host-wildcard/i, 'HOST-WILDCARD')
      .replace(/^host/i, 'DOMAIN')
      .replace(/^dest-port/i, 'DST-PORT')
      .replace(/^ip6-cidr/i, 'IP-CIDR6');

    // 如果有转换器，使用转换器处理
    if (converter) {
      const processedRule = converter.convert(line);
      if (processedRule) {
        rules.add(processedRule);
      }
    } else {
      rules.add(line);
    }
  }

  // 返回排序后的规则
  return Array.from(rules)
    .sort((a, b) => {
      // 首先按规则类型排序
      const typeA = a.split(',')[0];
      const typeB = b.split(',')[0];
      if (typeA !== typeB) {
        return typeA.localeCompare(typeB);
      }
      // 然后按规则内容排序
      return a.localeCompare(b);
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
    // 只有在有 title 时才添加
    info?.title && `# ${info.title}`,
    `# UPDATED: ${timestamp}`,
    '# STATS:',
    stats.domain > 0 && `# DOMAIN: ${stats.domain}`,
    stats.domainSuffix > 0 && `# DOMAIN-SUFFIX: ${stats.domainSuffix}`,
    stats.domainKeyword > 0 && `# DOMAIN-KEYWORD: ${stats.domainKeyword}`,
    stats.ipCidr > 0 && `# IP-CIDR: ${stats.ipCidr}`,
    stats.ipCidr6 > 0 && `# IP-CIDR6: ${stats.ipCidr6}`,
    stats.userAgent > 0 && `# USER-AGENT: ${stats.userAgent}`,
    stats.urlRegex > 0 && `# URL-REGEX: ${stats.urlRegex}`,
    stats.other > 0 && `# OTHER: ${stats.other}`,
    `# TOTAL: ${stats.total}`,
    // 只有在有 description 时才添加
    info?.description && `# ${info.description}`,
    // 只有在有 sources 时才添加数据来源部分
    sources.length > 0 && [
      '# SOURCES:',
      ...sources.map(source => `#  - ${source}`)
    ],
    '########################################',
    '',
    contentStr
  ].flat().filter(Boolean);

  return headers.join('\n');
}