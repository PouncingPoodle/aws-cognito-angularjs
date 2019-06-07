'use strict';

angular.module('myApp').controller('ChangePasswordCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();
        var currentUser = userPool.getCurrentUser();

        if (currentUser != null) {
            currentUser.getSession(function(err, session) {
                if (err) {
                    $scope.errorMessage = 'Error: ' + err;
                    $scope.$apply();
                }
                if (session.isValid()) {
                    currentUser.changePassword($('#oldpassword').val(), $('#newpassword').val(), function(err, result) {
                        if (err) {
                            $scope.errorMessage = 'Error: ' + err;
                            $scope.$apply();
                        } else {
                            $location.path('/contents');
                            $scope.$apply();
                        }
                    });
                } else {
                    $scope.errorMessage = 'Error: ' + 'Session expired.';
                    $scope.$apply();
                }
            });
        } else {
            $scope.errorMessage = 'Error: ' + 'Not logged in.';
            $location.path('/login');
            $scope.$apply();
        }
    };

});