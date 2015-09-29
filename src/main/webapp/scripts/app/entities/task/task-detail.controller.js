'use strict';

angular.module('demoApp')
    .controller('TaskDetailController', function ($scope, $rootScope, $stateParams, entity, Task, Project) {
        $scope.task = entity;
        $scope.load = function (id) {
            Task.get({id: id}, function(result) {
                $scope.task = result;
            });
        };
        $rootScope.$on('demoApp:taskUpdate', function(event, result) {
            $scope.task = result;
        });
    });
