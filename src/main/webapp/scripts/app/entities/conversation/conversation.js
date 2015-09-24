'use strict';

angular.module('demoApp')
    .config(function ($stateProvider) {
        $stateProvider
/*            .state('conversation', {
                parent: 'entity',
                url: '/conversations',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'demoApp.conversation.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/conversation/conversations.html',
                        controller: 'ConversationController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('conversation');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    currentConversation: function() {
                        return null;
                    }
                }
            })*/
            .state('conversations', {
                parent: 'entity',
                url: '/conversations/{id}',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/conversation/conversations.html',
                        controller: 'ConversationController'
                    },
                    'conversations@conversations': {
                        templateUrl: 'scripts/app/entities/conversation/conversation-list.html'
                    },
                    'conversation@conversations' : {
                        templateUrl: 'scripts/app/entities/conversation/conversation-detail.html'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('conversation');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    currentConversation: ['$stateParams', 'Conversation', function($stateParams, Conversation) {
                        var cid=$stateParams.id;
                        if(cid.length==0) return null;
                        return Conversation.get({id : cid});
                    }]
                }
            })
            .state('conversation.detail', {
                parent: 'entity',
                url: '/conversation/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'demoApp.conversation.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/conversation/conversation-detail.html',
                        controller: 'ConversationDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('conversation');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Conversation', function($stateParams, Conversation) {
                        return Conversation.get({id : $stateParams.id});
                    }]
                }
            })
            .state('conversation.new', {
                parent: 'conversation',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/conversation/conversation-dialog.html',
                        controller: 'ConversationDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('conversation', null, { reload: true });
                    }, function() {
                        $state.go('conversation');
                    })
                }]
            })
            .state('conversation.edit', {
                parent: 'conversation',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/conversation/conversation-dialog.html',
                        controller: 'ConversationDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Conversation', function(Conversation) {
                                return Conversation.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('conversation', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
