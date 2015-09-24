'use strict';

angular.module('demoApp')
    .controller('ConversationDetailController', function ($scope, $rootScope, $stateParams, currentConversation, Conversation, User) {
        $scope.conversation = currentConversation;
        $scope.load = function (id) {
            Conversation.get({id: id}, function(result) {
                $scope.conversation = result;
            });
        };
        $rootScope.$on('demoApp:conversationUpdate', function(event, result) {
            $scope.conversation = result;
        });
    });
