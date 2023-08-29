import { select } from "@inquirer/prompts";
import { ConfigDB } from "../controller/db";


export const getConfigName = async (db: ConfigDB, name?: string): Promise<string> => {
    return name || await select({
        message: 'Select a config to load',
        choices: db.list().map(config => ({
            name: config.name,
            value: config.name,
        })),
        validate(value) {
            if (!value) {
                return 'You must select a config';
            }

            return db.list().some(r => r.name === value) ? true : 'Invalid config';
        },
    });
}