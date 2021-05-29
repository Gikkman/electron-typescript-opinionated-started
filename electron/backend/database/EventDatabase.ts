import { DatabaseBuilder, Database } from './Database';
import { dataLocation } from '@shared/Location';
import { IsDev } from '@shared/IsDev';
import { info } from '@shared/Log';

export class EventDatabase extends Database {
    constructor() {
        let builder = new DatabaseBuilder(dataLocation("event.sqlite")).setVerboseLogger(info);
        super(builder);
        this.migrate({ force: IsDev });
    }
};

let database: EventDatabase;

export function DB(){
    if(database) return database;
    database = new EventDatabase();
    return database;
}