var userApp = angular.module('userApp', []);
function mainController($scope, $http) {
    $scope.formData = {};
	
		$scope.verifyResponse = function(response){
			console.log("verifyResponse in angular controller");
			$scope.formData.captchaResp = response;
		}

	
    $scope.createUser = function() {
				console.log("ANGULAR CONTROLLER FORM DATA");
				console.log($scope.formData);
				console.log("ANGULAR CONTROLLER FORM DATA END");
			
        $http.post('/api/users', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
							




    };


}

