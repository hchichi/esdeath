import fs from 'fs';
import path from 'path';
import { RuleGroup, SpecialRuleConfig } from './rule-types';
import { RuleConverter } from './rule-converter';
import { RuleMerger } from './rule-merger';
import { ensureDirectoryExists } from './utils';

export class RuleProcessor {
    constructor(
        private ruleGroups: RuleGroup[],
        private specialRules: SpecialRuleConfig[],
        private repoPath: string,
        private converterOptions: {
            noResolve?: boolean;
            preMatching?: boolean;
            extendedMatching?: boolean;
        }
    ) {}

    public async processRules(): Promise<void> {
        const converter = new RuleConverter(this.converterOptions);

        // Process normal rules
        for (const group of this.ruleGroups) {
            for (const file of group.files) {
                const cleanup = file.cleanup || false;
                const addHeader = file.header?.enable || false;
                const merger = new RuleMerger(converter, cleanup, addHeader);

                const content = await merger.mergeRules([file]);

                let finalContent = content;
                if (addHeader) {
                    finalContent = merger.addHeader(content, file);
                }

                const outputPath = path.join(this.repoPath, file.path);
                ensureDirectoryExists(path.dirname(outputPath));
                fs.writeFileSync(outputPath, finalContent);
            }
        }

        // Process special rules
        for (const specialRule of this.specialRules) {
            const cleanup = specialRule.cleanup !== undefined ? specialRule.cleanup : true;
            const addHeader = specialRule.header?.enable !== false; // default to true
            const merger = new RuleMerger(converter, cleanup, addHeader);

            const sourceFiles = specialRule.sourceFiles.map(sourceFile => ({
                path: sourceFile
            }));

            const content = await merger.mergeRules(sourceFiles);

            let finalContent = content;
            if (addHeader) {
                finalContent = merger.addHeader(content, {
                    path: specialRule.targetFile,
                    header: specialRule.header
                }, sourceFiles.map(f => f.path));
            }

            const outputPath = path.join(this.repoPath, specialRule.targetFile);
            ensureDirectoryExists(path.dirname(outputPath));
            fs.writeFileSync(outputPath, finalContent);
        }
    }
} 