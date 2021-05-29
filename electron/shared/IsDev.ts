import * as electron from 'electron';

const app = electron?.app || electron?.remote?.app || {isPackaged: false};
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV ?? "0", 10) === 1;

export const IsDev = isEnvSet ? getFromEnv : !app.isPackaged;