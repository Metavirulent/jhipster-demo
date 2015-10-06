'use strict';

angular.module('demoApp').controller('TaskDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Task', 'Project', '$rootScope',
        function($scope, $stateParams, $modalInstance, entity, Task, Project, $rootScope) {

        $scope.task = entity;
        $scope.load = function(id) {
            Task.get({projectId: Project.currentProjectId(), id : id}, function(result) {
                $scope.task = result;
            });
        };

        var onSaveFinished = function (result) {
            $rootScope.$broadcast('demoApp:taskUpdate', result);
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


        $scope.delete = function (taskId) {
            $modalInstance.dismiss('cancel');
            $rootScope.$broadcast('demoApp:deleteTask', taskId);
        };

}]);
