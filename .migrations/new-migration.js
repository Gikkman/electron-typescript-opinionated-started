const fs = require('fs');
const path = require('path');
const log = require('electron-log');

const name = process.argv[2];
if(!name) {
    log.error('You need to pass a name for the migration file');
    return;
}
const now = new Date().getTime();
const fileName = now + "-" + name + ".sql";
const contentTemplate = 
      "--------------------------------------------------\n"
    + "-- Up\n"
    + "--------------------------------------------------\n"
    + "\n"
    + "SELECT 1;\n"
    + "\n"
    + "--------------------------------------------------\n"
    + "-- Down\n"
    + "--------------------------------------------------\n"
    +"\n"
    + "SELECT 1;"
try {
    log.info("Creating new migration file " + fileName);
    fs.writeFileSync(path.join(__dirname, fileName), contentTemplate);
    log.info("New migration file created");
} catch(err) {
    log.error("Error creating migration file")
    log.error(err);
}