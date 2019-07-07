import * as electron from 'electron';
import * as log from './Log';

const app = electron.app || electron.remote.app;
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

export var isDev = isEnvSet ? getFromEnv : !app.isPackaged;