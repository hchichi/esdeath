// rule-types.ts
export interface RuleConfig {
  path: string;
  url: string;
  title?: string; 
  description?: string;
  cleanup?: boolean;
  header?: {
    enable?: boolean;
    title?: string;
    description?: string;
  }
}

export interface RuleGroup {
  name: string;
  files: RuleConfig[];
}

export interface SpecialRuleConfig extends RuleConfig {
  name: string;
  targetFile: string;
  sourceFiles: string[];
  extraRules?: string[];
}

export interface RuleStats {
  total: number;
  domain: number;
  domainSuffix: number; 
  domainKeyword: number;
  domainSet: number;
  ipCidr: number;
  ipCidr6: number;
  ipAsn: number;
  ipSuffix: number;
  geoip: number;
  geosite: number;
  processName: number;
  processPath: number;
  destPort: number;
  srcPort: number;
  protocol: number;
  network: number;
  ruleSet: number;
  urlRegex: number;
  userAgent: number;
  header: number;
  other: number;
}

export interface RuleOptions {
  noResolve?: boolean;
  preMatching?: boolean;
  extendedMatching?: boolean;
}