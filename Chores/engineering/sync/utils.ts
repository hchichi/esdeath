// utils.ts

import fs from 'fs';
import path from 'path';
import { RuleStats, RuleGroup, SpecialRuleConfig, RuleFile } from './rule-types';

/**
 * Ensure directory exists
 * @param dirPath - Directory path
 */
export function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

/**
 * Fetch file content from a URL
 * @param url - The URL to fetch
 * @returns - The file content as a string
 */
export async function fetchFile(url: string): Promise<string> {
    // Implement fetch logic, for example using node-fetch or axios
    // Placeholder implementation
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
}

/**
 * Get rule statistics
 * @param content - Rule content
 * @returns - Rule statistics
 */
export function getRuleStats(content: string | Buffer): RuleStats {
    const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);

    const stats: RuleStats = {
        total: 0,
        domain: 0,
        domainSuffix: 0,
        domainKeyword: 0,
        domainSet: 0,
        ipCidr: 0,
        ipCidr6: 0,
        ipAsn: 0,
        ipSuffix: 0,
        geoip: 0,
        geosite: 0,
        processName: 0,
        processPath: 0,
        destPort: 0,
        srcPort: 0,
        protocol: 0,
        network: 0,
        ruleSet: 0,
        urlRegex: 0,
        userAgent: 0,
        header: 0,
        other: 0,
    };

    const lines = contentStr.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    stats.total = lines.length;

    lines.forEach(line => {
        const type = line.split(',')[0]?.trim().toUpperCase();
        switch (type) {
            // Domain rules
            case 'DOMAIN':
                stats.domain!++;
                break;
            case 'DOMAIN-SUFFIX':
                stats.domainSuffix!++;
                break;
            case 'DOMAIN-KEYWORD':
                stats.domainKeyword!++;
                break;
            case 'DOMAIN-SET':
                stats.domainSet!++;
                break;

            // IP rules
            case 'IP-CIDR':
                stats.ipCidr!++;
                break;
            case 'IP-CIDR6':
                stats.ipCidr6!++;
                break;
            case 'IP-ASN':
                stats.ipAsn!++;
                break;
            case 'IP-SUFFIX':
                stats.ipSuffix!++;
                break;

            // GEO rules
            case 'GEOIP':
                stats.geoip!++;
                break;
            case 'GEOSITE':
                stats.geosite!++;
                break;

            // Process rules
            case 'PROCESS-NAME':
                stats.processName!++;
                break;
            case 'PROCESS-PATH':
                stats.processPath!++;
                break;

            // Port rules
            case 'DEST-PORT':
                stats.destPort!++;
                break;
            case 'SRC-PORT':
                stats.srcPort!++;
                break;

            // Protocol rules
            case 'PROTOCOL':
                stats.protocol!++;
                break;
            case 'NETWORK':
                stats.network!++;
                break;

            // HTTP rules
            case 'RULE-SET':
                stats.ruleSet!++;
                break;
            case 'URL-REGEX':
                stats.urlRegex!++;
                break;
            case 'USER-AGENT':
                stats.userAgent!++;
                break;
            case 'HEADER':
                stats.header!++;
                break;

            default:
                stats.other!++;
                break;
        }
    });

    return stats;
}

/**
 * Clean and sort rules
 * @param content - The content to clean and sort
 * @param cleanup - Whether to perform cleanup and sorting
 * @returns - Cleaned and sorted content
 */
export function cleanAndSort(content: string, cleanup: boolean = false): string {
    if (!cleanup) {
        // Only deduplicate, keep comments and empty lines
        return removeDuplicateRules(content);
    }

    // Full cleanup: deduplicate, remove comments, remove empty lines, sort
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .filter((line, index, arr) => arr.indexOf(line) === index)
        .sort()
        .join('\n');
}

export function removeDuplicateRules(content: string): string {
    const lines = content.split('\n');
    const uniqueLines = new Set<string>();
    return lines
        .filter(line => {
            if (!line.trim() || line.startsWith('#')) return true;
            if (uniqueLines.has(line)) return false;
            uniqueLines.add(line);
            return true;
        })
        .join('\n');
}

/**
 * Add rule file header comments
 * @param content - Rule content
 * @param fileInfo - Header information
 * @param sourceUrls - Source file URLs (for merged rules)
 * @returns - Content with added header
 */
