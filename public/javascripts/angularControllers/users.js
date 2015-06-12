var userApp = angular.module('userApp', []);
function mainController($scope, $http) {
    $scope.formData = {};
		
    $scope.createUser = function() {
				console.log($scope);
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

