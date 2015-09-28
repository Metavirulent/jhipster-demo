'use strict';

angular.module('demoApp')
    .controller('ConversationController', function ($scope, $location, Conversation, ConversationSearch, ParseLinks, $state, $stateParams, $rootScope) {
        $scope.conversations = [];
        $scope.page = 0;
//        $scope.currentConversation=currentConversation;
        //load conversation stated in state param id, e.g. /conversations/1
/*        $scope.loadCurrentConversation=function() {
            var cid=$stateParams.id;
            if(cid!=null && cid.length>0) {
                Conversation.get({id : cid},function(result) {
                    $scope.currentConversation=result;
                    $scope.refresh();
                    $rootScope.$broadcast('demoApp:conversationUpdate', result);

                });
            }
        }*/

        $scope.loadAll = function() {
            $scope.conversations = [];
            Conversation.query({page: $scope.page, size: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.conversations.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.conversations = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
//        $scope.loadCurrentConversation();
        $scope.loadAll();               //load all messages

        $scope.delete = function (id) {
            Conversation.get({id: id}, function(result) {
                $scope.conversation = result;
                $('#deleteConversationConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Conversation.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteConversationConfirmation').modal('hide');
                    $scope.clear();
                    if($scope.currentConversation!=null && $scope.currentConversation.id==id) {
                        $scope.currentConversation=null;
                        $location.path("conversations/");
                    }
                });
        };

        $scope.search = function () {
            ConversationSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.conversations = result;
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
            $scope.conversation = {name: null, id: null};
        };

        /**The user has selected the given conversation. Switch to it.*/
        $scope.selectConversation = function (conversation) {
//            $scope.currentConversation=conversation;
//            $location.path("/conversations/"+conversation.id);                  //change URL so we can bookmark it
            if(conversation!=null)
                $state.go("conversations", {id: conversation.id}, { reload: false });        //show the given conversation
            else $state.go("conversations", {}, {reload:false});
        };

        $scope.$on('demoApp:showConversation', function(e, result) {
            $scope.currentConversation=result;
        });

    });
