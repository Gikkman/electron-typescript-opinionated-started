import { DatabaseBuilder, Database } from './Database';
import { dataFile } from '@shared/Location';
import * as logger from 'electron-log';

export class EventDatabase extends Database {
    constructor() {
        let builder = new DatabaseBuilder(dataFile("event.sqlite")).setVerboseLogger(logger.info);
        super(builder);

        this.migrate({ force: false });
    }
};

export var DB = new EventDatabase();