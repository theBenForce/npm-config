import { Command } from "commander";
import { ConfigDB, ConfigRecord } from "../controller/db";
import { table } from 'table';

const recordToTableRow = (r: ConfigRecord) => [r.name, r.source, Object.keys(r.scripts ?? {}).join(", "), r.created, r.updated];

export const listConfigsCommand = new Command('list-configs')
    .description(`List all saved .npmrc configurations`)
    .action(async () => {
        const db = ConfigDB.instance;

        const records = db.list();
        

        console.info(`Found ${records.length} configs`);

        const rows = records.sort((a, b) => a.name.localeCompare(b.name)).map(recordToTableRow);
        
        console.info(table(
        [
            ['Name', 'Source', 'Scripts', 'Created', 'Updated'],
            ...rows
        ]));
    })


export default listConfigsCommand;