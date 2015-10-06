'use strict';

angular.module('demoApp')
    .controller('TaskController', function ($scope, Task, TaskSearch, ParseLinks, Project, tasks, currentProject) {
        $scope.tasks = tasks;
        $scope.page = 0;
        $scope.currentProject=currentProject;
        $scope.$emit('demoApp:showProject',currentProject);
        $scope.searchQuery='';

/*        $scope.$on('demoApp:showProject', function(e, result) {
            $scope.currentProject=result;
            $scope.reset();
        });*/

        $scope.loadAll = function() {
            if($scope.currentProject!=null /*&& $scope.currentProject.$promise.isFulfilled()*/)
                Task.query({page: $scope.page, size: 20, projectId:$scope.currentProject.id}, function(result, headers) {
                    $scope.links = ParseLinks.parse(headers('link'));
                    $scope.addTasks(result);
                });
        };

        $scope.addTasks = function(result) {
            if(result.length>0) {
                if(result[0].projectId==Project.currentProjectId())             //might be coming late for wrong project
                    for (var i = 0; i < result.length; i++) {
                        $scope.tasks.push(result[i]);
                    }
            }
        }

        $scope.reset = function() {
            $scope.page = 0;
            $scope.tasks = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };

//        if(Project.currentProjectId()!=0)
//        $scope.loadAll();
//        $scope.addTasks(tasks);

        $scope.$on('demoApp:deleteTask', function(e,taskId) {
            $scope.delete(taskId);
        });

        $scope.delete = function (taskId) {
            Task.get({projectId: $scope.currentProject.id, id: taskId}, function(result) {
                $scope.task = result;
                $('#deleteTaskConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (taskId) {
            Task.delete({projectId: $scope.currentProject.id, id: taskId},
                function () {
                    $scope.reset();
                    $('#deleteTaskConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            TaskSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.tasks = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.reset();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.task = {title: null, description: null, id: null, projectId: $scope.currentProject.id};
        };

        /*The name of the Project was changed.*/
        $scope.projectNameChanged=function() {
            Project.update($scope.currentProject,function() {
                $scope.$emit('demoApp:projectUpdate',$scope.currentProject);
            });
        }

        $scope.$on('demoApp:taskUpdate', function(e, result) {
            for(var i=0;i<$scope.tasks.length;i++)
                if($scope.tasks[i].id==result.id) {
                    $scope.tasks[i]=result;
                    return;
                }
            $scope.tasks.push(result);
        });

    });
