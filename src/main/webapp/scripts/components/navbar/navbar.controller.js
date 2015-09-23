'use strict';

angular.module('demoApp')
    .controller('NavbarController', function ($scope, $rootScope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
//        $rootScope.account = Principal.account();
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';

        $scope.logout = function () {
            Auth.logout();
            $state.go('home');
        };

    });
