import { RuleConverter } from './rule-converter';
import { RuleStats, RuleOptions } from './rule-types';
import { addRuleHeader, cleanAndSort } from './utils';

export class RuleProcessor {
  private converter: RuleConverter;
  
  constructor(options: RuleOptions = {}) {
    this.converter = new RuleConverter(options);
  }

  // 处理单个规则文件
  async processRuleFile(
    content: string,
    cleanup: boolean = false,
    header?: {
      enable?: boolean;
      title?: string;
      description?: string;
    }
  ): Promise<string> {
    // 转换规则
    const rules = content
      .split('\n')
      .map(line => this.converter.convert(line));

    // 清理和排序
    let result = cleanup ? 
      cleanAndSort(rules.join('\n'), this.converter) :
      rules.join('\n');

    // 添加头信息
    if(header?.enable) {
      result = addRuleHeader(result, {
        title: header.title,
        description: header.description
      });
    }

    return result;
  }

  // 合并多个规则文件
  async mergeRuleFiles(
    contents: string[],
    cleanup: boolean = true,
    header?: {
      enable?: boolean;
      title?: string;
      description?: string;
    }
  ): Promise<string> {
    // 合并所有规则
    const merged = contents
      .map(content => content.split('\n'))
      .flat()
      .map(line => this.converter.convert(line))
      .join('\n');

    // 清理和排序
    let result = cleanup ?
      cleanAndSort(merged, this.converter) :
      merged;

    // 添加头信息
    if(header?.enable) {
      result = addRuleHeader(result, {
        title: header.title,
        description: header.description
      });
    }

    return result;
  }
} 