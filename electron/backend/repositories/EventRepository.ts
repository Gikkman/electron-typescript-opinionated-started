import { DB } from '../database/EventDatabase';
import { Event } from '@shared/Event';
import * as logger from 'electron-log';

export function save(content : string) {
    let res = DB.update("INSERT INTO event (content) VALUES (?)", content);
    logger.info("Changes " + res.changes);
    logger.info("Insert ID " + res.lastInsertRowid);
}

export function all() : Event[] {
    return DB.queryAll('SELECT * FROM event');
}