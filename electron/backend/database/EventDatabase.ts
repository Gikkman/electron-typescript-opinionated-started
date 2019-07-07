import { DatabaseBuilder, Database } from './Database';
import { dataLocation } from '@shared/Location';
import { isDev } from '@shared/IsDev'
import * as logger from 'electron-log';

export class EventDatabase extends Database {
    constructor() {
        let builder = new DatabaseBuilder(dataLocation("event.sqlite")).setVerboseLogger(logger.info);
        super(builder);
        this.migrate({ force: isDev });
    }
};

export var DB = new EventDatabase();