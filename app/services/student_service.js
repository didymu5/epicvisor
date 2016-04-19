function studentService($http) {
	return {
		getStudent: function(studentId) {
			return $http.get('/students/' + studentId).then(function(res) {
				return res.data;
			});
		},
		addStudent: function(student) {
			return $http.post('/students/create', student).then(function(res) {
				return res.data;
			});
		},
		getStudents: function() {
			return $http.get('/students').then(function(res) {
				return res.data;
			});
		}
	}
}
studentService.$inject = ['$http'];
export default studentService;