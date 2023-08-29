import { Command } from "commander";
import { ConfigDB, ConfigRecord } from "../controller/db";
import { table } from 'table';

const recordToTableRow = (r: ConfigRecord) => [r.name, r.source, Object.keys(r.scripts ?? {}).join(", "), r.created, r.updated];

export const listConfigsCommand = new Command('list-configs')
    .action(async () => {
        const db = ConfigDB.instance;

        const records = db.list();
        

        console.info(`Found ${records.length} configs`);
        
        console.info(table(
        [
            ['Name', 'Source', 'Scripts', 'Created', 'Updated'],
            ...records.map(recordToTableRow)
        ], {
            columns: [
                {
                    width: 20,
                },
                {
                    width: 50,
                },
                {
                    width: 30,
                },
                {
                    width: 30,
                },
                {
                    width: 30,
                },
            ]
        }));
    })


export default listConfigsCommand;