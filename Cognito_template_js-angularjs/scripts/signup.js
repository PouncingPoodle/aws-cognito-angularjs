'use strict';

angular.module('myApp').controller('SignupCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();

        var nameParam = {
            Name: 'given_name',
            Value: $('#name').val()
        };
        var emailParam = {
            Name: 'email',
            Value: $('#email').val()
        };
        var usernameParam = {
            Name: 'preferred_username',
            Value: $('#username').val()
        };
        var phoneParam = {
            Name: 'phone_number',
            Value: $('#phone').val()
        };
        var projekpermissieParam = {
            Name: 'custom:projekpermissie',
            Value: 'klient'
        };

        var attributes = cognitoService.getUserAttributes(nameParam, emailParam, usernameParam, phoneParam, projekpermissieParam);

        userPool.signUp($('#email').val(), $('#password').val(), attributes, null, function(err, result) {
            if (err) {
                console.log(err);
                // Handle net die errors beter - hierdie gee rou error data
                $scope.errorMessage = err;
                $scope.$apply();
                return;
            } else {
                console.log(result);
                $location.path('/activate');
                $scope.$apply();
            }
        });

        return false;
    }

});