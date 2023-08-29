import { Argument, Command, Option } from "commander";
import { ConfigDB } from "../controller/db";
import { getConfigName } from "../utils/getConfigName";
import { getScriptName } from "../utils/getScriptName";


export const viewScriptCommand = new Command('view-script')
    .description('View a script that will run before or after loading a config')
    .addArgument(new Argument('[config]', 'Name of the npm config'))
    .addOption(new Option('--script <script>', 'Name of the npm script'))
    .action(async (name: string, {script}: {script: string}) => {
        const db = ConfigDB.instance;
        
        name = await getConfigName(db, name);
        
        const config = db.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        const scriptName = await getScriptName(config, script);

        const scriptContent = config.scripts?.[scriptName] ?? '';

        console.info(scriptContent);
    });