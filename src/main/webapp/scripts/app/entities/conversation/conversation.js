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
            .state('main', {
                parent: 'entity',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/conversation/conversations.html',
                        controller: 'ConversationController'
                    },
                    'conversations@main': {
                        templateUrl: 'scripts/app/entities/conversation/conversation-list.html'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('conversation');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('conversations', {
                parent: 'main',
                url: '/conversations/{id}',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
/*                    'content@': {
                        templateUrl: 'scripts/app/entities/conversation/conversations.html',
                        controller: 'ConversationController'
                    },*/
                    'conversation' : {
                        templateUrl: 'scripts/app/entities/conversation/conversation-detail.html',
                        controller: 'ConversationDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('conversation');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('message');
                        return $translate.refresh();
                    }],
                    currentConversation: ['$stateParams', 'Conversation', '$rootScope', function($stateParams, Conversation, $rootScope) {
                        var cid=$stateParams.id;
                        if(cid.length==0) return null;
                        return Conversation.get({id : cid},function(result) {
//                            $rootScope.currentConversation=result;
//                            $rootScope.broadcast('demoApp:showConversation',result);
                        });
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
            .state('conversations.new', {
                parent: 'conversations',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal, $rootScope) {
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
                        $state.go('conversations', {id: result.id}, { reload: true });
                    }, function() {
                        $state.go('conversations');
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
                        $state.go('conversation', {id: result.id}, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
