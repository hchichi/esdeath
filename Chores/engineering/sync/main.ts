import { ruleGroups, specialRules } from './rule-sources';
import { RuleProcessor } from './rule-processor';
import { initializeDirectoryStructure } from './utils';

async function main() {
    const repoPath = '.'; // Replace with your repository path

    // Initialize directory structure
    initializeDirectoryStructure(repoPath, ruleGroups, specialRules);

    const converterOptions = {
        noResolve: true,
        preMatching: false,
        extendedMatching: false,
    };

    const processor = new RuleProcessor(ruleGroups, specialRules, repoPath, converterOptions);
    await processor.processRules();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
}); 