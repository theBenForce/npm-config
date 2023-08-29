import { Argument, Command, Option } from "commander";
import { ConfigDB } from "../controller/db";
import { input, select } from "@inquirer/prompts";
import { table } from "table";
import { getConfigName } from "../utils/getConfigName";

export const loadNpmConfigCommand = new Command('load-config')
    .addArgument(new Argument('[name]', 'Name of the npm config'))
    .addOption(new Option('--global', 'Update the global .npmrc config'))
    .action(async (name: string, flags: Record<string, boolean>) => {
        const db = ConfigDB.instance;

        name = await getConfigName(db, name);
        
        const config = db.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        console.info(table([[config.content]]));

        const confirmation = await input({
            message: `Are you sure you want to load ${config.source} as ${flags.global ? 'global' : 'local'} npm config?`,
        });

        if (!confirmation) {
            console.info('Aborting');
            return;
        }


        await db.loadConfig(name, flags.global);
    });