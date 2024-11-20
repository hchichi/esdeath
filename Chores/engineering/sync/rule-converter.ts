import { RuleFormat, RuleType, ParsedRule, RuleFlags } from './rule-types.js';

interface ConverterOptions {
  format?: RuleFormat;
  cleanup?: boolean;
}

export class RuleConverter {
  private options: ConverterOptions;
  private readonly validRuleTypes = new Set([
    'DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD',
    'IP-CIDR', 'IP-CIDR6', 'GEOIP', 'URL-REGEX',
    'USER-AGENT', 'IP-ASN', 'AND', 'OR', 'NOT',
    'DEST-PORT', 'SRC-PORT', 'PROCESS-NAME', 'IN-PORT',
    'PROTOCOL', 'RULE-SET'
  ]);

  constructor(options: ConverterOptions = {}) {
    this.options = {
      format: options.format || 'Surge',
      cleanup: options.cleanup || false
    };
  }

  convert(rule: string): string {
    if (!rule.trim() || rule.startsWith('#') || rule.startsWith(';')) {
      return this.options.cleanup ? '' : rule;
    }

    try {
      const parsed = this.parseRule(rule);
      if (!parsed) return '';
      return this.formatRule(parsed);
    } catch (e) {
      console.warn(`Failed to convert rule: ${rule}`, e);
      return '';
    }
  }

  private parseRule(rule: string): ParsedRule | null {
    const parts = rule.split(',').map(part => part.trim());
    if (parts.length < 2) return null;

    const [type, value, ...rest] = parts;
    const policy = rest.find(p => !this.isFlag(p));
    
    const flags: RuleFlags = {
      noResolve: parts.some(p => p.toLowerCase() === 'no-resolve'),
      preMatching: parts.some(p => p.toLowerCase() === 'pre-matching'),
      extended: parts.some(p => p.toLowerCase() === 'extended')
    };

    return { type, value, policy, flags };
  }

  private isFlag(part: string): boolean {
    const flags = ['no-resolve', 'pre-matching', 'extended', 'extended-matching', 'force-remote-dns'];
    return flags.includes(part.toLowerCase());
  }

  private normalizeType(type: string): RuleType {
    const upperType = type.trim().toUpperCase();
    
    // 处理特殊规则类型转换
    const typeMapping: Record<string, RuleType> = {
      'IP-SUFFIX': 'IP-CIDR',
      'DEST-PORT': 'DST-PORT',
      'SRC-IP-CIDR': 'SRC-IP',
      'IP': 'IP-CIDR',
      'DOMAIN-FULL': 'DOMAIN',
      'HOST': 'DOMAIN',
      'HOST-SUFFIX': 'DOMAIN-SUFFIX',
      'HOST-KEYWORD': 'DOMAIN-KEYWORD'
    };

    return typeMapping[upperType] || upperType as RuleType;
  }

  private formatRule(parsed: ParsedRule): string {
    const { type, value, policy, flags } = parsed;
    
    // 规范化规则类型
    const normalizedType = this.normalizeType(type);
    
    if (!this.validRuleTypes.has(normalizedType)) {
      console.warn(`Unsupported rule type: ${normalizedType}`);
      return ''; // 返回空字符串，表示该规则将被过滤掉
    }

    // 处理标志位，避免重复
    const uniqueFlags = new Set<string>();
    
    if (flags.noResolve) uniqueFlags.add('no-resolve');
    if (flags.extended) uniqueFlags.add('extended-matching');
    if (flags.preMatching) uniqueFlags.add('force-remote-dns');

    // 构建规则字符串
    const parts = [normalizedType, value];
    if (policy) parts.push(policy);
    uniqueFlags.forEach(flag => parts.push(flag));

    return parts.join(',');
  }
} 