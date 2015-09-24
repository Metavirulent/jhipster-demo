'use strict';

angular.module('demoApp').controller('ConversationDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Conversation', 'User',
        function($scope, $stateParams, $modalInstance, entity, Conversation, User) {

        $scope.conversation = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Conversation.get({id : id}, function(result) {
                $scope.conversation = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('demoApp:conversationUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.conversation.id != null) {
                Conversation.update($scope.conversation, onSaveFinished);
            } else {
                Conversation.save($scope.conversation, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
