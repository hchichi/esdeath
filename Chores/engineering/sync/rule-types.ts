// rule-types.ts

export interface RuleFile {
    path: string;
    url?: string;
    title?: string;
    description?: string;
    cleanup?: boolean; // Whether to clean comments, spaces, deduplicate
    header?: {
        enable?: boolean; // Whether to add header
        title?: string;
        description?: string;
    };
}

export interface RuleGroup {
    name: string;
    files: RuleFile[];
}

export interface SpecialRuleConfig {
    name: string;
    targetFile: string;
    sourceFiles: string[];
    cleanup?: boolean;
    extraRules?: string[];
    header?: {
        enable?: boolean; // Whether to add header
        title?: string;
        description?: string;
    };
}

export interface RuleStats {
    total: number;
    domain?: number;
    domainSuffix?: number;
    domainKeyword?: number;
    domainSet?: number;
    ipCidr?: number;
    ipCidr6?: number;
    ipAsn?: number;
    ipSuffix?: number;
    geoip?: number;
    geosite?: number;
    processName?: number;
    processPath?: number;
    destPort?: number;
    srcPort?: number;
    protocol?: number;
    network?: number;
    ruleSet?: number;
    urlRegex?: number;
    userAgent?: number;
    header?: number;
    other?: number;
}