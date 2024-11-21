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
    
    // 处理空行和注释
    if(cleanup) {
      line = line.trim();
      if(!line || line.startsWith('#') || line.startsWith(';') || line.startsWith('//')) {
        return '';
      }
    } else {
      if(!line.trim() || line.startsWith('#') || line.startsWith(';') || line.startsWith('//')) {
        return line;
      }
    }

    // 处理 domain-set 格式转换为 ruleset 格式
    if(!line.includes(',')) {
      // domain-set 格式的规则处理
      line = line.trim();
      
      if(line.startsWith('.')) {
        // 以点开头的视为 DOMAIN-SUFFIX
        return `DOMAIN-SUFFIX,${line.substring(1)}`;
      } else if(line.includes('*')) {
        // 包含通配符的视为 DOMAIN-WILDCARD
        return `DOMAIN-WILDCARD,${line}`;
      } else {
        // 其他情况视为 DOMAIN
        return `DOMAIN,${line}`;
      }
    }

    // 处理已有类型的规则
    if(line.includes(',')) {
      const ruleParts = line.split(',').map(p => p.trim());
      const [type, value, policy = '', ...flags] = ruleParts;
      
      // 转换类型
      let newType = type
        .replace(/^HOST-WILDCARD/i, 'DOMAIN-WILDCARD')
        .replace(/^HOST-SUFFIX/i, 'DOMAIN-SUFFIX')
        .replace(/^HOST-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^HOST/i, 'DOMAIN')
        .replace(/^DOMAIN-KEYWORD/i, 'DOMAIN-KEYWORD')
        .replace(/^DOMAIN-SUFFIX/i, 'DOMAIN-SUFFIX')
        .replace(/^DOMAIN-SET/i, 'DOMAIN-SET')
        .replace(/^DOMAIN/i, 'DOMAIN')
        .replace(/^IP-CIDR6/i, 'IP-CIDR6')
        .replace(/^IP-CIDR/i, 'IP-CIDR')
        .replace(/^IP6-CIDR/i, 'IP-CIDR6')
        .replace(/^GEOIP/i, 'GEOIP')
        .replace(/^USER-AGENT/i, 'USER-AGENT')
        .replace(/^URL-REGEX/i, 'URL-REGEX')
        .replace(/^PROCESS-NAME/i, 'PROCESS-NAME')
        .replace(/^DEST-PORT/i, 'DST-PORT')
        .replace(/^SRC-PORT/i, 'SRC-PORT')
        .replace(/^SRC-IP/i, 'SRC-IP')
        .replace(/^IN-PORT/i, 'IN-PORT')
        .replace(/^PROTOCOL/i, 'PROTOCOL');

      // 处理策略
      let newPolicy = policy.toUpperCase();
      if(newPolicy) {
        newPolicy = newPolicy
          .replace(/^REJECT$/i, 'REJECT')
          .replace(/^REJECT-DROP$/i, 'REJECT-DROP')
          .replace(/^REJECT-TINYGIF$/i, 'REJECT-TINYGIF')
          .replace(/^DIRECT$/i, 'DIRECT')
          .replace(/^PROXY$/i, 'PROXY');
      }

      // 处理规则标志
      const ruleFlags: string[] = [...flags]; // 保留现有标志

      // 根据规则类型和选项添加标志
      if (this.options.enableNoResolve && 
          ['IP-CIDR', 'IP-CIDR6', 'GEOIP'].includes(newType.toUpperCase())) {
        if (!ruleFlags.includes('no-resolve')) {
          ruleFlags.push('no-resolve');
        }
      }

      if (this.options.enablePreMatching && 
          newPolicy.toUpperCase() === 'REJECT') {
        if (!ruleFlags.includes('pre-matching')) {
          ruleFlags.push('pre-matching');
        }
      }

      if (this.options.enableExtended && 
          newType.toUpperCase().startsWith('DOMAIN')) {
        if (!ruleFlags.includes('extended-matching')) {
          ruleFlags.push('extended-matching');
        }
      }

      // 构建最终规则
      const finalParts = [newType, value];
      if (newPolicy) finalParts.push(newPolicy);
      if (ruleFlags.length > 0) finalParts.push(...ruleFlags);

      return finalParts.join(',');
    }

    return line;
  }
}