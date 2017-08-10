"use strict";
var app = angular.module("loginCtrlModule", ["ui.router"]);
app.controller("loginCtrl", ['services', '$state', '$scope', '$rootScope', function (services, $state, $scope, $rootScope) {
    console.log("Login Cntrl");
    var self = this;
    var enteredDetails = {};
    var name;
    $rootScope.isLoginPage = true;
    self.failure;
    self.loginCustomer = function () {
        console.log("entered loginCtrl");
        enteredDetails.userName = self.username;
        enteredDetails.password = self.password;
        var postObj = services.loginCheck(enteredDetails);
        postObj.then(function (response) {
            console.log(JSON.stringify(response.data.userinfo));;
            if (response.data.loginSuccess) {
                var user = response.data.userinfo.name


                $state.go('home.dashboard', {
                    name: user
                });

            } else {
                self.failure = false;
            }
        });
    }


    var data;
    $scope.checkData;
    self.checkEmail = function () {
        var enteredEmail = this.email;

        console.log('eneteredEmail:', enteredEmail);
        var emailCheck = services.getEmailCheck(enteredEmail);
        emailCheck.then(function (response) {
            console.log(response.data);
            data = response.data;
            if (data.status) {

                $scope.checkData = data;
                console.log('checkdata', $scope.checkData);
            } else {
                $scope.checkData = false;
            }

        });

    }
    self.resetPswd = function (data) {
        var pswd = data;
        var enteredPswd = {};

        enteredPswd.username = $scope.checkData.username;
        enteredPswd.pswd = pswd;
        console.log(enteredPswd);
        var rstPswd = services.updatePswd(enteredPswd);
        rstPswd.then(function (response) {
            console.log(response.data);
            if (response.data == "success") {
                console.log("successfully changed");
                $scope.checkData = true;
            } else {
                console.log("failaed to change");
            }
        })
    }



}])
