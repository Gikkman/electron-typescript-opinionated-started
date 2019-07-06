import { app } from 'electron';
import { resolve, join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import * as log from 'electron-log';

var AppDir = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : app.getPath("appData");
var HomeDir = app.getPath("home");
var DataDir = join(AppDir, '.electron-example/data');
var CodeDir = resolve(__dirname, '../');

export function DataFile(file : string) {
    return join(DataDir, file);
}

export function CodeFile(file : string) {
    return resolve(CodeDir, file);
}

if (!existsSync(DataDir)) {
    log.info("Have to create DataDir: " + DataDir)
    try {
        mkdirSync(DataDir, { recursive: true });
        log.info("Created DataDir: " + DataDir);
    } catch (err) {
        log.error("Failed to create DataDir: " + DataDir);
    }
}

log.info("Exposing directory locations")
log.info("App dir: " + AppDir);
log.info("Home dir: " + HomeDir);
log.info("Code dir: " + CodeDir);
log.info("Data dir: " + DataDir);
