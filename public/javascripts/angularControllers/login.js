var loginApp = angular.module('loginApp', [])
		.config(['$controllerProvider',
  		function($controllerProvider) {
    		$controllerProvider.allowGlobals();
  		}]);

function mainController($scope, $http, $window) {
		//angular 1.3
    $scope.formData = {};
	

    $scope.login = function() {
				console.log("ANGULAR CONTROLLER FORM DATA LOGIN");
				console.log($scope.formData);
				console.log("ANGULAR CONTROLLER FORM DATA LOGIN END");
			
        $http.post('/api/login', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
								if(data===true){
									$window.location.replace("/board");
								}
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
							




    };

}


