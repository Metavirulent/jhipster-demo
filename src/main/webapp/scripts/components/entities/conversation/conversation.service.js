'use strict';

angular.module('demoApp')
    .factory('Conversation', function ($resource, DateUtils) {
        return $resource('api/conversations/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
