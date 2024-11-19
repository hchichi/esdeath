import { RuleFormat, RuleType, ParsedRule, RuleFlags } from './rule-types.js';

interface ConverterOptions {
  format?: RuleFormat;
  cleanup?: boolean;
}

export class RuleConverter {
  private options: ConverterOptions;

  constructor(options: ConverterOptions = {}) {
    this.options = {
      format: options.format || 'Surge',
      cleanup: options.cleanup || false
    };
  }

  convert(rule: string): string {
    // 空行处理
    if(!rule.trim()) return rule;

    // 注释处理
    if(rule.startsWith('#') || rule.startsWith(';')) {
      return this.options.cleanup ? '' : rule;
    }

    try {
      // 解析规则
      const parsed = this.parseRule(rule);
      if(!parsed) return rule;

      // 转换规则
      return this.formatRule(parsed);
    } catch(e) {
      console.warn(`Failed to convert rule: ${rule}`, e);
      return rule;
    }
  }

  private parseRule(rule: string): ParsedRule | null {
    // 解析有类型的规则
    if(rule.includes(',')) {
      const [type, ...parts] = rule.split(',');
      const value = parts[0]?.trim();
      const policy = parts[1]?.trim();
      const flags: RuleFlags = {
        noResolve: parts.includes('no-resolve'),
        preMatching: parts.includes('pre-matching'),
        extended: parts.includes('extended')
      };

      return {
        type: this.normalizeType(type),
        value,
        policy: policy?.toUpperCase(),
        flags
      };
    }

    // 解析无类型规则
    return this.inferRuleType(rule.trim());
  }

  private normalizeType(type: string): RuleType {
    // 规则类型标准化
    const typeMap: Record<string, RuleType> = {
      'HOST': 'DOMAIN',
      'HOST-SUFFIX': 'DOMAIN-SUFFIX',
      'HOST-KEYWORD': 'DOMAIN-KEYWORD',
      'HOST-WILDCARD': 'DOMAIN',
      'DOMAIN-SET': 'DOMAIN-SET',
      'IP6-CIDR': 'IP-CIDR6',
      'IP-ASN': 'IP-ASN',
      'IP-SUFFIX': 'IP-SUFFIX',
      'DEST-PORT': 'DST-PORT',
      'SRC-PORT': 'SRC-PORT',
      'IN-PORT': 'IN-PORT',
      // ... 其他类型映射
    };

    const normalized = type.trim().toUpperCase();
    return typeMap[normalized] || normalized as RuleType;
  }

  private inferRuleType(value: string): ParsedRule {
    // 推断规则类型
    const flags: RuleFlags = {};

    if(value.includes('*')) {
      return { type: 'DOMAIN-KEYWORD', value, flags };
    }
    if(value.includes('/')) {
      const type = value.includes(':') ? 'IP-CIDR6' : 'IP-CIDR';
      return { type, value, flags: { noResolve: true } };
    }
    if(/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
      return { type: 'IP-CIDR', value: `${value}/32`, flags: { noResolve: true } };
    }
    if(value.includes(':')) {
      return { type: 'IP-CIDR6', value: `${value}/128`, flags: { noResolve: true } };
    }
    return { type: 'DOMAIN', value, flags };
  }

  private formatRule(rule: ParsedRule): string {
    const { type, value, policy, flags } = rule;
    
    let formatted = `${type},${value}`;
    
    if(policy) {
      formatted += `,${policy}`;
    }

    // 添加规则标志
    if(flags.noResolve) formatted += ',no-resolve';
    if(flags.preMatching) formatted += ',pre-matching';
    if(flags.extended) formatted += ',extended';

    return formatted;
  }
} 