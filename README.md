EpicVisor API and views
======================
Setup
-----
Clone the repository and install the dependencies.

    $ git clone git@bitbucket.org:epicvisor/epicvisor-app.git my-project
    $ cd my-project
    $ npm install
    $ gulp serve

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

React
---------------
All React files and views will be stored under src/views. Those will need to be linked to the right file in server.js server.register


Digital Ocean set up
______________

There is a `deploy` user on the Droplet `epic-othello`

`ssh deploy@[ipaddres]`

Basically, Ian Likes Cats

Go passwordless

Append your keys to: `deploy@url.com:~/.ssh/authorized_keys`

Fly
__________

`fly production` will copy your project and run production npm to install dependencies


