function notificationsService() {
	var notification;
	return {
		getNotification(): {
			return notification;
		},
		setNotification(notification): {
			notification = notification;
		}
	}
}
notificationsService.$inject = [];
export default notificationsService;