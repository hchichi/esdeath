import fs from 'fs';
import path from 'path';
import { RuleConverter } from './rule-converter';
import { addRuleHeader, cleanAndSort } from './utils';
import { RuleFile } from './rule-types';

export class RuleMerger {
    constructor(
        private converter: RuleConverter,
        private cleanup: boolean = true,
        private addHeader: boolean = true
    ) {}

    /**
     * Merge multiple rule contents into one
     * @param files - Array of RuleFile
     * @returns - Merged content
     */
    public async mergeRules(files: RuleFile[]): Promise<string> {
        let mergedContent = '';

        for (const file of files) {
            // Read the content of the file, possibly download if needed
            const content = await this.getRuleContent(file);
            const convertedContent = this.converter.convert(content);

            mergedContent += convertedContent + '\n';
        }

        // Apply cleanup if needed
        if (this.cleanup) {
            mergedContent = cleanAndSort(mergedContent, true);
        }

        return mergedContent;
    }

    private async getRuleContent(file: RuleFile): Promise<string> {
        const filePath = path.resolve(file.path);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        } else if (file.url) {
            return await fetchFile(file.url);
        } else {
            throw new Error(`Cannot find or download file: ${file.path}`);
        }
    }

    public addHeader(content: string, fileInfo: RuleFile, sourceUrls?: string[]): string {
        return addRuleHeader(content, fileInfo, sourceUrls);
    }
} 