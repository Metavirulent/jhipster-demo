'use strict';

angular.module('demoApp')
    .controller('RequestLoginNameController', function ($rootScope, $scope, $state, $timeout, Auth) {

        $scope.success = null;
        $scope.error = null;
        $scope.errorEmailNotExists = null;
        $scope.email = null;
        $timeout(function (){angular.element('[ng-model="email"]').focus();});

        $scope.sendLoginName = function () {

            $scope.error = null;
            $scope.errorEmailNotExists = null;

            Auth.sendLoginName($scope.email).then(function () {
                $scope.success = 'OK';
            }).catch(function (response) {
                $scope.success = null;
                if (response.status === 400 && response.data === 'e-mail address not registered') {
                    $scope.errorEmailNotExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });
        }

    });
