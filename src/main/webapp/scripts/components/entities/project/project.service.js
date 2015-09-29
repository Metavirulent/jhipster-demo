'use strict';

angular.module('demoApp')
    .factory('Project', function ($resource, $rootScope, DateUtils) {
        var res=$resource('api/projects/:id', {}, {
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
        res.currentProject=null;

        res.setCurrentProject = function(p) {
            res.currentProject=p;
            $rootScope.$broadcast('demoApp:showProject',p);
        }

        res.currentProjectId = function() {
            if(res.currentProject==null) return 0;
            return res.currentProject.id;
        }

        return res;
    });
