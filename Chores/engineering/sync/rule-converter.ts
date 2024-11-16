import { RuleFormat, RuleType, ParsedRule, RuleFlags } from './rule-types.js';

interface ConverterOptions {
  enableNoResolve?: boolean;
  enablePreMatching?: boolean;
  enableExtended?: boolean;
  preserveComments?: boolean;
}

export class RuleConverter {
  private options: ConverterOptions = {
    preserveComments: true
  };

  constructor(
    private format: RuleFormat,
    options: ConverterOptions = {}
  ) {
    this.options = { ...this.options, ...options };
  }
  
  convert(rule: string): string {
    // 处理注释
    if (rule.startsWith('#')) {
      return this.options.preserveComments ? rule : '';
    }

    if (!rule.trim()) return '';

    // 处理 domain-set 格式转换为 rule-set
    if (rule.startsWith('.')) {
      // domain-set 中的 .xxx.com 转换为 DOMAIN-SUFFIX
      return `DOMAIN-SUFFIX,${rule.slice(1)}`;
    } else if (this.isDomain(rule) && !rule.includes(',')) {
      // 纯域名转换为 DOMAIN
      return `DOMAIN,${rule}`;
    }

    // 处理纯 IP 地址
    if (this.isIPv4(rule)) {
      return `IP-CIDR,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }
    if (this.isIPv6(rule)) {
      return `IP-CIDR6,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }

    // 处理已有规则的转换
    const parsed = this.parseRule(rule);
    if (!parsed) return rule;

    // 处理规则标记
    this.processFlags(parsed);
    return this.generateRule(parsed);
  }

  private isIPv4(str: string): boolean {
    return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(str);
  }

  private isIPv6(str: string): boolean {
    return /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}(\/\d{1,3})?$/.test(str);
  }

  private isDomain(str: string): boolean {
    return /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(str);
  }

  private parseRule(rule: string): ParsedRule | null {
    const parts = rule.split(',').map(p => p.trim());
    
    if (parts.length < 2) {
      return {
        type: 'DOMAIN',
        value: parts[0],
        flags: this.parseFlags([])
      };
    }

    return {
      type: parts[0] as RuleType,
      value: parts[1],
      policy: parts[2],
      flags: this.parseFlags(parts.slice(3))
    };
  }

  private processFlags(rule: ParsedRule): void {
    // 处理 no-resolve
    if (rule.type.startsWith('IP-')) {
      rule.flags.noResolve = this.options.enableNoResolve ?? false;
    }

    // 处理 extended-matching (SNI)
    if (this.format === 'Surge' && !rule.type.startsWith('IP-')) {
      rule.flags.extended = this.options.enableExtended ?? false;
    }

    // 处理 pre-matching
    if (rule.policy?.toUpperCase().startsWith('REJECT')) {
      const validTypes = [
        'DOMAIN',
        'DOMAIN-SUFFIX',
        'DOMAIN-KEYWORD',
        'IP-CIDR',
        'IP-CIDR6',
        'GEOIP',
        'IP-ASN'
      ];
      if (validTypes.includes(rule.type)) {
        rule.flags.preMatching = this.options.enablePreMatching ?? false;
      }
    }
  }

  private parseFlags(flags: string[]): RuleFlags {
    return {
      noResolve: flags.includes('no-resolve'),
      preMatching: flags.includes('pre-matching'),
      extended: flags.includes('extended-matching')
    };
  }

  private generateRule(rule: ParsedRule): string {
    const flags: string[] = [];
    
    // 按照特定顺序添加标记
    if (rule.flags.noResolve) flags.push('no-resolve');
    if (rule.flags.preMatching) flags.push('pre-matching');
    if (rule.flags.extended) flags.push('extended-matching');

    const parts = [rule.type, rule.value];
    if (rule.policy) parts.push(rule.policy);
    if (flags.length > 0) parts.push(...flags);

    return parts.join(',');
  }
} 