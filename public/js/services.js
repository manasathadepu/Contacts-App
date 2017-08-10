var app = angular.module("servicesModule", ['ui.router']);
app.service('services', ['$http', function ($http) {
    this.postContacts = function (enteredDetails) {
        var postObj = $http.post("http://localhost:3000/register", enteredDetails);
        return postObj;
    }
    this.loginCheck = function (enteredDetails) {
        var postObj = $http.post("http://localhost:3000/signin", enteredDetails);
        return postObj;
    }
    this.getContactList = function () {
        var getObj = $http.get("http://localhost:3000/contactsList");
        return getObj;
    }
    this.postCustomerContacts = function (enteredDetails) {
        var postObj = $http.post("http://localhost:3000/addContact", enteredDetails);
        return postObj;
    }
    this.getContactListId = function (id) {
        var getObj = $http.get("http://localhost:3000/getContact?id=" + id);
        return getObj;

    }
    this.updateContact = function (data) {
        console.log("data:" + data);
        var getObj = $http.post("http://localhost:3000/updateContact", data);
        return getObj;

    }

    this.deleteContact = function (data) {
        console.log(data);
        var delObj = $http.post("http://localhost:3000/deleteContact", data);
        return delObj;
    }
    this.getInfo = function () {
        var dashObj = $http.get("http://localhost:3000/getUserInfo");
        return dashObj;
    }
    this.logoutCheck = function () {
        var logOut = $http.get("http://localhost:3000/logout");
        return logOut;
    }
    this.getEmailCheck = function (data) {
        console.log('datatoget', data);
        var emailObj = $http.get("http://localhost:3000/forgotPswd?email=" + data);
        return emailObj;
    }
    this.updatePswd = function (data) {
        console.log("data:" + data);
        var restPswd = $http.post("http://localhost:3000/updatePswd", data);
        return restPswd;

    }

}])
