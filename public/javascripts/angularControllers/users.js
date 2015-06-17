var userApp = angular.module('userApp', [])
		.config(['$controllerProvider',
  		function($controllerProvider) {
    		$controllerProvider.allowGlobals();
  		}])
		.config(['$compileProvider',
		 function($compileProvider) {
				$compileProvider.debugInfoEnabled(true);
      }
    ]);

function mainController($scope, $http, $window) {
		//angular 1.3
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
                console.log("AFTER AJAX POST TO API, Response " + data);
								if(data===true){
									$window.location.replace("/board");
								}
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
							




    };

    $scope.login = function() {
				console.log("ANGULAR CONTROLLER FORM DATA LOGIN");
				console.log($scope.formData);
				console.log("ANGULAR CONTROLLER FORM DATA LOGIN END");
			
        $http.post('/api/login', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
							




    };

}


