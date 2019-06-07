'use strict';

angular.module('myApp').controller('ForgotPasswordCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {

        var userPool = cognitoService.getUserPool();
        var cognitoUser = cognitoService.getUser(userPool, $('#email').val());

        cognitoUser.forgotPassword({
            onSuccess: function(result) {
                console.log('call result: ' + JSON.stringify(result));
                console.log("Verification code has been sent.");
                $location.path('/resetpassword');
                $scope.$apply();
            },
            onFailure: function(err) {
                $scope.errorMessage = 'Error: ' + err;
                $scope.$apply();
            }
        });

    };

});