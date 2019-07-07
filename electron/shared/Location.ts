import { app } from 'electron';
import * as path from 'path';
import * as log from './Log';
import {isDev} from './IsDev';
import {existsSync, mkdirSync} from 'fs';

var AppDir = isDev ? path.resolve('./')
            : process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR 
            : app.getPath("appData");

var DataDir =  isDev ? path.join(AppDir, '_data') 
                : path.join(AppDir, process.env.npm_package_name,'data');

if (!existsSync(DataDir)) {
    log.info("Have to create DataDir: " + DataDir)
    try {
        mkdirSync(DataDir, { recursive: true });
        log.info("Created DataDir: " + DataDir);
    } catch (err) {
        log.error("Failed to create DataDir: " + DataDir);
    }
}
export function dataFile(file: string) {
    return path.join(DataDir, file);
}

log.info("AppDir: " + AppDir);
log.info("DataDir: " + DataDir);