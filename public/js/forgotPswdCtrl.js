var app = angular.module("forgotPswdCtrlModule", ['ui.router']);
app.controller = ('forgotPswdCtrl', [function () {
    console.log("entered forgotPswdCtrl");
    var pswd = this;
    pswd.checkEmail = function () {
        var enteredEmail = this.email;
        console.log('eneteredEmail:', enteredEmail);
    }
}])
