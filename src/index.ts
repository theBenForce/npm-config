import {program} from 'commander';
import { addCommands } from './commands';

addCommands(program)
    .parseAsync(process.argv)
    .then(() => console.info(`Done!`));