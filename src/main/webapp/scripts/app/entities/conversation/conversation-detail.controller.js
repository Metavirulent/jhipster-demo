'use strict';

angular.module('demoApp')
    .controller('ConversationDetailController', function ($scope, $rootScope, $stateParams, Conversation, Message, User, currentConversation, ParseLinks) {
        $scope.messages = [];           //all messages shown in the correct order
        $scope.page = 0;                //page we have loaded
        $scope.currentConversation=currentConversation;
//        $rootScope.$broadcast('demoApp:showConversation',currentConversation);

/*        $rootScope.$on('demoApp:showConversation', function(e, result) {
            $scope.currentConversation=result;
            $scope.reset();
        });*/
        $scope.$watch('currentConversation', function() {
            $scope.currentConversation.$promise.then(function() {
                $scope.$emit('demoApp:showConversation',$scope.currentConversation);
//            $scope.currentConversation=currentConversation;
                $scope.reset();
            });
        });

        $scope.loadAll = function(currentConversation) {
            Message.query({page: $scope.page, size: 20, cid: $scope.currentConversation.id}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.messages.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.messages = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
//        $scope.loadAll();

        $scope.delete = function (id) {
            Message.get({id: id}, function(result) {
                $scope.message = result;
                $('#deleteMessageConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Message.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteMessageConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            MessageSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.messages = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            var cid=0;
            if($scope.currentConversation!=null) cid=$scope.currentConversation.id;
            $scope.message = {text: null, id: null, conversationId: cid, userLogin: $rootScope.account.login};
            $scope.refocus=true;            //set to put focus on input field
        };        

//        $scope.refresh();

        $scope.sendMessage = function() {
            //send message
            $scope.message.conversationId=$scope.currentConversation.id;
            Message.save($scope.message,function(result) {
                $scope.messages.splice(0,0,result);
                $scope.clear();
            });
        }

        /*The name of the Conversation was changed.*/
        $scope.nameChanged=function() {
            Conversation.update($scope.currentConversation);
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
