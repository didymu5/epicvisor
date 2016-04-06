
function notificationsDirective(notificationsService) {
return {
    link: function(scope, element, attrs) {
      scope.notificationService = notificationService;
    },
    scope: {
    },
    templateUrl: 'templates/directives/notifications.html'   
  }
}
notificationsDirective.$inject = ['notificationsService'];
export default notificationsDirective;