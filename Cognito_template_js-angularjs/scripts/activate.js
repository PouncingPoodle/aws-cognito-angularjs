'use strict';

angular.module('myApp').controller('ActivateCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();
        var cognitoUser = cognitoService.getUser(userPool, $('#email').val());
        var activationKey = $('#activationCode').val();
        cognitoUser.confirmRegistration(activationKey, true, function(err, result) {
            if (err) {
                console.log(err);
                $scope.errorMessage = err;
                $scope.$apply();
                return;
            }
            $location.path('/login');
            $scope.$apply();
        });
    };

    return false;
});