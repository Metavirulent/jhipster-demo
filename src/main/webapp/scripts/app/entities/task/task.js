'use strict';

angular.module('demoApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tasks', {
                parent: 'projects',
                url: '/projects/{id}',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'tasks' : {
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
                        var cid=$stateParams.id;
                        if(cid.length==0) return null;
                        Project.setCurrentProject(null);
                        return Project.get({id : cid},function(result) {
                            Project.setCurrentProject(result);
//                            $rootScope.currentConversation=result;
//                            $rootScope.broadcast('demoApp:showConversation',result);
                        });
                    }]
                }
            })
            .state('tasks.new', {
                parent: 'tasks',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/task/task-dialog.html',
                        controller: 'TaskDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {title: null, description: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {id: result.id}, { reload: true });
                    }, function() {
                        $state.go('tasks');
                    })
                }]
            })
            .state('tasks.edit', {
                parent: 'tasks',
                url: '/{id}/edit',
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
                                return Task.get({projectId: Project.currentProjectId(), id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {id: result.id}, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
