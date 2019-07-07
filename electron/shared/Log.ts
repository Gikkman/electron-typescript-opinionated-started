import * as logger from 'electron-log';
import {app} from 'electron';
import {isDev} from './IsDev';
import * as path from 'path';

logger.transports.file.level = 'info';
logger.transports.console.level = 'silly';
logger.catchErrors({onError: logger.error});

/* 
 * It is unfortunate that I need to copy this code from Location.ts, but
 * otherwise they'd need to require one another:
 * Location.ts would need this to log its messages, and this would need
 * Location.ts to know where to write the log file
 */
var AppDir = isDev ? path.resolve('./')
: process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR 
: app.getPath("appData");

var DataDir =  isDev ? path.join(AppDir, '_data') 
    : path.join(AppDir, process.env.npm_package_name,'data');

logger.transports.file.file = path.join(DataDir, '_data');

export function info(params: any) { logger.info(params); }
export function error(params: any) { logger.error(params); }
export function warn(params: any) { logger.warn(params); }
export function debug(params: any) { logger.debug(params); }