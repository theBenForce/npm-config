import os from 'os';
import path from 'path';

export const getConfigPath = (global: boolean) => {
    return path.join(global ? os.homedir() : process.cwd(), '.npmrc');
};