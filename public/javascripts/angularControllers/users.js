var userApp = angular.module('userApp', []);
function mainController($scope, $http) {
    $scope.formData = {};
		$scope.recaptchaRegister = grecaptcha.render("recaptchaId", {
03        'sitekey': '6LeKQggTAAAAAJUEnnM9uVhuT_1veQD9mkH5MgkD'
04    });
		
    $scope.createUser = function() {

        $http.post('/api/recaptcha', grecaptcha.getResponse($scope.recaptchaRegister))
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

