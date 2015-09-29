'use strict';

angular.module('demoApp').controller('TaskDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Task', 'Project',
        function($scope, $stateParams, $modalInstance, entity, Task, Project) {

        $scope.task = entity;
        $scope.load = function(id) {
            Task.get({projectId: Project.currentProjectId(), id : id}, function(result) {
                $scope.task = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('demoApp:taskUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.task.id != null) {
                Task.update({projectId: Project.currentProjectId()},$scope.task, onSaveFinished);
            } else {
                Task.save({projectId: Project.currentProjectId()},$scope.task, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
