'use strict';

angular.module('demoApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('projects', {
                parent: 'entity',
                url: '/projects',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/project/projects.html',
                        controller: 'ProjectController'
                    },
                    'projects@projects': {
                        templateUrl: 'scripts/app/entities/project/project-list.html'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('project');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    projects: ['Project', function(Project) {
                        return Project.query({page: 0, size: 20});          //pre-load projects

                    }]
                },
                onEnter: function() {
                    console.log("entering projects");
                }
            })
/*            .state('project', {
                parent: 'entity',
                url: '/project',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'demoApp.project.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/project/projects.html',
                        controller: 'ProjectController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('project');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('project.detail', {
                parent: 'entity',
                url: '/project/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'demoApp.project.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/project/project-detail.html',
                        controller: 'ProjectDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('project');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Project', function($stateParams, Project) {
                        return Project.get({id : $stateParams.id});
                    }]
                }
            })*/
            .state('projects.new', {
                parent: 'projects',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', 'Project', function($stateParams, $state, $modal, Project) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/project/project-dialog.html',
                        controller: 'ProjectDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {pid: result.id}, { reload: true });
                    }, function() {
                        var p=Project.getCurrentProject();
                        if(p==null) $state.go("projects");
                        else $state.go('tasks', {pid: p.id});
                    })
                }]
            })
            .state('projects.edit', {
                parent: 'projects',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', 'Project', function($stateParams, $state, $modal, Project) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/project/project-dialog.html',
                        controller: 'ProjectDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Project', function(Project) {
                                return Project.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('tasks', {pid: result.id}, { reload: true });
                    }, function() {
                        $state.go('tasks', {pid: Project.getCurrentProject().id}, { reload: true });
                    })
                }]
            });
    });
