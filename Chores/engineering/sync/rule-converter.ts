import { RuleOptions } from './rule-types';
import { isProbablyIpv4, isProbablyIpv6, domainWildcardToRegex } from './utils';

export class RuleConverter {
  private options: RuleOptions;

  constructor(options: RuleOptions = {}) {
    this.options = options;
  }

  // 转换域名类规则
  convertDomain(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());
    const noResolve = this.options.noResolve ? ',no-resolve' : '';
    const extendedMatching = this.options.extendedMatching ? ',extended-matching' : '';
    
    switch(type.toUpperCase()) {
      case 'DOMAIN':
      case 'DOMAIN-SUFFIX':
      case 'DOMAIN-KEYWORD':
        return `${type},${value}${extendedMatching}`;
      case 'DOMAIN-SET':
        return `RULE-SET,${value}`;
      case 'DOMAIN-WILDCARD':
      case 'HOST-WILDCARD':
        return `DOMAIN-WILDCARD,${value}`;
      default:
        if(!type.includes('-') && !this.isIPAddress(type)) {
          return `DOMAIN,${type}${extendedMatching}`;
        }
        return rule;
    }
  }

  // 转换IP类规则
  convertIP(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());
    const noResolve = this.options.noResolve ? ',no-resolve' : '';
    
    switch(type.toUpperCase()) {
      case 'IP-CIDR':
      case 'IP-CIDR6':
        return `${type},${value}${noResolve}`;
      case 'SRC-IP':
      case 'SOURCE-IP':
        if(isProbablyIpv6(value)) {
          return `SRC-IP-CIDR6,${value}/128${noResolve}`;
        }
        return `SRC-IP-CIDR,${value}/32${noResolve}`;
      case 'GEOIP':
        return `GEOIP,${value}${noResolve}`;
      default:
        return rule;
    }
  }

  // 转换其他规则类型
  convertOther(rule: string): string {
    const [type, ...rest] = rule.split(',').map(x => x.trim());
    
    switch(type.toUpperCase()) {
      case 'DST-PORT':
      case 'DEST-PORT':
        return `DEST-PORT,${rest.join(',')}`;
      case 'SRC-PORT':
        return `SRC-PORT,${rest.join(',')}`;
      case 'PROCESS-NAME':
      case 'PROCESS-PATH':
        return `PROCESS-NAME,${rest.join(',')}`;
      case 'USER-AGENT':
      case 'URL-REGEX':
      case 'HEADER':
        return `${type},${rest.join(',')}`;
      default:
        return rule;
    }
  }

  // 主转换方法
  convert(rule: string): string {
    if(!rule.trim() || rule.startsWith('#')) return rule;

    const type = rule.split(',')[0]?.trim().toUpperCase();

    if(this.isIPAddress(type)) {
      return this.convertPureIP(type);
    }

    if(type.startsWith('DOMAIN') || type.startsWith('HOST') || (!type.includes('-') && !this.isIPAddress(type))) {
      return this.convertDomain(rule);
    }
    
    if(type.startsWith('IP-') || type.startsWith('SRC-IP') || type === 'GEOIP') {
      return this.convertIP(rule);
    }

    return this.convertOther(rule);
  }
}