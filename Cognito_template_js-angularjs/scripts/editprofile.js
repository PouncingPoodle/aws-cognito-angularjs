'use strict';

angular.module('myApp').controller('EditProfileCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();
        var currentUser = userPool.getCurrentUser();

        currentUser.getSession(function(err, session) {
            if (err) {
                $scope.errorMessage = 'Error: ' + err;
                $scope.$apply();
            }
            if (session.isValid()) {
                var nameParam = {
                    Name: 'given_name',
                    Value: $('#name').val()
                };
                var usernameParam = {
                    Name: 'preferred_username',
                    Value: $('#username').val()
                };
                var phoneParam = {
                    Name: 'phone_number',
                    Value: $('#phone').val()
                };
                var attributes = cognitoService.getUserAttributes(nameParam, usernameParam, phoneParam);
                currentUser.updateAttributes(attributes, function(err, result) {
                    if (err) {
                        $scope.errorMessage = 'Error: ' + err;
                        $scope.$apply();
                    } else {
                        $location.path('/contents');
                        $scope.$apply();
                    }
                    console.log('call result: ' + result);
                });
            } else {
                $scope.errorMessage = 'Error: ' + 'Session expired.';
                $scope.$apply();
            }
        });
    };

});