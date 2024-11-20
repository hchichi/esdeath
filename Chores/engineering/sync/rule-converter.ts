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
      if(!line.trim() || line.startsWith('#') || line.startsWith(';')||line.startsWith('//')) {
        return '';
      }
    } else {
      // 非cleanup模式保留空格和注释
      if(!line.trim() || line.startsWith('#') || line.startsWith(';')||line.startsWith('//')) {
        return line;
      }
    }

    // 转换规则类型
    if(line.includes(',')) {
      // 有类型的规则转换
      const parts = line.split(',').map(p => p.trim());
      const [type, value, policy = ''] = parts;
      
      // 转换类型（保持现有的类型转换逻辑）
      let newType = type
        .replace(/^HOST-WILDCARD/i, 'DOMAIN-WILDCARD')
        .replace(/^HOST-SUFFIX/i, 'DOMAIN-SUFFIX')
        .replace(/^HOST-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^HOST/i, 'DOMAIN')
        .replace(/^DOMAIN-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^DOMAIN-SUFFIX/i, 'DOMAIN-SUFFIX') 
        .replace(/^DOMAIN-SET/i, 'DOMAIN-SET')
        .replace(/^DOMAIN/i, 'DOMAIN')
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
        .replace(/^PROTOCOL/i, 'PROTOCOL');

      // 转换策略（统一大写）
      let newPolicy = policy.toUpperCase();
      if(newPolicy) {
        newPolicy = newPolicy
          .replace(/^REJECT$/i, 'REJECT')
          .replace(/^REJECT-DROP$/i, 'REJECT-DROP')
          .replace(/^REJECT-TINYGIF$/i, 'REJECT-TINYGIF')
          .replace(/^DIRECT$/i, 'DIRECT')
          .replace(/^PROXY$/i, 'PROXY');
      }

      line = newPolicy ? `${newType},${value},${newPolicy}` : `${newType},${value}`;

    } else {
      // 无类型规则自动判断类型
      const value = line.trim();
      let type: string;

      if(value.includes('*')) {
        // 包含通配符
        type = 'DOMAIN-WILDCARD';
      } else if(value.includes('/')) {
        // CIDR格式
        type = value.includes(':') ? 'IP-CIDR6' : 'IP-CIDR';
      } else if(/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
        // IPv4，添加 /32
        type = 'IP-CIDR';
        line = `${value}/32`;
      } else if(value.includes(':')) {
        // IPv6，添加 /128
        type = 'IP-CIDR6';
        line = `${value}/128`;
      } else {
        // 域名
        type = 'DOMAIN';
      }

      // 保持原始格式，不添加默认策略
      line = `${type},${line}`;
    }

    return line;
  }
}