module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  shipit.initConfig({
    default: {
      workspace: '/home/deploy/tmp',
      deployTo: '/home/deploy/epicvisor.com',
      repositoryUrl: 'git@bitbucket.org:epicvisor/epicvisor-app.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      deleteOnRollback: false,
      key: '~/.ssh/id_rsa.pub',
      shallowClone: true
    },
    production: {
      servers: 'deploy@192.168.33.10'
    }
  });

  shipit.task('pwd', function () {
    return shipit.remote('echo "hellow tomy" >> hi.txt');
  });
};