'use strict';

angular.module('demoApp')
    .factory('Account', function Account($resource) {
        return $resource('api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });

angular.module('demoApp')
    .factory('SendLoginName', function SendLoginName($resource) {
        return $resource('api/account/send_login_name', {}, {
        });
    });
