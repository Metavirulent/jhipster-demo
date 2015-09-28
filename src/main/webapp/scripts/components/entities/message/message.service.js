'use strict';

angular.module('demoApp')
    .factory('Message', function ($resource, DateUtils) {
        return $resource('api/conversation/:cid/messages/:id', {cid: '@conversationId'}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' },
        });
    });
