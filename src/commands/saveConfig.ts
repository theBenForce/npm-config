import { confirm, input } from '@inquirer/prompts';
import { Argument, Command, Option } from "commander";
import fs from 'fs';
import { ConfigDB } from "../controller/db";
import { getConfigPath } from '../utils/getConfigPath';

export const saveNpmConfigCommand = new Command('save-config')
    .description('Save, or create, an npm config based on the current settings')
    .addArgument(new Argument('[name]', 'Name of the npm config'))
    .addOption(new Option('--empty', 'Create an empty config'))
    .addOption(new Option('--global', 'Save the global config'))
    .action(async (name: string, flags: Record<string, boolean>) => {

        name = name || await input({
            message: 'Enter a name for the config',
        });

        const confirmation = await confirm({
            message: `Are you sure you want to save the current ${flags.global ? 'global' : 'local'} npm config as ${name}?`,
        });
        
        if (!confirmation) {
            console.info('Aborting');
            return;
        }

        let content = '';
        let filename = '';

        if(!flags.empty) {
            filename = getConfigPath(flags.global);

            if(!fs.existsSync(filename)) {
                throw new Error(`Cannot find ${filename}`);
            }

            console.info(`Saving ${flags.global ? 'global' : 'local'} npm config as ${name}`);
            content = await fs.promises.readFile(filename, 'utf-8');
        }

        const db = ConfigDB.instance;

        db.upsert({
            name,
            source: filename || 'empty',
            created: new Date(),
            updated: new Date(),
            content,
        });
    });

export default saveNpmConfigCommand;