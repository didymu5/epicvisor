EpicVisor API and views
======================
Setup
-----
Clone the repository and install the dependencies.

    $ git clone ...
    $ cd my-project
    $ npm install
    $ npm run serve-dev

Do not forget to install globally gulp if not installed yet.

Build for older Node versions
-----
If you want to build the project run.

    $ gulp build

A dist folder will appear with all source scripts transpiled to ES5.

Testing
---------
Two options exists to run tests, the first one is for development process and aims to practice Test Driven Development.

    $ gulp tdd

The other option to just run tests once.
    
    $ gulp test

Webpack
-------
Webpack is use to bundle the front-end app: Angular. It compiles `app/app.js` and outputs to `public/js/bundle.js`

To run Webpack when you want to: `node_modules/.bin/webpack`

Append `--watch` to watch for changes to app.js as you're working on it.


Migrations
-------
To run migreations it calls on [sequlize cli](https://github.com/sequelize/cli).

`npm run migrate [flags, tags, commands]`



