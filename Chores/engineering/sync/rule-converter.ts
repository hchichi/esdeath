import { RuleFormat, ParsedRule, RuleFlags } from './types';

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

    // 处理纯 IP 地址
    if (this.isIPv4(rule)) {
      return `IP-CIDR,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }
    if (this.isIPv6(rule)) {
      return `IP-CIDR6,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }

    // 处理域名
    if (this.isDomain(rule)) {
      if (rule.startsWith('.')) {
        return `DOMAIN-SUFFIX,${rule.slice(1)}`;
      }
      if (rule.includes('*')) {
        return `DOMAIN-KEYWORD,${rule.replace(/\*/g, '')}`;
      }
      return `DOMAIN,${rule}`;
    }

    const parsed = this.parseRule(rule);
    if (!parsed) return rule;

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
    return /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*\.?$/.test(str);
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

    // 处理 pre-matching
    if (rule.policy?.toUpperCase().startsWith('REJECT')) {
      const isValidType = /^(DOMAIN|DOMAIN-SUFFIX|DOMAIN-KEYWORD|IP-CIDR|IP-CIDR6|GEOIP|IP-ASN)/i.test(rule.type);
      rule.flags.preMatching = isValidType && (this.options.enablePreMatching ?? false);
    }

    // 处理 extended-matching
    if (this.format === 'Surge') {
      rule.flags.extended = this.options.enableExtended ?? false;
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
    const flags = Object.entries(rule.flags)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch(key) {
          case 'noResolve': return 'no-resolve';
          case 'preMatching': return 'pre-matching';
          case 'extended': return 'extended-matching';
          default: return '';
        }
      })
      .filter(Boolean);

    const parts = [rule.type, rule.value];
    if (rule.policy) parts.push(rule.policy);
    if (flags.length > 0) parts.push(...flags);

    return parts.join(',');
  }
} 