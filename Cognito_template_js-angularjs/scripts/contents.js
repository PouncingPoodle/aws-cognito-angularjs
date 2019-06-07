'use strict';

angular.module('myApp').controller('ContentsCtrl', function($scope, $location, cognitoService) {

    // When the user want to execute something - first check if the session is valid (checkRefreshToken) -> if it is, continue with the execution, if not signout the user
    $scope.testButton1 = function() {
        var userPool = cognitoService.getUserPool();
        var currentUser = userPool.getCurrentUser();
        if (cognitoService.checkRefreshToken(currentUser)) {
            // Do your code here - sesison was refreshed by the refreshToken and AWS.config.credentials was reset
        } else {
            var signout = confirm("The session expired and you will be signed out.");
            if (signout === true) {
                var userPool = cognitoService.getUserPool();
                var currentUser = userPool.getCurrentUser();
                cognitoService.logout(currentUser);
                localStorage.clear();
                $location.path('/login');
            };
        };
    };

    var userPool = cognitoService.getUserPool();
    var currentUser = userPool.getCurrentUser();
    console.log(currentUser);

    // Alternatively refresh the token every hour as your accessToken will expire every hour
    setInterval(function() {
        cognitoService.checkRefreshToken(currentUser);
    }, 3600000);

    // Testing of Lambda functions based on user permissions
    $scope.testButton1 = function() {
            var lambda = new AWS.Lambda({ region: '', apiVersion: '2015-03-31' }); // Fill in
            var pullParams = {
                FunctionName: '', // Fill in
                InvocationType: 'RequestResponse',
                LogType: 'None',
                Payload: '{"body":"hi"}'
            };
            var pullResults;
            lambda.invoke(pullParams, function(error, data) {
                if (error) {
                    prompt(error);
                    console.log("error");
                } else {
                    pullResults = JSON.parse(data.Payload);
                    console.log(pullResults);
                    console.log("success");
                }
            });
        }
        // Testing of Lambda functions based on user permissions    
    $scope.testButton2 = function() {
        var lambda = new AWS.Lambda({ region: '', apiVersion: '2015-03-31' }); // Fill in
        var pullParams = {
            FunctionName: '', // Fill in
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: '{"body":"hi"}'
        };
        var pullResults;
        lambda.invoke(pullParams, function(error, data) {
            if (error) {
                prompt(error);
                console.log("error");
            } else {
                pullResults = JSON.parse(data.Payload);
                console.log(pullResults);
                console.log("success");
            }
        });
    }

    // If you use Cognito as your Authentication provider in your Federated identity you must log in your user with the idToken
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognitoService.IdentityPoolId,
        Logins: {
            'cognito-idp.region.amazonaws.com/userpoolid': localStorage.getItem("idtoken") // Fill in
        }
    });
    // To not get an error here you need to do the AWS.config.credentials above
    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log(err);
        }
        // Get object from S3
        var s3 = new AWS.S3();
        s3.getSignedUrl('getObject', {
            Bucket: "", // Fill in
            Key: "" // Fill in
        }, function(err, url) {
            if (err)
                console.log(err);
            else
                console.log(url);
        });
        s3.getObject({ Bucket: "", Key: "" }, function(err, data) { // Fill in
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log(data); // successful response
            }
            $scope.urlsrc1 = "data:image/jpeg;base64," + encode(data.Body);
            console.log($scope.urlsrc1);
            $scope.$apply();
        });
    });

    $scope.refreshSession = function() {
        cognitoService.checkRefreshToken(currentUser);
    };

    function encode(data) {
        var str = data.reduce(function(a, b) { return a + String.fromCharCode(b) }, '');
        return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
    };

    // Logout
    $scope.logout = function() {
        cognitoService.logout(currentUser);
        $location.path('/login');
        $scope.$apply();
    };

});