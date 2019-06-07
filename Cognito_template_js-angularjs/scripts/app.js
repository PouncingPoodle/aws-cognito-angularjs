'use strict';

var app = angular.module('myApp', [
        'ui.router'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('base', {
                abstract: true,
                url: '',
                templateUrl: 'views/base.html'
            })
            .state('login', {
                url: '/login',
                parent: 'base',
                title: 'Login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                parent: 'base',
                title: 'Sign Up',
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .state('forgotpassword', {
                url: '/forgotpassword',
                parent: 'base',
                title: 'Forgot password',
                templateUrl: 'views/forgotpassword.html',
                controller: 'ForgotPasswordCtrl'
            })
            .state('resetpassword', {
                url: '/resetpassword',
                parent: 'base',
                title: 'Reset passowrd',
                templateUrl: 'views/resetpassword.html',
                controller: 'ResetPasswordCtrl'
            })
            .state('changepassword', {
                url: '/changepassword',
                parent: 'base',
                title: 'Change passowrd',
                templateUrl: 'views/changepassword.html',
                controller: 'ChangePasswordCtrl'
            })
            .state('activate', {
                url: '/activate',
                parent: 'base',
                title: 'Activate',
                templateUrl: 'views/activate.html',
                controller: 'ActivateCtrl'
            })
            .state('editprofile', {
                url: '/editprofile',
                title: 'editprofile',
                templateUrl: 'views/editprofile.html',
                controller: 'EditProfileCtrl'
            })
            .state('verifyattribute', {
                url: '/verifyattribute',
                title: 'verifyattribute',
                templateUrl: 'views/verifyattribute.html',
                controller: 'VerifyAttributeCtrl'
            })
            .state('forgotusername', {
                url: '/forgotusername',
                title: 'forgotusername',
                templateUrl: 'views/forgotusername.html',
                controller: 'ForgotUsernameCtrl'
            })
            .state('contents', {
                url: '/contents',
                title: 'Contents',
                templateUrl: 'views/contents.html',
                controller: 'ContentsCtrl'
            });
    });

app.service('cognitoService', function() {

    this.IdentityPoolId = ''; // Fill in
    this.UserPoolId = ''; // Fill in
    this.ClientId = ''; // Fill in

    AWS.config.region = ''; // Fill in
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: '' // Fill in
    });

    AWSCognito.config.region = ''; // Fill in
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: '' // Fill in
    });

    this.getUserPool = function() {
        var poolData = {
            UserPoolId: '', // Fill in
            ClientId: '' // Fill in
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        return userPool;
    };

    this.getUser = function(userPool, username) {
        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        return cognitoUser;
    };

    this.getAuthenticationDetails = function(username, password) {
        var authenticationData = {
            Username: username,
            Password: password
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        return authenticationDetails;
    };

    this.getUserAttributes = function() {
        var attributes = [];
        for (var i = 0; i < arguments.length; i++) {
            var attr = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(arguments[i]);
            attributes.push(attr);
        }
        return attributes;
    };

    this.checkRefreshToken = function(currentUser) {
        currentUser.getSession(function(err, session) {
            if (err) {
                console.log(err);
                return false;
            }
            var refresh_token = session.getRefreshToken();
            console.log(AWS.config.credentials.needsRefresh());
            if (AWS.config.credentials.needsRefresh()) {
                currentUser.refreshSession(refresh_token, (err, session) => {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    console.log(session);
                    AWS.config.credentials.refresh((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("TOKEN SUCCESSFULLY UPDATED");
                            AWSCognito.config.region = ''; // Fill in
                            AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
                                IdentityPoolId: '' // Fill in
                            });
                            console.log(AWS.config.credentials);
                        }
                    });
                });
            }
        });
        return true;
    }

    this.userLoggedIn = function(providerName, token) {
        AWS.config.region = ''; // Fill in
        AWS.config.credentials.params.Logins = AWS.config.credentials.params.Logins || {};
        AWS.config.credentials.params.Logins[providerName] = token;
        // console.log(AWS.config.credentials.params.Logins[providerName]);
        console.log(AWS.config.credentials);
        AWS.config.credentials.expired = true;
    }

    this.logout = function(currentUser) {
        console.log("logout");
        localStorage.removeItem("idtoken");
        if (currentUser != null) {
            currentUser.signOut();
        }
    }

});