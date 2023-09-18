import os from 'os';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import { getConfigPath } from '../utils/getConfigPath';

export enum ScriptTypes {
    PostLoad = 'postLoad',
}

export interface ConfigRecord {
    /** Name of the config */
    name: string;
    /** Filename this config was taken from */
    source: string;
    created: Date;
    updated: Date;
    content: string;

    scripts?: Record<ScriptTypes, string>;
}

export class ConfigDB {
    private _records: Array<ConfigRecord> = [];

    private static _instance: ConfigDB;

    static get instance() {
        if (!this._instance) {
            this._instance = new ConfigDB();
        }
        return this._instance;
    }

    constructor() {
        this.loadDatabase();
    }

    private get dbFilename() {
        return path.join(os.homedir(), '/.npmrepos.json');
    }

    private get localDbFilename() {
        return path.join(process.cwd(), '.npmrepos.json');
    }

    private loadDatabase() {
        this._records = [];

        for(const filename of [this.dbFilename, this.localDbFilename]) {
            
            if (fs.existsSync(filename)) {
                const newRecords = JSON.parse(fs.readFileSync(filename, 'utf-8'));
                const addMeta = (record: ConfigRecord) => ({
                    ...record,
                    filename,
                });

                if (Array.isArray(newRecords)) {
                    this._records.push(...newRecords.map(addMeta));
                } else if(Array.isArray(newRecords.records)) {
                    this._records.push(...newRecords.records.map(addMeta));
                } else {
                    throw new Error(`Invalid database format in ${filename}`);
                }
            }
        }

        this._records = this._records.sort((a, b) => a.name.localeCompare(b.name));
    }

    private save() {
        fs.writeFileSync(this.dbFilename, JSON.stringify(this._records, null, 2));
        console.info(`Database saved to ${this.dbFilename}`);
    }

    public list() {
        return this._records;
    }

    public get(name: string) {
        return this._records.find(r => r.name === name);
    }

    private async editText(filename: string, content: string): Promise<string> {
        const tempFilename = path.join(os.tmpdir(), filename);

        fs.writeFileSync(tempFilename, content, 'utf-8');

        const editor = process.env.EDITOR || 'vi';

        childProcess.spawnSync(editor, [tempFilename], {
            stdio: 'inherit',
        });
        
        const result = fs.readFileSync(tempFilename, 'utf-8');
        await fs.promises.unlink(tempFilename);

        return result;
    }

    async editScript(name: string, type: ScriptTypes = ScriptTypes.PostLoad): Promise<void> {
        const config = this.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        const script = await this.editText(`npmrepos-${name}-${type}.sh`, config?.scripts?.[type] || '');
        this.upsert({
            ...config!,
            scripts: {
                ...config?.scripts,
                [type]: script,
            },
        });
    }


    async editConfig(name: string) {
        const config = this.get(name);

        if(!config) {
            throw new Error(`Cannot find config ${name}`);
        }

        const content = await this.editText(`npmrepos-${name}.json`, config.content);

        this.upsert({
            ...config,
            content,
        });
    }

    public async loadConfig(name: string, global: boolean = false) {
        const configPath = getConfigPath(global);
        const config = this.get(name);

        if(fs.existsSync(configPath)) {
            console.info(`Backing up ${configPath} to ${configPath}.old`);
            await fs.promises.rename(configPath, configPath + '.old');
        }

        await fs.promises.writeFile(configPath, config!.content, 'utf-8');
        console.info(`Loaded ${configPath}`);

        if(config?.scripts?.[ScriptTypes.PostLoad]) {
            console.info(`Running post load script`);
            await childProcess.execSync(config.scripts[ScriptTypes.PostLoad]);
        }
    }

    public upsert(record: ConfigRecord) {
        const oldRecord = this.get(record.name);

        if (oldRecord) {
            record.created = oldRecord.created;
            this._records = this._records.filter(r => r.name !== record.name);
        } else {
            record.created = new Date();
        }
        
        this._records.push(record);
        console.info(`${record.name} Updated`);
        this.save();
    }

    public delete(name: string) {
        this._records = this._records.filter(r => r.name !== name);
        console.info(`${name} Deleted`);

        this.save();
    }

}