export function addRuleHeader(content: string | Buffer, fileInfo?: RuleFile, sourceUrls?: string[]): string {
    const contentStr = Buffer.isBuffer(content) ? content.toString('utf-8') : String(content);

    const stats = getRuleStats(contentStr);
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    // Collect all valid URLs and deduplicate
    const sources = [...new Set([
        fileInfo?.url,           // Single rule URL
        ...(sourceUrls || []) // Source file URLs for merged rules
    ].filter(Boolean))];

    const headersArray = [
        '########################################',
        fileInfo?.header?.title && `# ${fileInfo.header.title}`,
        `# Last updated: ${timestamp}`,

        // Domain rules
        stats.domain! > 0 && `# DOMAIN: ${stats.domain}`,
        stats.domainSuffix! > 0 && `# DOMAIN-SUFFIX: ${stats.domainSuffix}`,
        stats.domainKeyword! > 0 && `# DOMAIN-KEYWORD: ${stats.domainKeyword}`,
        stats.domainSet! > 0 && `# DOMAIN-SET: ${stats.domainSet}`,

        // IP rules
        stats.ipCidr! > 0 && `# IP-CIDR: ${stats.ipCidr}`,
        stats.ipCidr6! > 0 && `# IP-CIDR6: ${stats.ipCidr6}`,
        stats.ipAsn! > 0 && `# IP-ASN: ${stats.ipAsn}`,
        stats.ipSuffix! > 0 && `# IP-SUFFIX: ${stats.ipSuffix}`,

        // GEO rules
        stats.geoip! > 0 && `# GEOIP: ${stats.geoip}`,
        stats.geosite! > 0 && `# GEOSITE: ${stats.geosite}`,

        // Process rules
        stats.processName! > 0 && `# PROCESS-NAME: ${stats.processName}`,
        stats.processPath! > 0 && `# PROCESS-PATH: ${stats.processPath}`,

        // Port rules
        stats.destPort! > 0 && `# DEST-PORT: ${stats.destPort}`,
        stats.srcPort! > 0 && `# SRC-PORT: ${stats.srcPort}`,

        // Protocol rules
        stats.protocol! > 0 && `# PROTOCOL: ${stats.protocol}`,
        stats.network! > 0 && `# NETWORK: ${stats.network}`,

        // HTTP rules
        stats.ruleSet! > 0 && `# RULE-SET: ${stats.ruleSet}`,
        stats.urlRegex! > 0 && `# URL-REGEX: ${stats.urlRegex}`,
        stats.userAgent! > 0 && `# USER-AGENT: ${stats.userAgent}`,
        stats.header! > 0 && `# HEADER: ${stats.header}`,

        stats.other! > 0 && `# OTHER: ${stats.other}`,
        `# Total: ${stats.total}`,

        // Only add description if present
        fileInfo?.header?.description && `# ${fileInfo.header.description}`,
        // Only add data sources section if there are sources
        sources.length > 0 && [
            '# Data sources:',
            ...sources.map(source => `#  - ${source}`)
        ],
        '########################################',
        '',
        contentStr
    ].flat().filter(Boolean) as string[]; // Ensure types

    return headersArray.join('\n');
}

/**
 * Validate rule
 * @param rule - The rule to validate
 * @returns - Whether the rule is valid
 */
export function validateRule(rule: string): boolean {
    const validRuleTypes = [
        'DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN-SET',
        'IP-CIDR', 'IP-CIDR6', 'GEOIP', 'GEOSITE',
        'URL-REGEX', 'USER-AGENT', 'IP-ASN',
        'AND', 'OR', 'NOT',

        // Add other valid rule types as necessary
    ];

    const type = rule.split(',')[0]?.trim().toUpperCase();
    return validRuleTypes.includes(type);
}

/**
 * Initialize directory structure
 * @param repoPath - Repository path
 * @param ruleGroups - Rule groups
 * @param specialRules - Special rules
 */
export function initializeDirectoryStructure(
    repoPath: string,
    ruleGroups: RuleGroup[],
    specialRules: SpecialRuleConfig[]
): void {
    // Collect directories from regular rule groups
    const groupDirs = ruleGroups.flatMap(group =>
        group.files.map(file => path.dirname(file.path))
    );

    // Collect directories from special rules
    const specialDirs = specialRules.map(rule =>
        path.dirname(rule.targetFile)
    );

    // Merge all directories and deduplicate
    const allDirs = [...new Set([...groupDirs, ...specialDirs])];

    // Create directories
    for (const dir of allDirs) {
        const fullPath = path.join(repoPath, dir);
        ensureDirectoryExists(fullPath);
    }
}