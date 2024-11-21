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

      // 可能的策略或标志
      let possiblePolicyOrFlag = components[2]?.trim();

      // 定义有效的策略集合
      const validPolicies = new Set([
        'REJECT', 'DIRECT', 'PROXY',
        'REJECT-DROP', 'REJECT-TINYGIF', 'REJECT-DICT', 'REJECT-ARRAY',
        // 如果有其他有效策略，请在此添加
      ]);

      // 检查可能的策略或标志是否为有效策略
      if (possiblePolicyOrFlag && validPolicies.has(possiblePolicyOrFlag.toUpperCase())) {
        policy = possiblePolicyOrFlag.toUpperCase();
        // 剩余的部分作为标志
        if (components.length > 3) {
          flags = components.slice(3).map(flag => flag.trim());
        }
      } else {
        // 没有有效的策略，可能是标志
        policy = ''; // 可以在这里设置默认策略
        flags = components.slice(2).map(flag => flag.trim());
      }
    } else {
      // 无类型的规则自动判断类型
      value = components[0].trim();

      // 处理域名规则
      // 1. 包含 '*' 的为 DOMAIN-WILDCARD
      if (value.includes('*')) {
        type = 'DOMAIN-WILDCARD';
      }
      // 2. 以 '.' 开头的为 DOMAIN-SUFFIX，去掉开头的 '.'
      else if (value.startsWith('.')) {
        type = 'DOMAIN-SUFFIX';
        value = value.substring(1);
      }
      // 3. 全数字的 IP 地址，处理为 IP 类型
      else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
        // 纯 IPv4 地址
        if (this.format === 'Surge' || this.format === 'Quantumult X') {
          type = 'IP-CIDR';
          value += '/32';
        } else if (this.format === 'Clash') {
          type = 'IP-CIDR';
        } else {
          type = 'IP-CIDR';
          value += '/32';
        }
      } else if (value.includes(':')) {
        // 纯 IPv6 地址
        if (this.format === 'Surge' || this.format === 'Quantumult X') {
          type = 'IP-CIDR6';
          value += '/128';
        } else if (this.format === 'Clash') {
          type = 'IP-CIDR6';
        } else {
          type = 'IP-CIDR6';
          value += '/128';
        }
      }
      // 4. 正则表达式，匹配以 '/' 开头和结尾的
      else if (/^\/.*\/$/.test(value)) {
        type = 'USER-AGENT'; // 或者其他合适的类型
      }
      // 5. 默认处理为 DOMAIN
      else {
        type = 'DOMAIN';
      }
    }

    // 基础类型转换
    type = type.replace(/^HOST-WILDCARD$/i, 'DOMAIN-WILDCARD')
               .replace(/^HOST-SUFFIX$/i, 'DOMAIN-SUFFIX')
               .replace(/^HOST-KEYWORD$/i, 'DOMAIN-KEYWORD')
               .replace(/^HOST$/i, 'DOMAIN')
               .replace(/^IP6-CIDR$/i, 'IP-CIDR6')
               .replace(/^GEOIP$/i, 'GEOIP')
               .replace(/^IP-ASN$/i, 'IP-ASN')
               .replace(/^DEST-PORT$/i, 'DST-PORT');

    // 处理策略转换
    if (policy) {
      policy = policy.toUpperCase();
    } else {
      // 当策略缺失时，可以设置默认策略，例如 'DIRECT'
      policy = 'DIRECT';
    }

    // 添加flags，避免重复
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

    // 避免重复添加相同的标志
    flags = Array.from(new Set(flags));

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