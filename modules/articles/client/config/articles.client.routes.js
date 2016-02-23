'use strict';

angular.module('articles').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('blog', {
                abstract: true,
                url: '/blog',
                templateUrl: 'modules/articles/client/views/blog.client.view.html'
            })
            .state('blog.view', {
                url: '/:articleSlug',
                templateUrl: 'modules/articles/client/views/blog/blog.article.client.view.html'
            });
    }
]);
