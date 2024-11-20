import { RuleConverter } from './rule-converter';
import { RuleOptions } from './rule-types';
import { cleanAndSortRules, addRuleHeader } from './utils';

export class RuleProcessor {
  private converter: RuleConverter;
  
  constructor(options: RuleOptions = {}) {
    this.converter = new RuleConverter(options);
  }

  // 处理单个规则文件
  async processRuleFile(
    content: string,
    cleanup?: boolean,
    header?: {
      title?: string;
      description?: string;
    }
  ): Promise<string> {
    const rules = content.split('\n');
    const convertedRules = rules.map(rule => this.converter.convert(rule));
    
    let processedRules = convertedRules;
    if (cleanup) {
      processedRules = cleanAndSortRules(convertedRules);
    }

    if (header) {
      processedRules = addRuleHeader(processedRules, header);
    }

    return processedRules.join('\n');
  }

  // 合并多个规则文件
  async mergeRuleFiles(
    contents: string[],
    cleanup?: boolean,
    header?: {
      title?: string;
      description?: string;
    }
  ): Promise<string> {
    const allRules = contents.flatMap(content => 
      content.split('\n').map(rule => this.converter.convert(rule))
    );

    let processedRules = allRules;
    if (cleanup) {
      processedRules = cleanAndSortRules(allRules);
    }

    if (header) {
      processedRules = addRuleHeader(processedRules, header);
    }

    return processedRules.join('\n');
  }
} 