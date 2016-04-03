EpicVisor API and views
======================
Setup
-----
Clone the repository and install the dependencies.

    $ git clone git@bitbucket.org:epicvisor/epicvisor-app.git my-project
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


Dev server to run you 
React (no more)
---------------
All React files and views will be stored under src/views. Those will need to be linked to the right file in server.js server.register


Migrations
-------
To run migreations it calls on [sequlize cli](https://github.com/sequelize/cli).

`npm run migrate [flags, tags, commands]`


Digital Ocean set up
-----

On DO, we have a server called Grandtham. You'll have to add your SSh key to it and go passwardless.

To deploy from your local
1.) `chmod +x deploy`
2.) ./deploy

What this will do is ssh into the server `git pull` into the directory `/opt/epicvisor-app` then `npm prune` and `npm install`


