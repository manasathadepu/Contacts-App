"use strict"
var app = angular.module('getDetailsCtrlModule', ['ui.router']);
app.controller('getDetailsCtrl', function ($scope, $http, $state, services) {


    //services.editContacts = {};

    //Scope Objects
    $scope.customerDetails = {};

    $scope.delContact = {};
    $scope.deleteContact = function (id) {
        $scope.delContact.id = id;
        var deleteObj = services.deleteContact($scope.delContact);
        deleteObj.then(function (response) {
            //console.log("Delete", response);
            if (response.data) {
                console.log("At 55");
                $scope.customerDetails = {};
                getData(); //this is function call option which won't reload entire page, but just calls the function . so , this is the best option to to use
                //$state.go("customer.customerList");
                //$state.reload();// this is reload option in which the entrie page is loaded
                //            alert("Resp"); //$window.location.reload();

            }

        })

    }
    //Intiall State and getNextState
    function getData() {
        console.log("contactList");
        var objLists = services.getContactList();
        objLists.then(function (response) {
            console.log(response);
            $scope.customerDetails = response.data.contactList;
        })
    }
    getData();

});
