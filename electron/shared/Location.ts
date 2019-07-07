import { app } from 'electron';
import * as log from 'electron-log';
import * as path from 'path';
import * as os from 'os';
import {isDev} from './IsDev';
import {existsSync, mkdirSync} from 'fs';

var userDataDir = isDev ? path.resolve('./')
                    : process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR 
                        : app.getPath("userData");
export var dataDir =  isDev ? path.join(userDataDir, '_data') 
                        : path.join(userDataDir, 'data');
export var resourcesDir = isDev ? path.resolve("./")
                            : path.resolve(process.resourcesPath);

if (!existsSync(dataDir)) {
    try {
        mkdirSync(dataDir, { recursive: true });
    } catch (err) {
        let oldLogFile = log.transports.file.file;
        let oldLogLevel = log.transports.file.level;
        let newLogLocation = isDev ? path.resolve('./') : os.homedir();
        log.transports.file.file = path.join(newLogLocation, process.env.npm_package_name + "_error.log");
        log.error("Failed to create DataDir: " + dataDir);
        log.error(err);
        log.transports.file.file = oldLogFile;
        log.transports.file.level = oldLogLevel;
    }
}

export function dataLocation(file: string) {
    return path.join(dataDir, file);
}
export function logLocation(file: string) {
    return path.join(dataDir, file);
}
export function resourceLocation(file: string) {
    return path.join(resourcesDir, file);
}