import {program} from 'commander';
import fetchSchemaAction, {fetchSchemaSDL} from './fetchSchema';

program.exitOverride();

program
    .arguments('<url>')
    .option('-u --user <userName>', 'user name used for basic auth')
    .option('-p --password <password>', 'password used for basic auth')
    .option('-f --fileName <fileName>', 'file name for the generated schema definition')
    .option('-d --descriptions', 'flag to include descriptions in request')
    .action(fetchSchemaAction);

export const cli = async argv => {
    try {
        await program.parseAsync(argv);
    } catch (error) {
        program.outputHelp();
        process.exit(1);
    }
};

export default fetchSchemaSDL;