function studentService($http) {
	return {
		getStudent: function(studentId) {
			return $http.get('/students/' + studentId).then(function(res) {
				return res.data;
			});
		}
	}
}
studentService.$inject = ['$http'];
export default studentService;