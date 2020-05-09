import {program} from 'commander';
import fetchSchema from './fetchSchema';

program.exitOverride();

program
    .arguments('<url>')
    .option('-u --user <userName>', 'user name used for basic auth')
    .option('-p --password <password>', 'password used for basic auth')
    .option('-f --fileName <fileName>', 'file name for the generated schema definition')
    .option('-d --descriptions', 'flag to include descriptions in request')
    .action(fetchSchema);

const cli = async argv => {
    try {
        await program.parseAsync(argv);
    } catch (error) {
        program.outputHelp();
        process.exit(1);
    }
};

export {
    cli,
    fetchSchema
};