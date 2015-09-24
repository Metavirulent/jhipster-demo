'use strict';

angular.module('demoApp')
    .controller('ConversationController', function ($scope, Conversation, ConversationSearch, ParseLinks, currentConversation) {
        $scope.conversations = [];
        $scope.currentConversation = currentConversation;
        $scope.page = 0;
        $scope.loadAll = function() {
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
        $scope.loadAll();

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
    });
