'use strict';

angular.module('demoApp').controller('MessageDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Message', 'User', 'Conversation',
        function($scope, $stateParams, $modalInstance, entity, Message, User, Conversation) {

        $scope.message = entity;
        $scope.users = User.query();
        $scope.conversations = Conversation.query();
        $scope.load = function(id) {
            Message.get({id : id}, function(result) {
                $scope.message = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('demoApp:messageUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.message.id != null) {
                Message.update($scope.message, onSaveFinished);
            } else {
                Message.save($scope.message, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
