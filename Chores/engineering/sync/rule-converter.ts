import { RuleFormat, RuleType, ParsedRule, RuleFlags } from './rule-types.js';

interface ConverterOptions {
  enableNoResolve?: boolean;
  enablePreMatching?: boolean;
  enableExtended?: boolean;
  preserveComments?: boolean;
}

export class RuleConverter {
  private format: RuleFormat;
  private options: ConverterOptions;

  constructor(format: RuleFormat) {
    this.format = format;
    this.options = {};
  }

  setOptions(options: ConverterOptions) {
    this.options = { ...this.options, ...options };
  }

  convert(rule: string, cleanup: boolean = false): string {
    let line = rule;
    
    // 只在cleanup时移除空格和注释
    if(cleanup) {
      line = line.trim();
      if(line.startsWith('#') || line.startsWith(';')) {
        return '';
      }
    } else {
      // 非cleanup模式保留空格和注释
      if(!line.trim() || line.startsWith('#') || line.startsWith(';')) {
        return line;
      }
    }

    // 转换规则类型
    if(line.includes(',')) {
      // 有类型的规则转换
      line = line
        // 基础类型转换
        .replace(/^DOMAIN-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^DOMAIN-SUFFIX/i, 'DOMAIN-SUFFIX') 
        .replace(/^DOMAIN-SET/i, 'DOMAIN-SET')
        .replace(/^DOMAIN/i, 'DOMAIN')
        .replace(/^HOST-WILDCARD/i, 'HOST-WILDCARD')
        .replace(/^HOST-SUFFIX/i, 'DOMAIN-SUFFIX')
        .replace(/^HOST-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^HOST/i, 'DOMAIN')
        .replace(/^IP-CIDR6/i, 'IP-CIDR6')
        .replace(/^IP-CIDR/i, 'IP-CIDR')
        .replace(/^IP6-CIDR/i, 'IP-CIDR6')
        .replace(/^GEOIP/i, 'GEOIP')
        .replace(/^USER-AGENT/i, 'USER-AGENT')
        .replace(/^URL-REGEX/i, 'URL-REGEX')
        .replace(/^PROCESS-NAME/i, 'PROCESS-NAME')
        .replace(/^DEST-PORT/i, 'DST-PORT')
        .replace(/^SRC-PORT/i, 'SRC-PORT')
        .replace(/^SRC-IP/i, 'SRC-IP')
        .replace(/^IN-PORT/i, 'IN-PORT')
        .replace(/^PROTOCOL/i, 'PROTOCOL')
        
        // 策略转换
        .replace(/,reject$/i, ',REJECT')
        .replace(/,reject-drop$/i, ',REJECT-DROP')
        .replace(/,reject-tinygif$/i, ',REJECT-TINYGIF')
        .replace(/,reject-dict$/i, ',REJECT-DICT')
        .replace(/,reject-array$/i, ',REJECT-ARRAY')
        .replace(/,direct$/i, ',DIRECT')
        .replace(/,proxy$/i, ',PROXY');

    } else {
      // 无类型规则自动判断类型
      if(line.includes('*')) {
        // 包含通配符
        line = `DOMAIN-WILDCARD,${line}`; 
      } else if(line.includes('/')) {
        // CIDR格式
        line = line.includes(':') ? `IP-CIDR6,${line}` : `IP-CIDR,${line}`;
      } else if(/^(\d{1,3}\.){3}\d{1,3}$/.test(line)) {
        // IPv4
        line = `IP-CIDR,${line}/32`;
      } else if(line.includes(':')) {
        // IPv6
        line = `IP-CIDR6,${line}/128`;
      } else {
        // 域名
        line = `DOMAIN,${line}`;
      }
    }

    return line;
  }
}