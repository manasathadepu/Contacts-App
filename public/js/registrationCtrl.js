var app = angular.module('registrationCtrlModule', ['ui.router']);
app.controller('registrationCtrl', ['services', '$state', function (services, $state) {
    var enteredDetails = {};
    this.addCustomer = function () {
        console.log("entered the registrationCtrl");
        enteredDetails.userName = this.username;
        enteredDetails.password = this.password;
        enteredDetails.firstName = this.firstname;
        enteredDetails.lastName = this.lastname;
        enteredDetails.phone = this.phonenumber;
        enteredDetails.email = this.email;
        enteredDetails.contacts = [];
        console.log(enteredDetails);
        var postObj = services.postContacts(enteredDetails);
        postObj.then(function (response) {
            console.log(JSON.stringify(response));
            $state.go('home.login');
        });
    }
            }]);
