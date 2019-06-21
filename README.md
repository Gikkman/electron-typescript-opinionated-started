# electron-typescript-opinionated-started

This opinionated starter is intended to help with quickly getting an Electron app up, with a simple build process, and which can be debugged in VSCode using the native debugger (with breakpoints and everything). 

* To install this starter, clone the repository, then run `npm i`. This will install the dependecies, and build the native dependencies.
* To run this starter, either start it via the debugger in VSCode, or run `npm start`
* To build an artifact from this starter, run `npm run release-this`

This started comes with a bundled SQLite database. There is a migrations system in place.
* To create a new database migration, run `npm run new-migration migration-name-here`
* Migrations will occur on startup of the app

