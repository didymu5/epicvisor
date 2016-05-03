function adminStudentsController($scope, studentService, user, students, $location, $q) {
	if(user.role !== 'admin')
	{
		$location.path('/');
	}
	$scope.add = function(){
	  var f = document.getElementById('file').files[0],
	      r = new FileReader();
	  r.onloadend = function(e){
	    var data = e.target.result;
	    var dataAsCsv = data.split("\n").map(function(data) {
	    	return data.split(",");
	    });
	    var firstRow = dataAsCsv.splice(0,1)[0];
	    var restOfRows = dataAsCsv.map(function(dataRow) {
	    	var dataObject = {};
	    	firstRow.forEach(function(header, index) {
	    		dataObject[header] = dataRow[index];
	    	});
	    	return dataObject;
	    }); 
	    restOfRows = restOfRows.filter(function(row) {
	    	return !!row.email;
	    });
	    console.log(restOfRows);
	    var awesome_students = restOfRows.map(function(student) {
	    	return studentService.addStudent({name: student.first_name + " " + student.last_name,
	    		email: student.email,
	    		class_year: student.class_year
	    	});
	    });
	    $q.all(awesome_students).then(function(students) {
	    	$scope.students = $scope.students.concat(students);
	    });
	    //send you binary data via $http or $resource or do anything else with it
	  }
	  r.readAsBinaryString(f);
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
adminStudentsController.$inject = ['$scope','studentService','user', 'students','$location', '$q'];
export default adminStudentsController;