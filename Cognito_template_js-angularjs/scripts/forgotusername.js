'use strict';

angular.module('myApp').controller('ForgotUsernameCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {

        var params = {
            UserPoolId: '', // Fill in
            AttributesToGet: ['preferred_username']
        };
        var userPool = new AWS.CognitoIdentityServiceProvider();
        userPool.listUsers(params, (err, data) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                var users = data["Users"];
                var user = {};
                for (let i = 0; i < users.length; i++) {
                    if ($('#email').val() == users[i].Username) {
                        user.username = users[i].Attributes[0].Value;
                        user.email = users[i].Username;
                        console.log(user);
                        // stuur email
                        $scope.errorMessage = "Username is: " + users[i].Attributes[0].Value;
                        $scope.$apply();
                    }
                }
            }
        });

    };

});