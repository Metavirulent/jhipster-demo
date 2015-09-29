'use strict';

angular.module('demoApp')
    .factory('Task', function ($resource, DateUtils, Project) {
        return $resource('api/project/:projectId/tasks/:id', {projectId: '@projectId'}, {
            'query': {
                method: 'GET',
//                params: {pid : Project.currentProjectId() },
                isArray: true
            },
            'get': {
                method: 'GET',
//                params: {pid : Project.currentProjectId() },
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' },
            'save': {
                method: 'POST',
                transformRequest: function(data,headersGetter) {
                    data.projectId=Project.currentProjectId();
                    var json=angular.toJson(data);
                    return json;
                }
            }
        });
    });
