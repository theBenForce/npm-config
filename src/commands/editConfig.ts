import { Argument, Command } from "commander";
import { ConfigDB } from "../controller/db";
import { getConfigName } from "../utils/getConfigName";


export const editConfigCommand = new Command('edit-config')
    .description('Edit a saved .npmrc file using your default editor')
    .addArgument(new Argument('[name]', 'Name of the npm config'))
    .action(async (name: string) => {
        const db = ConfigDB.instance;

        name = await getConfigName(db, name);

        const config = db.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        await db.editConfig(name);
    });