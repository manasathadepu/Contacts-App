"use strict"
var app = angular.module('addContactsCtrlModule', ['ui.router']);
app.controller('addContactsCtrl', function ($scope, $http, $state, services) {
    var enteredDetails = {};
    $scope.addCustomer = function () {

        enteredDetails.firstName = $scope.firstname;
        enteredDetails.lastName = $scope.lastname;
        enteredDetails.phone = $scope.phonenumber;
        enteredDetails.email = $scope.email;
        enteredDetails.work = $scope.work;
        console.log(enteredDetails);

        var postObj = services.postCustomerContacts(enteredDetails);
        postObj.then(function (response) {
            console.log(JSON.stringify(response));
            $state.go("home.dashboard.contactList");
        })
    }


});
