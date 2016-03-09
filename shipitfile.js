module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  shipit.initConfig({
    default: {
      workspace: './tmp/epicvisor',
      deployTo: '/home/deploy/code',
      repositoryUrl: 'git@bitbucket.org:epicvisor/epicvisor-app.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      deleteOnRollback: false,
      // key: '~/.ssh/id_rsa.pub',
      shallowClone: true
    },
    production: {
      servers: 'deploy@107.170.211.108'
    }
  });

  // shipit.task('push', function() {
  //   // shipit.remoteCopy('./', '/home/deploy/code').then(function(res){
      
  //   // });
  //   var filesToCopy;
  //   shipit.local('git ls-files');
    
  //   var tmpDir = 'epicvisor' + new Date().getTime();
  //   shipit.remote('mkdir /home/deploy/tmp/'+tmpDir).then(function(res) {
  //     shipit.remoteCopy('./', '/home/deploy/tmp/'+tmpDir);
  //   })
  // });


  shipit.task('pwd', function () {
    return shipit.remote('echo "hellow tomy" >> hi.txt');
  });
};  