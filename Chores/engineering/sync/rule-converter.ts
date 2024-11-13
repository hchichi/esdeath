import { RuleFormat, ParsedRule, RuleFlags } from './types';

export class RuleConverter {
  constructor(private format: RuleFormat) {}
  
  convert(rule: string): string {
    // 处理注释和空行
    if (!rule.trim() || rule.startsWith('#')) return rule;

    // 处理特殊格式
    if (rule.startsWith('.')) {
      return `DOMAIN-SUFFIX,${rule.slice(1)}`;
    }

    const parsed = this.parseRule(rule);
    if (!parsed) return rule;

    this.processFlags(parsed);
    return this.generateRule(parsed);
  }

  private parseRule(rule: string): ParsedRule | null {
    // 参考了 Rewrite-Parser.beta.js 的规则解析逻辑
    const parts = rule.split(',').map(p => p.trim());
    
    // 处理基本规则
    if (parts.length < 2) {
      return {
        type: 'DOMAIN',
        value: parts[0],
        flags: {}
      };
    }

    // 处理完整规则
    return {
      type: parts[0] as any,
      value: parts[1],
      policy: parts[2],
      flags: this.parseFlags(parts.slice(3))
    };
  }

  private processFlags(rule: ParsedRule): void {
    // 处理 IP 规则的 no-resolve
    if (rule.type.startsWith('IP-')) {
      rule.flags.noResolve = true;
    }

    // 处理 REJECT 规则的 pre-matching
    if (rule.policy?.toUpperCase().startsWith('REJECT')) {
      rule.flags.preMatching = true;
    }

    // Surge 特定处理
    if (this.format === 'Surge') {
      rule.flags.extended = true;
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
        }
      })
      .join(',');

    const parts = [rule.type, rule.value];
    if (rule.policy) parts.push(rule.policy);
    if (flags) parts.push(flags);

    return parts.join(',');
  }
} 