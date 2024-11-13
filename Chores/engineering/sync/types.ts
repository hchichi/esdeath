// 基础类型定义
export type RuleFormat = 'Surge' | 'Clash' | 'Stash' | 'Loon';

export interface RuleFile {
  path: string;
  url?: string;
  title?: string;
  description?: string;
  sources?: string[];
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

export interface MergeConfig {
  name: string;
  targetFile: string;
  sourceFiles: string[];
  cleanup?: boolean;
  header?: {
    title?: string;
    description?: string;
  };
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

export interface IPRuleConfig extends MergeConfig {
  generateResolveVersion?: boolean;
}

export interface SpecialRuleConfig {
  name: string;
  targetFile: string;
  sourceFiles: string[];
  cleanup?: boolean;
  generateResolveVersion?: boolean;
  extraRules?: string[];
  header?: {
    title?: string;
    description?: string;
  };
}

export interface RuleGroup {
  name: string;
  files: RuleFile[];
}

// ... 其他类型定义 