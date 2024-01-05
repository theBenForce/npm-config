#!/usr/bin/env ts-node

import {program} from 'commander';
import { addCommands } from './commands';

addCommands(program)
    .parseAsync(process.argv)
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });