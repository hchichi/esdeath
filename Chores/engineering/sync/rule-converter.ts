import { RuleOptions } from './rule-types';
import { isProbablyIpv4, isProbablyIpv6 } from './utils';

export class RuleConverter {
  private options: RuleOptions;

  constructor(options: RuleOptions = {}) {
    this.options = options;
  }

  // 将域名通配符转换为正则表达式
  private domainWildCardToRegex(wildcard: string): string {
    return wildcard
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
  }

  // 转换域名类规则
  convertDomain(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());
    
    switch(type.toUpperCase()) {
      case 'DOMAIN':
        return `DOMAIN,${value}`;
      case 'DOMAIN-SUFFIX':
        return `DOMAIN-SUFFIX,${value}`; 
      case 'DOMAIN-KEYWORD':
        return `DOMAIN-KEYWORD,${value}`;
      case 'DOMAIN-SET':
        // 将 DOMAIN-SET 转换为 RULE-SET
        const rulesetPath = value.endsWith('.txt') ? 
          value.replace('.txt', '.list') : value;
        return `RULE-SET,${rulesetPath}`;
      case 'DOMAIN-WILDCARD':
        // 支持通配符域名
        return `DOMAIN-WILDCARD,${value}`;
      default:
        // 如果是纯域名,转换为DOMAIN
        if(!type.includes('-') && !this.isIPAddress(type)) {
          return `DOMAIN,${type}`;
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
        return `IP-CIDR,${value}${noResolve}`;
      case 'IP-CIDR6': 
        return `IP-CIDR6,${value}${noResolve}`;
      case 'IP-ASN':
        return `IP-ASN,${value}${noResolve}`;
      case 'SRC-IP':
      case 'SOURCE-IP':
        if(value.includes('/')) {
          return `SRC-IP-CIDR,${value}`;
        }
        if(isProbablyIpv4(value)) {
          return `SRC-IP-CIDR,${value}/32`;
        }
        if(isProbablyIpv6(value)) {
          return `SRC-IP-CIDR6,${value}/128`;
        }
        return rule;
      case 'GEOIP':
        return `GEOIP,${value}${noResolve}`;
      default:
        return rule;
    }
  }

  // 转换端口类规则
  convertPort(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());

    switch(type.toUpperCase()) {
      case 'DEST-PORT':
      case 'DST-PORT':
        return `DEST-PORT,${value}`;
      case 'SRC-PORT':
      case 'SOURCE-PORT':
        return `SRC-PORT,${value}`;
      case 'IN-PORT':
        return `IN-PORT,${value}`;
      default:
        return rule;
    }
  }

  // 转换进程类规则
  convertProcess(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());

    switch(type.toUpperCase()) {
      case 'PROCESS-NAME':
        return `PROCESS-NAME,${value}`;
      case 'PROCESS-PATH':
        return `PROCESS-PATH,${value}`;
      default:
        return rule;
    }
  }

  // 转换HTTP类规则
  convertHttp(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());

    switch(type.toUpperCase()) {
      case 'URL-REGEX':
        return `URL-REGEX,${value}`;
      case 'USER-AGENT':
        return `USER-AGENT,${value}`;
      case 'HEADER':
        return `HEADER,${value}`;
      default:
        return rule;
    }
  }

  // 转换其他类型规则
  convertOther(rule: string): string {
    const [type, value] = rule.split(',').map(x => x.trim());
    
    switch(type.toUpperCase()) {
      case 'PROTOCOL':
        return `PROTOCOL,${value}`;
      case 'NETWORK':
        return `NETWORK,${value}`;
      case 'RULE-SET':
        return `RULE-SET,${value}`;
      case 'FINAL':
        return 'FINAL';
      default:
        // 如果是纯IP,转换为CIDR
        if(this.isIPAddress(type)) {
          return this.convertPureIP(type);
        }
        // 如果是纯域名,转换为DOMAIN
        if(!type.includes('-') && !this.isIPAddress(type)) {
          return `DOMAIN,${type}`;
        }
        return rule;
    }
  }

  // 主转换方法
  convert(rule: string): string {
    // 保留注释和空行
    if(!rule.trim() || rule.startsWith('#') || rule.startsWith(';')) {
      return rule;
    }

    const type = rule.split(',')[0]?.trim().toUpperCase();

    // 处理纯IP地址
    if(this.isIPAddress(type)) {
      return this.convertPureIP(type);
    }

    // 域名类规则
    if(type.startsWith('DOMAIN') || (!type.includes('-') && !this.isIPAddress(type))) {
      return this.convertDomain(rule);
    }
    
    // IP类规则 
    if(type.startsWith('IP-') || type.startsWith('SRC-IP') || type === 'GEOIP') {
      return this.convertIP(rule);
    }

    // 端口类规则
    if(type.includes('PORT')) {
      return this.convertPort(rule);
    }

    // 进程类规则
    if(type.startsWith('PROCESS')) {
      return this.convertProcess(rule);
    }

    // HTTP类规则
    if(type.startsWith('URL') || type === 'USER-AGENT' || type === 'HEADER') {
      return this.convertHttp(rule);
    }

    // 其他规则
    return this.convertOther(rule);
  }
}