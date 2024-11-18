// 基础类型定义
export type RuleFormat = 'Surge' | 'Clash' | 'Stash' | 'Loon';

export interface RuleFile {
  path: string;
  url?: string;
  title?: string;
  description?: string;
  sources?: string[];
  cleanup?: boolean;
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
    title?: string;
    description?: string;
  };
}

export interface SpecialRuleConfig extends BaseRuleConfig {
  generateResolveVersion?: boolean;
  extraRules?: string[];
  cleanup?: boolean;
  skipCleanup?: boolean;
}

export type RuleType = 
  | 'DOMAIN'
  | 'DOMAIN-SUFFIX' 
  | 'DOMAIN-KEYWORD'
  | 'IP-CIDR'
  | 'IP-CIDR6'
  | 'GEOIP'
  | 'URL-REGEX'
  | 'USER-AGENT';

export interface RuleGroup {
  name: string;
  files: RuleFile[];
}

// ... 其他类型定义 