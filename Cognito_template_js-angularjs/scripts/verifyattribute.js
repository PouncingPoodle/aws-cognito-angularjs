'use strict';

angular.module('myApp').controller('VerifyAttributeCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();
        var currentUser = userPool.getCurrentUser();

        currentUser.getSession(function(err, session) {
            if (err) {
                $scope.errorMessage = 'Error: ' + err;
                $scope.$apply();
            }
            if (session.isValid()) {
                currentUser.verifyAttribute($scope.verifyitem, $('#verificationcode').val(), {
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
            } else {
                $scope.errorMessage = 'Error: ' + 'Session expired.';
                $scope.$apply();
            }
        });
    };

});