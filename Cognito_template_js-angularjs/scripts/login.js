'use strict';

angular.module('myApp').controller('LoginCtrl', function($scope, $location, cognitoService) {

    $scope.submit = function() {
        var userPool = cognitoService.getUserPool();

        var cognitoUser = cognitoService.getUser(userPool, $('#email').val());
        var authenticationDetails = cognitoService.getAuthenticationDetails($('#email').val(), $('#password').val());

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                console.log(result);
                var accessToken = result.getAccessToken().getJwtToken();
                $scope.accessToken = accessToken;
                localStorage.setItem("accesstoken", accessToken);
                // console.log(accessToken);
                var currentUser = userPool.getCurrentUser();
                console.log(currentUser);
                localStorage.setItem("idtoken", result.idToken.jwtToken);
                cognitoService.userLoggedIn("cognito-idp.region.amazonaws.com/userpoolid", result.idToken.jwtToken); // Fill in
                console.log(AWS.config.credentials);

                const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })
                var params = {
                    AccessToken: accessToken
                };
                $scope.profile = {};
                cognitoidentityserviceprovider.getUser(params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                    } else {
                        // console.log(data); // successful response
                        for (let i = 0; i < data.UserAttributes.length; i++) {
                            if (data.UserAttributes[i].Name == "sub")
                                $scope.profile.id = data.UserAttributes[i].Value;
                            if (data.UserAttributes[i].Name == "phone_number")
                                $scope.profile.phonenumber = data.UserAttributes[i].Value;
                            if (data.UserAttributes[i].Name == "preferred_username")
                                $scope.profile.username = data.UserAttributes[i].Value;
                            if (data.UserAttributes[i].Name == "given_name")
                                $scope.profile.name = data.UserAttributes[i].Value;
                            if (data.UserAttributes[i].Name == "email")
                                $scope.profile.email = data.UserAttributes[i].Value;
                        }
                        // console.log($scope.profile);
                    }
                });
                $location.path('/contents');
                $scope.$apply();
            },
            onFailure: function(err) {
                $scope.errorMessage = 'Error: ' + err;
                $scope.$apply();
            }
        });
    };

});