import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

interface SgmoduleInfo {
    url: string;
    header: string;
}

interface Sections {
    'URL Rewrite': string[];
    'Map Local': string[];
    'Script': string[];
    'MITM': string[];
    'Rule': string[];
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const MAX_DIVIDER_LENGTH = 30; // Maximum divider length (excluding header length)

async function mergeSgmodules() {
    try {
        // Read sgmodules.yaml
        const sgmoduleContent = await readFile('Chores/engineering/data/sgmodules.yaml', 'utf8');
        const sgmoduleInfo = yaml.load(sgmoduleContent) as SgmoduleInfo[];

        const sections: Sections = {
            'URL Rewrite': [],
            'Map Local': [],
            'Script': [],
            'MITM': [],
            'Rule': []
        };

        const headers: string[] = [];
        const sectionPattern = /\[(.*?)\]\s*\n(.*?)(?=\n\[|$)/gs;
        const hostnamePattern = /hostname\s*=\s*(.*)/i;

        // Process each URL in sgmodules.yaml
        for (const info of sgmoduleInfo) {
            try {
                const response = await fetch(info.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();
                console.log(`[Debug] Parsing content from ${info.header}`);

                headers.push(info.header);

                // Calculate dynamic divider
                const leftDashCount = Math.floor((MAX_DIVIDER_LENGTH - info.header.length) / 2);
                const rightDashCount = MAX_DIVIDER_LENGTH - info.header.length - leftDashCount;
                const divider = `# ${'-'.repeat(leftDashCount)} ${info.header} ${'-'.repeat(rightDashCount)}`;

                // Process each section
                let match;
                while ((match = sectionPattern.exec(content)) !== null) {
                    const [, section, text] = match;
                    if (section in sections && section !== 'MITM') {
                        if (section === 'Rule') {
                            // 清理注释和空行，只保留有效规则和模块头
                            const cleanedLines = text
                                .trim()
                                .split('\n')
                                .filter(line => {
                                    const trimmedLine = line.trim();
                                    // 保留非空行，且要么是模块头（以 # >> 开头）要么不是注释
                                    return trimmedLine && 
                                           (!trimmedLine.startsWith('#') || trimmedLine.startsWith('# >> '));
                                })
                                .join('\n');
                            // 添加模块头时使用正确的格式
                            sections.Rule.push(`# >> ${info.header}\n${cleanedLines}`);
                        }
                        else {
                            // Remove comment lines and empty lines, but keep divider
                            const cleanedLines = text
                                .trim()
                                .split('\n')
                                .filter(line => line.trim() && !line.trim().startsWith('#'))
                                .join('\n');
                            sections[section as keyof Sections].push(`${divider}\n${cleanedLines}`);
                        }
                    } else if (section === 'MITM') {
                        const hostnameMatch = text.match(hostnamePattern);
                        if (hostnameMatch) {
                            const hostnames = hostnameMatch[1]
                                .replace('%APPEND%', '')
                                .split(',')
                                .map(h => h.trim())
                                .filter(Boolean);
                            sections.MITM.push(...hostnames);
                        }
                    }
                }

                console.log(`Successfully merged: ${info.header}`);
            } catch (error) {
                console.error(`Failed to download ${info.header} file:`, error);
            }
        }

        const headersCombined = headers.join(', ');

        // Process and save rules
        if (sections.Rule.length > 0) {
        } else {
            console.log('[Warning] No Rule content extracted');
        }

        // Create ruleset directory if it doesn't exist
        await mkdir('Chores/ruleset', { recursive: true });

        // Process rules with comments and deduplication
        const processedRules = processRules(sections.Rule);
        await writeFile('Chores/ruleset/reject.list', processedRules.rejectRules);
        await writeFile('Chores/ruleset/direct.list', processedRules.directRules);

        // Process MITM hostnames
        const uniqueHostnames = Array.from(new Set(sections.MITM));
        const hostnameAppendContent = uniqueHostnames.join(', ');

        const currentDate = new Date().toLocaleDateString('en-US');

        // Read and process template
        const templateContent = await readFile(
            'Chores/engineering/templates/All-in-One-2.x.sgmodule.template',
            'utf8'
        );

        let outputContent = templateContent;
        for (const [section, contents] of Object.entries(sections)) {
            const placeholder = `{${section}}`;
            const sectionContent = section !== 'MITM' ? contents.join('\n\n') : contents;
            outputContent = outputContent.replace(placeholder, sectionContent);
        }

        outputContent = outputContent
            .replace('{headers}', headersCombined)
            .replace('{hostname_append}', hostnameAppendContent)
            .replace('{{currentDate}}', currentDate);

        await writeFile('Chores/sgmodule/All-in-One-2.x.sgmodule', outputContent);
        console.log('File successfully merged and saved to: Chores/sgmodule/All-in-One-2.x.sgmodule');
    } catch (error) {
        console.error('Error in mergeSgmodules:', error);
    }
}

interface ProcessedRules {
    rejectRules: string;
    directRules: string;
}

function processRules(rules: string[]): ProcessedRules {
    const ruleMap = new Map<string, { rule: string }>();
    const rejectRules: string[] = [];
    const directRules: string[] = [];
    
    let currentModuleHeader: string | null = null;
    let hasNewRuleInCurrentModule = false;
    let isFirstModule = true;

    rules.forEach(ruleBlock => {
        const lines = ruleBlock.split('\n');
        
        // 重置模块状态
        currentModuleHeader = null;
        hasNewRuleInCurrentModule = false;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // 处理模块头信息（以 # >> 开头）
            if (trimmedLine.startsWith('# >> ')) {
                currentModuleHeader = trimmedLine;
                return;
            }

            // 处理规则
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const ruleWithoutPolicy = trimmedLine.replace(/,(REJECT|DIRECT)(-[A-Z]+)?$/, '');
                const isRejectRule = trimmedLine.includes('REJECT');
                const isDirectRule = trimmedLine.includes('DIRECT');

                if (isRejectRule) {
                    if (!ruleMap.has(ruleWithoutPolicy)) {
                        ruleMap.set(ruleWithoutPolicy, { rule: ruleWithoutPolicy });
                        hasNewRuleInCurrentModule = true;
                        
                        // 只有当模块中有新规则时，才添加模块头
                        if (currentModuleHeader && !rejectRules.includes(currentModuleHeader)) {
                            // 只在非第一个模块前添加空行
                            if (!isFirstModule) {
                                rejectRules.push('');
                            }
                            rejectRules.push(currentModuleHeader);
                            isFirstModule = false;
                        }
                        rejectRules.push(trimmedLine);
                    }
                }

                if (isDirectRule) {
                    if (!directRules.includes(trimmedLine)) {
                        hasNewRuleInCurrentModule = true;
                        
                        // 只有当模块中有新规则时，才添加模块头
                        if (currentModuleHeader && !directRules.includes(currentModuleHeader)) {
                            // 只在非第一个模块前添加空行
                            if (directRules.length > 0) {
                                directRules.push('');
                            }
                            directRules.push(currentModuleHeader);
                        }
                        directRules.push(trimmedLine);
                    }
                }
            }
        });
    });

    return {
        rejectRules: rejectRules.join('\n'),
        directRules: directRules.join('\n')
    };
}

// Execute the merge
mergeSgmodules().catch(console.error);
