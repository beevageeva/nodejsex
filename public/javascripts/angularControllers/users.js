var userApp = angular.module('userApp', ['vcRecaptcha']);
function mainController($scope, $http, vcRecaptchaService) {
    $scope.formData = {};
		
    $scope.createUser = function() {

        $http.post('/api/recaptcha', vcRecaptchaService.getResponse())
					.success(function(data){
		        $http.post('/api/users', $scope.formData)
		            .success(function(data) {
		                $scope.formData = {}; // clear the form so our user is ready to enter another
		                console.log(data);
		            })
		            .error(function(data) {
		                console.log('Error: ' + data);
		            });
							
					})
					.error(function(data) {
                    console.log('Error: ' + data);
										grecaptcha.reset();
          	});




    };


}

