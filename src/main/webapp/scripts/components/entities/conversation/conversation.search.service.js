'use strict';

angular.module('demoApp')
    .factory('ConversationSearch', function ($resource) {
        return $resource('api/_search/conversations/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
