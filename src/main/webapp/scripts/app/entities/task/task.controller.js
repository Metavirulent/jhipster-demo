'use strict';

angular.module('demoApp')
    .controller('TaskController', function ($scope, Task, TaskSearch, ParseLinks, currentProject, Project) {
        $scope.tasks = [];
        $scope.page = 0;
        $scope.currentProject=Project.currentProject;

        $scope.$on('demoApp:showProject', function(e, result) {
            $scope.currentProject=result;
            $scope.reset();
        });

        $scope.loadAll = function() {
            if($scope.currentProject!=null /*&& $scope.currentProject.$promise.isFulfilled()*/)
                Task.query({page: $scope.page, size: 20, projectId:$scope.currentProject.id}, function(result, headers) {
                    $scope.links = ParseLinks.parse(headers('link'));
                    if(result.length>0) {
                        if(result[0].projectId==Project.currentProjectId())             //might be coming late for wrong project
                            for (var i = 0; i < result.length; i++) {
                                $scope.tasks.push(result[i]);
                            }
                    }
                });
        };
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
//            $scope.loadAll();

        $scope.delete = function (id) {
            Task.get({id: id}, function(result) {
                $scope.task = result;
                $('#deleteTaskConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Task.delete({id: id},
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
                    $scope.loadAll();
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
            Project.update($scope.currentProject);
        }
    });
