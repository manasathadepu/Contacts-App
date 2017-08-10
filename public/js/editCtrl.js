var app = angular.module('editCtrlModule', ['ui.router'])
app.controller('editCtrl', function ($scope, $state, services) {
    //$scope.editContacts = {};
    //app.controller('editParentCtrl',function($scope,$state,services){
    $scope.editContact = function (id) {
        console.log(id);
        var getObj = services.getContactListId(id);
        getObj.then(function (response) {
            console.log(response.data);
            services.editContacts = response.data;
            console.log(services.editContacts);
            $state.go("home.dashboard.updateContact");
            //            callBroadcast();

        });

    }

    $scope.editContacts = services.editContacts;
    console.log('$scope.editContacts', $scope.editContacts);

    //function callBroadcast() {
    $scope.$broadcast("selectedEditDetails", $scope.editContacts);
    //}
});

app.controller('editChild', function ($state, $scope, services) {
    var enteredDetails = {};

    function emitevent() {
        $scope.$on('selectedEditDetails', function (event, data) {
            console.log('editchild data', data);
            $scope.editContacts = data;
        });
    }
    emitevent();
    $scope.editCutomerDetails = function () {

        var pushObj = services.updateContact($scope.editContacts);
        pushObj.then(function (response) {
            console.log(response.data);
            $scope.editContacts = response.data;
            console.log($scope.editContacts);


            $state.go("home.dashboard.contactList");
        });


    }
});
//})
