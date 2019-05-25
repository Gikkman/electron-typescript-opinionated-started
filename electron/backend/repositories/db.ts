import * as Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

export const database = new Database('test.sqlite', {verbose: console.log});
migrate(true);

/*********************************************************************
 * INTERNAL FUNCTIONS
 ********************************************************************/

function migrate(force: boolean = false, table: string = 'migrations', migrationsPath: string = '.migrations') {
    const location = path.resolve(migrationsPath);

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
        const data = fs.readFileSync(filename, 'utf-8',);
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

    // Create a database table for migrations meta data if it doesn't exist
    database.exec(
        `CREATE TABLE IF NOT EXISTS "${table}" (
            id   INTEGER PRIMARY KEY,
            name TEXT    NOT NULL,
            up   TEXT    NOT NULL,
            down TEXT    NOT NULL
        )`
    );

    // Get the list of already applied migrations
    let dbMigrations = database.prepare(
      `SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`,
    ).all();

    // Undo migrations that exist only in the database but not in files,
    // also undo the last migration if the `force` option was set to `last`.
    const lastMigration = migrations[migrations.length - 1];
    for (const migration of dbMigrations.slice().sort((a, b) => Math.sign(b.id - a.id))) {
        if (!migrations.some(x => x.id === migration.id) || (force && migration.id === lastMigration.id)) {
            database.exec('BEGIN');
            try {
                database
                    .exec(migration.down)
                    .prepare(`DELETE FROM "${table}" WHERE id = ?`)
                    .run(migration.id);
                database.exec('COMMIT');
                dbMigrations = dbMigrations.filter(x => x.id !== migration.id);
            } catch (err) {
                database.exec('ROLLBACK');
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
            database.exec('BEGIN');
            try {
                database
                    .exec(migration.up)
                    .prepare(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`)
                    .run( migration.id, migration.name, migration.up, migration.down);
                database.exec('COMMIT');
            } catch (err) {
                database.exec('ROLLBACK');
                throw err;
            }
        }
    }
}