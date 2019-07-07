import * as BetterSqlite3 from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import {resourceLocation} from '@shared/Location';

/** Interface for describing the results of an update query.
 * 
 * @param changes number of row changed as a result of the query
 * @param lastInsertRowid the generated ID of the last inserted row
 */
export interface RunResult {
    /** @param changes number of row changed as a result of the query */
    changes : number;
    /** @param lastInsertRowid the generated ID of the last inserted row */
    lastInsertRowid : number | string;
}

/** Interface describing a database migration. 
 * 
 * @param force if true, we drop then re-apply the last migration when this method is called
 * @param table table to store migrations in. Defaults to 'migration'
 * @param migrationsPath path to where migration files resides, relative to the app root. Defualts to '.migrations'
 */
export interface MigrationOptions {
    /** @param force if true, we drop then re-apply the last migration when this method is called */
    force?: boolean,
    /** @param table table to store migrations in. Defaults to 'migration' */
    table?: string,
    /** @param migrationsPath path to where migration files resides, relative to the app root. Defualts to '.migrations' */
    migrationsPath?: string
}

/**
 *  Class for representing a database connection
 */
export abstract class Database {
    private database : BetterSqlite3.Database;

    /** Creates a new Connection instance. The connection is automatically closed when the application exists
     * 
     * @param builder a ConnectionBuilder with the settings for this connection
     */
    protected constructor(builder : DatabaseBuilder) {
        let file = builder.getDatabaseFile();
        let opts = builder.getDatabaseOptions();
        this.database = new BetterSqlite3(file, opts);
        process.on('exit', () => this.database.close());
    }

    /** Executes a SELECT and returns all rows that matches a certian SQL, given the parameters.
     *  
     * @param sql 
     * @param params 
     */
    queryAll(sql : string, ...params : any[]) : any[] {
        let func = sql.split(' ', 2)[0].toUpperCase();
        if (func === 'SELECT')
            return this.database.prepare(sql).all(params);
        throw new Error("Can only execute SELECT query");
    }

    /** Executes a SELECT and returns the first row that matches a certian SQL, given the parameters.
     *  
     * @param sql 
     * @param params 
     */
    queryFirst(sql : string, ...params : any[]) : any {
        let func = sql.split(' ', 2)[0].toUpperCase();
        if (func === 'SELECT')
            return this.database.prepare(sql).get(params);
        throw new Error("Can only execute SELECT query");
    }

    /** Executes a INSERT/UPDATE/DELETE or REPLACE, given the sql and parameters.
     *  
     * @param sql 
     * @param params 
     */
    update(sql : string, ...params : any[]) : RunResult {
        let func = sql.split(' ', 2)[0].toUpperCase();
        if (func === 'INSERT' || func === 'UPDATE' || func === 'DELETE' || func === 'REPLACE') {
            let res = this.database.prepare(sql).run(params);
            return {
                changes: res.changes,
                lastInsertRowid: res.lastInsertRowid.valueOf()
            }
        }
        throw new Error("Can only execute INSERT, UPDATE, DELETE or REPLACE query")
    }

    private opIs(sql: string, ...allowed: string[]) {
        let func = sql.split(' ', 2)[0].toUpperCase();
        return !!allowed
            .map(op => op.toUpperCase())
            .find(op => op === func);
    }

