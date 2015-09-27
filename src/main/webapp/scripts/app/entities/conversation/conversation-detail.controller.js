'use strict';

angular.module('demoApp')
    .controller('ConversationDetailController', function ($scope, $rootScope, $stateParams, currentConversation, Conversation, User) {
        $scope.conversation = currentConversation;
        $scope.message='';
        $scope.messages = [];
        $scope.refocus=true;
        $scope.load = function (id) {
            Conversation.get({id: id}, function(result) {
                $scope.conversation = result;
            });
        };
        $rootScope.$on('demoApp:conversationUpdate', function(event, result) {
            $scope.conversation = result;
        });

        $scope.sendMessage = function() {
            var msg={text: $scope.message, conversation: $scope.currentConversation, user: $rootScope.account};
            $scope.messages.splice(0,0,msg);
            //send message
            $scope.message='';
            $scope.refocus=true;
        }

        $scope.nameChanged=function() {
            Conversation.update($scope.conversation);
        }

    })
    .directive('reset-focus', function($timeout, $parse) {
        return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            scope.$watch("refocus", function(value) {
                console.log('value=',value);
                if(value==true) {
                    $timeout(function() {
                        element[0].focus();
                        scope.refocus=false;
                    })
                }
            });
        }
    };
});
