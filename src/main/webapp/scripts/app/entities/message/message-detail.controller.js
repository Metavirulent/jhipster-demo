'use strict';

angular.module('demoApp')
    .controller('MessageDetailController', function ($scope, $rootScope, $stateParams, entity, Message, User, Conversation) {
        $scope.message = entity;
        $scope.load = function (id) {
            Message.get({id: id}, function(result) {
                $scope.message = result;
            });
        };
        $rootScope.$on('demoApp:messageUpdate', function(event, result) {
            $scope.message = result;
        });
    });
