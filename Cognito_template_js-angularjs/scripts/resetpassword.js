'use strict';

angular.module('myApp').controller('ResetPasswordCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {

        var userPool = cognitoService.getUserPool();
        var cognitoUser = cognitoService.getUser(userPool, $('#email').val());
        console.log(cognitoUser);

        cognitoUser.confirmPassword($('#verificationcode').val(), $('#password').val(), {
            onFailure: (err) => {
                console.log("Error: " + err);
                $scope.errorMessage = 'Error: ' + err;
                $scope.$apply();
            },
            onSuccess: (res) => {
                console.log("onSuccess: " + res);
                $location.path('/login');
                $scope.$apply();
            }
        });
    };

});