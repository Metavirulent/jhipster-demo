'use strict';

angular.module('demoApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks', {
                parent: 'projects',
                url: '/{pid}',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'tasks@projects' : {
                        templateUrl: 'scripts/app/entities/task/tasks.html',
                        controller: 'TaskController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('task');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    currentProject: ['$stateParams', 'Project', '$rootScope', function($stateParams, Project, $rootScope) {
                        var pid=$stateParams.pid;
                        if(pid.length==0) return null;
                        return Project.get({id : pid},function(result) {
                            Project.setCurrentProject(result);
//                            $rootScope.currentConversation=result;
//                            $rootScope.broadcast('demoApp:showConversation',result);
                        });
                    }],
                    tasks: ['$stateParams', 'Project', 'Task', function($stateParams, Project, Task) {
                        var pid=$stateParams.pid;
                        if(pid.length==0) return null;
                        return Task.query({page: 0, size: 20, projectId:pid});
                    }]
                }
            })
            .state('tasks.new', {
                parent: 'tasks',
                url: '/tasks/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', 'Project', function($stateParams, $state, $modal,Project) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/task/task-dialog.html',
                        controller: 'TaskDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {title: null, description: null, id: null, projectId: Project.currentProjectId()};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {id: Project.currentProjectId()}, { reload: true });
                    }, function() {
                        $state.go('tasks', {id: Project.currentProjectId()}, { reload: false });
                    })
                }]
            })
            .state('tasks.edit', {
                parent: 'tasks',
                url: '/tasks/{tid}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', 'Project', function($stateParams, $state, $modal, Project) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/task/task-dialog.html',
                        controller: 'TaskDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Task', function(Task) {
                                return Task.get({projectId: Project.currentProjectId(), id : $stateParams.tid});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {id: Project.currentProjectId()}, { reload: true });
                    }, function() {
                        $state.go('tasks', {id: Project.currentProjectId()}, { reload: false });
                    })
                }]
            });
    });
