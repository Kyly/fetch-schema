import {program} from 'commander';
import fetchSdlAction from './fetchSdlAction';

program
    .arguments('<url>')
    .requiredOption('-u --user <userName>')
    .requiredOption('-p --password <password>')
    .option('-f --fileName <fileName>')
    .action(fetchSdlAction);

const main = async argv => {
    await program.parseAsync(argv);
};

export default main;