    /** Method for running a database migration. 
     * 
     * @param force if true, we drop then re-apply the last migration when this method is called
     * @param table table to store migrations in. Defaults to 'migration'
     * @param migrationsPath path to where migration files resides, relative to the app root. Defualts to '.migrations'
     */
    protected migrate(opts : MigrationOptions) {
        const force = opts.force || false;
        const table = opts.table || 'migrations'
        const migrationsPath = opts.migrationsPath || '.migrations';
        const location = resourceLocation(migrationsPath);

        // Get the list of migration files, for example:
        //   { id: 1, name: 'initial', filename: '001-initial.sql' }
        //   { id: 2, name: 'feature', fielname: '002-feature.sql' }
        const migrations = fs.readdirSync(location)
            .map(x => x.match(/^(\d+).(.*?)\.sql$/))
            .filter(x => x !== null)
            .map(x => ({ id: Number(x[1]), name: x[2], filename: x[0], up: '', down: '' }))
            .sort((a, b) => Math.sign(a.id - b.id));

        if (!migrations.length) {
            throw new Error(`No migration files found in '${location}'.`);
        }

        // Get the list of migrations, for example:
        //   { id: 1, name: 'initial', filename: '001-initial.sql', up: ..., down: ... }
        //   { id: 2, name: 'feature', fielname: '002-feature.sql', up: ..., down: ... }
        migrations.map(migration => {
            const filename = path.join(location, migration.filename);
            const data = fs.readFileSync(filename, 'utf-8');
            const [up, down] = data.split(/^--\s+?down\b/mi);
            if (!down) {
                const message = `The ${migration.filename} file does not contain '-- Down' separator.`;
                throw new Error(message);
            } else {
                // Trim comment rows and whitespaces
                migration.up = up.replace(/--.*?$/gm, '').trim();
                migration.down = down.replace(/--.*?$/gm, '').trim();
            }
        });

        // Create a this.database table for migrations meta data if it doesn't exist
        this.database.exec(
            `CREATE TABLE IF NOT EXISTS "${table}" (
                id   INTEGER PRIMARY KEY,
                name TEXT    NOT NULL,
                up   TEXT    NOT NULL,
                down TEXT    NOT NULL
            )`
        );

        // Get the list of already applied migrations
        let dbMigrations = this.database.prepare(
            `SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`,
        ).all();

        // Undo migrations that exist only in the database but not in files,
        // also undo the last migration if the `force` option was set to `last`.
        const lastMigration = migrations[migrations.length - 1];
        for (const migration of dbMigrations.slice().sort((a, b) => Math.sign(b.id - a.id))) {
            if (!migrations.some(x => x.id === migration.id) || (force && migration.id === lastMigration.id)) {
                this.database.exec('BEGIN');
                try {
                    this.database
                        .exec(migration.down)
                        .prepare(`DELETE FROM "${table}" WHERE id = ?`)
                        .run(migration.id);
                    this.database.exec('COMMIT');
                    dbMigrations = dbMigrations.filter(x => x.id !== migration.id);
                } catch (err) {
                    this.database.exec('ROLLBACK');
                    throw err;
                }
            } else {
                break;
            }
        }

        // Apply pending migrations
        const lastMigrationId = dbMigrations.length ? dbMigrations[dbMigrations.length - 1].id : 0;
        for (const migration of migrations) {
            if (migration.id > lastMigrationId) {
                this.database.exec('BEGIN');
                try {
                    this.database
                        .exec(migration.up)
                        .prepare(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`)
                        .run(migration.id, migration.name, migration.up, migration.down);
                    this.database.exec('COMMIT');
                } catch (err) {
                    this.database.exec('ROLLBACK');
                    throw err;
                }
            }
        }

        return this;
    }
}

export class DatabaseBuilder {
    private databaseFile : string;
    private inMemory?: boolean;
    private readOnly?: boolean;
    private fileMustExist?: boolean;
    private timeout?: number;
    private verboseLoggerFunc?: (message?: any, ...additionalArgs : any[]) => void;


    constructor(databaseFile : string) {
        this.databaseFile = databaseFile;
    }

    setInMemory(inMemory : boolean) {
        this.inMemory = inMemory;
        return this;
    }

    setReadOnly(readOnly : boolean) {
        this.readOnly = readOnly;
        return this;
    }

    setFileMustExist(fileMustExist : boolean) {
        this.fileMustExist = fileMustExist;
        return this;
    }

    setTimeout(timeout : number) {
        this.timeout = timeout;
        return this;
    }

    setVerboseLogger(func : (message?: any, ...additionalArgs : any[]) => void) {
        this.verboseLoggerFunc = func;
        return this;
    }

    getDatabaseFile() {
        return this.databaseFile;
    }

    getDatabaseOptions() {
        let opts = {};
        if (this.inMemory) opts["memory"] = this.inMemory;
        if (this.readOnly) opts["readonly"] = this.readOnly;
        if (this.fileMustExist) opts["fileMustExist"] = this.fileMustExist;
        if (this.timeout) opts["timeout"] = this.timeout;
        if (this.verboseLoggerFunc) opts["verbose"] = this.verboseLoggerFunc;
        return opts;
    }
}