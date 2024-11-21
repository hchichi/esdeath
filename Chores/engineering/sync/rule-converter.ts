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
    if (cleanup) {
      line = line.trim();
      if (line.startsWith('#') || line.startsWith(';') || line.startsWith('//')) {
        return '';
      }
    } else {
      // 非cleanup模式保留空格和注释
      if (!line.trim() || line.startsWith('#') || line.startsWith(';') || line.startsWith('//')) {
        return line;
      }
    }

    // 解析规则及参数
    let type = '';
    let value = '';
    let policy = '';
    let flags: string[] = [];

    // 处理规则行，提取类型、值、策略和标志
    let components = line.split(',');
    if (components.length >= 2) {
      type = components[0].trim().toUpperCase();
      value = components[1].trim();

      // 检查是否有策略
      if (components.length >= 3) {
        policy = components[2].trim().toUpperCase();
      }

      // 检查是否有flags
      if (components.length > 3) {
        flags = components.slice(3).map(flag => flag.trim());
      }
    } else {
      // 无类型的规则自动判断类型
      value = components[0].trim();
      if (value.includes('*')) {
        // 包含通配符
        type = 'DOMAIN-WILDCARD';
      } else if (value.includes('/')) {
        // CIDR格式
        type = value.includes(':') ? 'IP-CIDR6' : 'IP-CIDR';
      } else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
        // IPv4
        type = 'IP-CIDR';
        value += '/32';
      } else if (value.includes(':')) {
        // IPv6
        type = 'IP-CIDR6';
        value += '/128';
      } else {
        // 域名
        type = 'DOMAIN';
      }
    }

    // 基础类型转换
    type = type.replace(/^HOST-WILDCARD$/i, 'DOMAIN-WILDCARD')
               .replace(/^HOST-SUFFIX$/i, 'DOMAIN-SUFFIX')
               .replace(/^HOST-KEYWORD$/i, 'DOMAIN-KEYWORD')
               .replace(/^HOST$/i, 'DOMAIN')
               .replace(/^IP6-CIDR$/i, 'IP-CIDR6')
               .replace(/^IP-CIDR6$/i, 'IP-CIDR6')
               .replace(/^GEOIP$/i, 'GEOIP')
               .replace(/^IP-ASN$/i, 'IP-ASN')
               .replace(/^DEST-PORT$/i, 'DST-PORT');

    // 处理策略转换
    if (policy) {
      policy = policy.replace(/^REJECT$/i, 'REJECT')
                     .replace(/^REJECT-DROP$/i, 'REJECT-DROP')
                     .replace(/^REJECT-TINYGIF$/i, 'REJECT-TINYGIF')
                     .replace(/^REJECT-DICT$/i, 'REJECT-DICT')
                     .replace(/^REJECT-ARRAY$/i, 'REJECT-ARRAY')
                     .replace(/^DIRECT$/i, 'DIRECT')
                     .replace(/^PROXY$/i, 'PROXY');
    } else {
      policy = ''; // 可以设置为默认策略
    }

    // 添加flags
    if (this.options.enableNoResolve && ['IP-CIDR', 'IP-CIDR6', 'GEOIP', 'IP-ASN'].includes(type)) {
      if (!flags.includes('no-resolve')) {
        flags.push('no-resolve');
      }
    }

    if (this.options.enablePreMatching && policy === 'REJECT') {
      // 仅当策略为 REJECT 时，才添加 pre-matching
      if (!flags.includes('pre-matching')) {
        flags.push('pre-matching');
      }
    }

    if (this.options.enableExtended && ['DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN-WILDCARD'].includes(type)) {
      if (!flags.includes('extended-matching')) {
        flags.push('extended-matching');
      }
    }

    // 重组规则
    let convertedRule = [type, value];
    if (policy) {
      convertedRule.push(policy);
    }
    if (flags.length > 0) {
      convertedRule = convertedRule.concat(flags);
    }

    return convertedRule.join(',');
  }
}