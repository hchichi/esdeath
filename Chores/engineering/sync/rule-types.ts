// 基础类型定义
export type RuleFormat = 'Surge' | 'Clash' | 'Quantumult X';

export interface RuleFile {
  path: string;
  url?: string;
  title?: string;
  description?: string;
  sources?: string[];
  cleanup?: boolean;
  header?: {
    enable?: boolean;  // 默认为 false，除非明确设置为 true
  };
}

export interface RuleFlags {
  noResolve?: boolean;
  preMatching?: boolean;
  extended?: boolean;
}

export interface ParsedRule {
  type: RuleType;
  value: string;
  policy?: string;
  flags: RuleFlags;
}

export interface BaseRuleConfig {
  name: string;
  targetFile: string;
  sourceFiles: string[];
  cleanup?: boolean;
  header?: {
    enable?: boolean;
    title?: string;
    description?: string;
  };
}

export interface SpecialRuleConfig extends BaseRuleConfig {
  generateResolveVersion?: boolean;
  extraRules?: string[];
  cleanup?: boolean;
  header?: {
    enable?: boolean;
    title?: string;
    description?: string;
  };
}

export type RuleType = 
  // 域名类规则
  | 'DOMAIN'
  | 'DOMAIN-SUFFIX' 
  | 'DOMAIN-KEYWORD'
  | 'DOMAIN-SET'
  
  // IP 类规则
  | 'IP-CIDR'
  | 'IP-CIDR6'
  | 'IP-ASN'
  | 'IP-SUFFIX'
  
  // GEO 类规则
  | 'GEOIP'
  | 'GEOSITE'
  
  // 进程类规则
  | 'PROCESS-NAME'
  | 'PROCESS-PATH'
  
  // 端口类规则
  | 'DEST-PORT'
  | 'SRC-PORT'
  
  // 协议类规则
  | 'PROTOCOL'
  | 'NETWORK'
  
  // HTTP 类规则
  | 'RULE-SET'
  | 'URL-REGEX'
  | 'USER-AGENT'
  | 'HEADER'
  | 'DST-PORT'
  
  // 逻辑运算规则
  | 'AND'
  | 'OR'
  | 'NOT'
  
  // 其他规则
  | 'FINAL'
  | 'SUBNET'
  | 'IN-PORT'
  | 'SCRIPT'
  | 'RULE-SET';

export interface RuleGroup {
  name: string;
  files: RuleFile[];
}

// 同时更新 RuleStats 接口以支持统计
export interface RuleStats {
  total: number;
  // 域名类规则统计
  domain: number;
  domainSuffix: number;
  domainKeyword: number;
  domainSet: number;
  
  // IP 类规则统计
  ipCidr: number;
  ipCidr6: number;
  ipAsn: number;
  ipSuffix: number;
  
  // GEO 类规则统计
  geoip: number;
  geosite: number;
  
  // 进程类规则统计
  processName: number;
  processPath: number;
  
  // 端口类规则统计
  destPort: number;
  srcPort: number;
  
  // 协议类规则统计
  protocol: number;
  network: number;
  
  // HTTP 类规则统计
  ruleSet: number;
  urlRegex: number;
  userAgent: number;
  header: number;
  
  // 其他规则统计
  other: number;
}

// rule-types.ts
export interface GlobalConfig {
  repoPath: string;
  defaultFormat: RuleFormat;
  cleanup: boolean;
  stats: boolean;
  converter: ConverterOptions; // 将converter配置集成到全局配置中
}

export interface ConverterOptions {
  format?: RuleFormat;
  cleanup?: boolean; 
  flags?: RuleFlags;
}

// 基础配置接口
export interface BaseRuleConfig {
  name: string;
  targetFile: string;
  sourceFiles: string[];
  cleanup?: boolean;
  header?: {
    enable?: boolean;
    title?: string;
    description?: string;
  };
}

// 特殊规则配置接口
export interface SpecialRuleConfig extends BaseRuleConfig {
  generateResolveVersion?: boolean;  // 是否生成无解析版本
  extraRules?: string[];  // 额外的规则
  resolveVersionSuffix?: string;  // 无解析版本的后缀
}

// ... 其他类型定义 