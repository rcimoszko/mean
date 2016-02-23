'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.articles', {
                url: '/articles',
                templateUrl: 'modules/articles/client/views/admin/admin-list-articles.client.view.html',
                controller: 'AdminListArticlesController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.createArticle', {
                url: '/articles/create',
                templateUrl: 'modules/articles/client/views/admin/admin-create-article.client.view.html',
                controller: 'AdminCreateArticleController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.viewArticle', {
                url: '/articles/:articleId/view',
                templateUrl: 'modules/articles/client/views/admin/admin-view-article.client.view.html',
                controller: 'AdminViewArticleController',
                resolve: {
                    articleResolve: ['$stateParams', 'ApiArticles', function ($stateParams, ApiArticles) {
                        return ApiArticles.get({
                            _id: $stateParams.articleId
                        });
                    }]
                },
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editArticle', {
                url: '/articles/:articleId/edit',
                templateUrl: 'modules/articles/client/views/admin/admin-edit-article.client.view.html',
                controller: 'AdminEditArticleController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    articleResolve: ['$stateParams', 'ApiArticles', function ($stateParams, ApiArticles) {
                        return ApiArticles.get({
                            _id: $stateParams.articleId
                        });
                    }]
                }
            });

    }
]);


/*
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
    function ($stateProvider) {
        // Articles state routing
        $stateProvider
            .state('articles', {
                abstract: true,
                url: '/articles',
                template: '<ui-view/>'
            })
            .state('articles.list', {
                url: '',
                templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
            })
            .state('articles.create', {
                url: '/create',
                templateUrl: 'modules/articles/client/views/create-article.client.view.html',
            })
            .state('articles.view', {
                url: '/:articleId',
                templateUrl: 'modules/articles/client/views/view-article.client.view.html'
            })
            .state('articles.edit', {
                url: '/:articleId/edit',
                templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
*/