var userApp = angular.module('userApp', ['reCAPTCHA'])
	.config(function (reCAPTCHAProvider) {
    reCAPTCHAProvider.setPublicKey('6LeKQggTAAAAAJUEnnM9uVhuT_1veQD9mkH5MgkD');
 })
.factory('Recaptcha', function ($resource) {

        return $resource(
            '/email/send',
            {id: '@id'},
            {
                send: {
                    url: '/email/send',
                    method: 'POST'
                }
            }
        )
    });
function mainController(Recaptcha, $scope, $http) {
    $scope.formData = {};
		
    $scope.createUser = function() {

        $http.post('/api/recaptcha', $scope.captchaResponse)
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

