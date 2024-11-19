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

  convert(rule: string): string {
    // Handle comments
    if (rule.trim().startsWith('#') || rule.trim().startsWith('//')) {
      return this.options.preserveComments ? rule : '';
    }

    if (!rule.trim()) return '';

    // Handle domain-set to rule-set conversion
    if (rule.startsWith('.')) {
      return `DOMAIN-SUFFIX,${rule.slice(1)}`;
    } else if (this.isDomain(rule) && !rule.includes(',')) {
      return `DOMAIN,${rule}`;
    }

    // Handle IP addresses
    if (this.isIPv4(rule)) {
      return `IP-CIDR,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }
    if (this.isIPv6(rule)) {
      return `IP-CIDR6,${rule}${this.options.enableNoResolve ? ',no-resolve' : ''}`;
    }

    // Handle host rules
    if (this.isHost(rule)) {
      return `HOST,${rule}`;
    }

    // Handle domain-keyword rules
    if (this.isDomainKeyword(rule)) {
      return `DOMAIN-KEYWORD,${rule}`;
    }

    // Handle geoip rules
    if (this.isGeoIP(rule)) {
      return `GEOIP,${rule}`;
    }

    // Handle IP-ASN rules
    if (this.isIPASN(rule)) {
      return `IP-ASN,${rule}`;
    }

    // Handle existing rules
    const parsed = this.parseRule(rule);
    if (!parsed) return rule;

    // Process rule flags
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

  private isHost(str: string): boolean {
    return /^[a-zA-Z0-9.-]+$/.test(str) && !this.isIPv4(str) && !this.isIPv6(str);
  }

  private isDomainKeyword(str: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(str);
  }

  private isGeoIP(str: string): boolean {
    return /^GEOIP,[A-Z]{2}$/.test(str);
  }

  private isIPASN(str: string): boolean {
    return /^AS\d+$/.test(str);
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
    // Handle no-resolve
    if (rule.type.startsWith('IP-')) {
      rule.flags.noResolve = this.options.enableNoResolve ?? false;
    }

    // Handle extended-matching (SNI)
    if (this.format === 'Surge' && !rule.type.startsWith('IP-')) {
      rule.flags.extended = this.options.enableExtended ?? false;
    }

    // Handle pre-matching
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

    // Add flags in a specific order
    if (rule.flags.noResolve) flags.push('no-resolve');
    if (rule.flags.preMatching) flags.push('pre-matching');
    if (rule.flags.extended) flags.push('extended-matching');

    const parts = [rule.type, rule.value];
    if (rule.policy) parts.push(rule.policy);
    if (flags.length > 0) parts.push(...flags);

    return parts.join(',');
  }
} 