'use strict';

angular.module('demoApp')
    .controller('ProjectController', function ($scope, $state, Project, ProjectSearch, ParseLinks) {
        $scope.projects = [];
        $scope.page = 0;
        $scope.currentProject=Project.currentProject;

        $scope.loadAll = function() {
            Project.query({page: $scope.page, size: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.projects.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.projects = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
//        $scope.loadAll();

        $scope.delete = function (id) {
            Project.get({id: id}, function(result) {
                $scope.project = result;
                $('#deleteProjectConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Project.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteProjectConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            ProjectSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.projects = result;
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
            $scope.project = {name: null, id: null};
        };

        /**Receive notifications from the tasks about what project to show.*/
        $scope.$on('demoApp:showProject', function(e, result) {
            if($scope.currentProject===result) return;
            $scope.currentProject=result;
            $scope.reset();
        });

        $scope.$on('demoApp:projectUpdate', function(e, result) {
            var index=$scope.projects.indexOf(result);
            if(index<0) {
                $scope.projects.push(result);
            }
            else $scope.projects[index]=result;
        });

        $scope.selectProject=function(p) {
            var params={};
            if(p!=null) params['id']=p.id;
//            Project.setCurrentProject(p);
//            $scope.currentProject=p;
            $state.go("tasks", params, {reload:false});
        }

    });
