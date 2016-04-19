function adminStudentsController($scope, studentService, user, students, $location) {
	if(user.role !== 'admin')
	{
		$location.path('/');
	}
	$scope.student = {};
	$scope.addStudent = function() {
		$scope.addResult = "";
		if($scope.student.name && $scope.student.email) {
			studentService.addStudent($scope.student).then(function(success) {
				$scope.students.push($scope.student);
				$scope.addResult = "success!";
				$scope.student = {};
			});
		}
		else {
			$scope.addResult = "You need name and year";
		}
		
	}
	$scope.students = students;
}

adminStudentsController.$resolve = {
	user: ['userService',function(userService) {
		return userService.getUser();
	}],
	students: ['studentService', function(studentService) {
		return studentService.getStudents();
	}]
};
adminStudentsController.$inject = ['$scope','studentService','user', 'students','$location'];
export default adminStudentsController;