import { Argument, Command, Option } from "commander";
import { getConfigName } from "../utils/getConfigName";
import { ConfigDB, ScriptTypes } from "../controller/db";
import { getScriptName } from "../utils/getScriptName";

export const editScriptCommand = new Command('edit-script')
    .addArgument(new Argument('[config]', 'Name of the npm script'))
    .addOption(new Option('--type <type>', 'Type of the script'))
    .action(async (name: string, {type}: {type: string}) => {
        const db = ConfigDB.instance;
        
        name = await getConfigName(db, name);

        const config = db.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        const scriptName = await getScriptName(config, type);
        
        await db.editScript(name, scriptName);
    });