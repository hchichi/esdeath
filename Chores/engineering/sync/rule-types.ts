// rule-types.ts
export interface RuleOptions {
  noResolve?: boolean;
  extendedMatching?: boolean;
}

export interface RuleFile {
  url: string;
  path: string;
  cleanup?: boolean;
  header?: {
    title?: string;
    description?: string;
  };
}

export interface RuleGroup {
  name: string;
  files: RuleFile[];
}

export interface SpecialRule {
  name: string;
  sourceFiles: string[];
  targetFile: string;
  cleanup?: boolean;
  header?: {
    title?: string;
    description?: string;
  };
}