// 定义通用类型
export interface RuleFile {
  path: string;
  url: string;
  title?: string;
  description?: string;
  sources?: string[];
}

export interface RuleGroup {
  name: string;
  files: RuleFile[];
}

export interface RuleStats {
  domain: number;
  domainSuffix: number;
  domainKeyword: number;
  ipAsn: number;
  ipCidr: number;
  ipCidr6: number;
  processName: number;
  userAgent: number;
  urlRegex: number;
  geoip: number;
} 