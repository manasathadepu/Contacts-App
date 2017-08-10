var app = angular.module('contactsApp', ['ui.router', 'loginCtrlModule', 'registrationCtrlModule', 'servicesModule', 'forgotPswdCtrlModule', 'getDetailsCtrlModule', 'addContactsCtrlModule', 'editCtrlModule', 'indexCtrlModule']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: "home.html",
            controller: 'homeCtrl'
        })
        .state('home.login', {
            url: '/login',
            templateUrl: "login.html",
            controller: "loginCtrl",
            controllerAs: "login"
        })
        .state('home.singup', {
            url: '/singup',
            templateUrl: "singup.html",
            controller: 'registrationCtrl',
            controllerAs: "registration"

        })
        .state('home.dashboard', {
            url: '/dashboard/:name',
            templateUrl: "dashboard.html",
            controller: "dashCtrl",
            controllerAs: "dashboard"

        })
        .state('home.dashboard.contactList', {
            url: '/contactList',
            templateUrl: "contactList.html",
            controller: "getDetailsCtrl",
            controllerAs: "customerList"

        })
        .state('home.dashboard.updateContact', {

            url: '/contactList',
            templateUrl: "updateContact.html",
            controller: "editCtrl",
            controllerAs: "updateList"

        })
        .state('home.dashboard.addContact', {
            url: '/addContact',
            templateUrl: "addContact.html",
            controller: "addContactsCtrl",
            controllerAs: "addcontact"

        })
    //        .state('dashboard.logout', {
    //            url: '/logout',
    //            templateUrl: '/',
    //            controller: 'loginCtrl',
    //            controllerAs: 'login'
    //        })

});
app.controller('homeCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    console.log("entered homeCtrl");
    $rootScope.isLoginPage = true;
}]);

app.controller('dashCtrl', ['$stateParams', 'services', '$scope', '$window', '$location', '$state', '$rootScope', function ($stateParams, services, $scope, $window, $location, $state, $rootScope) {
    console.log("entered ");
    var dashObj = services.getInfo();
    dashObj.then(function (response) {
        console.log(response.data);
        if (response.data) {
            $scope.ifLoggedIn = true;
            $rootScope.isLoginPage = false;
        } else {
            $scope.ifLoggedIn = false;
            $rootScope.isLoginPage = true;
            $state.go('home.login');
        }

    });
    console.log("$stateParams", $stateParams.name);
    this.name = $stateParams.name;

    this.logOut = function () {
        var logOut = services.logoutCheck();
        logOut.then(function (response) {
            console.log("logout triggerred:: " + response.data);
            $scope.ifLoggedIn = false;
            $state.go('home.login');
        })
    }
}]);
