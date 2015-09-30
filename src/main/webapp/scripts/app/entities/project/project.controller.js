'use strict';

angular.module('demoApp')
    .controller('ProjectController', function ($scope, $state, $location, Project, ProjectSearch, ParseLinks, projects) {
        $scope.projects = projects;
        $scope.page = 0;
        $scope.currentProject=Project.getCurrentProject;

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

        $scope.confirmDelete = function (id) {
            Project.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteProjectConfirmation').modal('hide');
                    $scope.clear();
                    $state.go('projects');
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
        }); 

        $scope.$on('demoApp:projectUpdate', function(e, result) {
            for(var i=0;i<$scope.projects.length;i++) {
                if(projects[i].id==result.id) {
                    projects[i]=result;
                    return;
                }
            }
            $scope.projects.push(result);
        });

        $scope.selectProject=function(p) {
            var params={};
            if(p!=null)
                $state.go('tasks',{pid:p.id},{reload:false});
            else $state.go('projects');
        }

    });
