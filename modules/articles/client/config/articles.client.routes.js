'use strict';

angular.module('articles').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('blog', {
                abstract: true,
                url: '/blog',
                templateUrl: 'modules/articles/client/views/blog.client.view.html'
            })
            .state('blog.home', {
                url: '',
                templateUrl: 'modules/articles/client/views/blog/blog.home.client.view.html'
            })
            .state('blog.article', {
                url: '/:articleSlug',
                templateUrl: 'modules/articles/client/views/blog/blog.article.client.view.html',
                controller: 'BlogArticleController',
                resolve: {
                    articleResolve: ['$stateParams', 'ApiArticlesSlug', function ($stateParams, ApiArticlesSlug) {
                        return ApiArticlesSlug.get({
                            articleSlug: $stateParams.articleSlug
                        });
                    }]
                }
            });
    }
]);
