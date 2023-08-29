import { Argument, Command } from "commander";
import { ConfigDB } from "../controller/db";
import { getConfigName } from "../utils/getConfigName";

export const viewConfigCommand = new Command('view-config')
    .addArgument(new Argument('[name]', 'Name of the npm config'))
    .action(async (name: string) => {
        const db = ConfigDB.instance;

        name = await getConfigName(db, name);

        const record = ConfigDB.instance.get(name);

        if(!record) {
            console.error(`Cannot find config ${name}`);
            return;
        }

        console.info(`Viewing config ${name}\n\n`);
        console.info(record.content);
    });

export default viewConfigCommand;