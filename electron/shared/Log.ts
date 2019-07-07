import * as logger from 'electron-log';
import {logLocation} from '@shared/Location'

logger.transports.file.level = 'info';
logger.transports.console.level = 'silly';
logger.catchErrors({onError: logger.error});

logger.transports.file.file = logLocation("application.log");

export function info(params: any) { logger.info(params); }
export function error(params: any) { logger.error(params); }
export function warn(params: any) { logger.warn(params); }
export function debug(params: any) { logger.debug(params); }