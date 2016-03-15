'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = [
      'ngResource',
      'ngAnimate',
      'ngMessages',
      'ui.router',
      'ui.bootstrap',
      'ui.utils',
      'slugifier',
      'googlechart',
      'angularGrid',
      'lrInfiniteScroll',
      'textAngular',
      'angularMoment',
      'luegg.directives',
      'ngCsv',
      'sticky',
      //'scrollToFixed',
      'angular.filter',
      'angulartics',
      'angulartics.google.analytics'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('login').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});


angular.module(ApplicationConfiguration.applicationModuleName).config(["moment", function(moment){
    moment.locale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s",
            s:  "1m",
            m:  "1m",
            mm: "%dm",
            h:  "1h",
            hh: "%dh",
            d:  "1d",
            dd: "%dd",
            M:  "1mo",
            MM: "%dmo",
            y:  "1y",
            yy: "%dy"
        }
    });
}]);
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

ApplicationConfiguration.registerModule('fu');
ApplicationConfiguration.registerModule('fu.admin');
'use strict';

ApplicationConfiguration.registerModule('message');
'use strict';

ApplicationConfiguration.registerModule('pinnacle');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

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
                templateUrl: 'modules/articles/client/views/blog/blog.home.client.view.html',
                title: 'Sports Betting Blog | FansUnite',
                description: 'Betting predictions, previews, analysis and advice for upcoming NBA, NHL, MLB and NFL games.',
                keywords: 'betting, predictions, previews, analysis, advice'
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

'use strict';

angular.module('articles').controller('AdminCreateArticleController', ['$scope', 'Articles', '$state',
    function ($scope, Articles, $state) {
        $scope.article = {
            content: '',
            datePublished: new Date()
        };

        function cb(err, sports){
            $scope.sports = sports;
        }

        $scope.submit = function(){
            console.log($scope.article);

            function cb(err, article){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.article = article;
                    $state.go('admin.editArticle',{articleId: $scope.article._id});
                }
            }
            Articles.create($scope.article, cb);

        };
    }
]);

'use strict';

angular.module('articles').controller('AdminEditArticleController', ['$scope', 'articleResolve', 'Articles',
    function ($scope, articleResolve, Articles) {

        $scope.article = articleResolve;


        $scope.submit = function(){
            function cb(err, article){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.article = article;
                }
            }
            Articles.update($scope.article, cb);

        };

    }
]);

'use strict';

angular.module('articles').controller('AdminListArticlesController', ['$scope', 'Articles',
    function ($scope, Articles) {

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);

'use strict';

angular.module('articles').controller('AdminViewArticleController', ['$scope', 'articleResolve', 'Articles',
    function ($scope, articleResolve, Articles) {

        $scope.article = articleResolve;

    }
]);

'use strict';

angular.module('articles').controller('BlogController', ['$scope', 'Articles', '$state', 'Loading',
    function ($scope, Articles, $state, Loading) {
        $scope.loading = Loading;

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);

'use strict';

angular.module('articles').controller('BlogArticleController', ['$scope', '$location', 'articleResolve', 'Page', '$state', '$filter',
    function ($scope, $location, articleResolve, Page, $state, $filter) {
        $scope.article = articleResolve;
        $scope.article.$promise.then(function(article){
            Page.meta.title = $scope.article.title+' | FansUnite Blog';
            Page.meta.description = $filter('striptags')($scope.article.content).substring(0,200);
            Page.meta.keywords = $scope.article.keywords;
        }, function(){
           $state.go('not-found');
        });
        $scope.location = $location;
    }
]);

'use strict';

angular.module('articles').controller('BlogHomeController', ['$scope', 'Articles', 'Loading',
    function ($scope, Articles, Loading) {
        $scope.loading = Loading;

        function cb(err, articles){
            $scope.articles = articles;
            $scope.loading.isLoading.pageLoading = false;
        }

        $scope.loading.isLoading.pageLoading = true;
        Articles.getAll(cb);

    }
]);

'use strict';

angular.module('articles').factory('ApiArticles', ['$resource',
    function ($resource) {
        return $resource('api/articles/:_id', { _id: '@_id'}, { update: {method: 'PUT' }
        });
    }
]);

'use strict';

angular.module('articles').factory('ApiArticlesSlug', ['$resource',
    function ($resource) {
        return $resource('api/articles/slug/:articleSlug', { articleSlug: '@slug'}, { update: {method: 'PUT' }
        });
    }
]);

'use strict';

angular.module('articles').factory('Articles', ['ApiArticles', 
    function(ApiArticles) {

        var create = function(form, callback){

            function cbSuccess(article){
                callback(null, article);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var article = new ApiArticles(form);

            article.$save(cbSuccess, cbError);
        };

        var update = function(article, callback){

            function cbSuccess(article){
                callback(null, article);
            }

            function cbError(response){
                callback(response.data.message);
            }

            article.$update({_id: article._id}, cbSuccess, cbError);

        };

        var get = function(articleID, callback){
            function cbSuccess(article){
                callback(null, article);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiArticles.get({_id:articleID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(articles){
                callback(null, articles);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiArticles.query(cbSuccess, cbError);

        };

        var del = function(article, callback){
            function cbSuccess(article){
                callback(null, article);
            }

            function cbError(response){
                callback(response.data.message);
            }
            article = new ApiArticles(article);
            article.$delete(cbSuccess, cbError);
        };



        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del

        };
    }
]);
'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    /*
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })*/
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/admin/admin.home.client.view.html',
                controller: 'AdminHomeController',
                title: 'Admin | FansUnite',
                data: {
                    roles: ['admin']
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.channels', {
                url: '/channels',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-list-channels.client.view.html',
                controller: 'AdminListChannelsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.createChannel', {
                url: '/channels/create',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-create-channel.client.view.html',
                controller: 'AdminCreateChannelController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editChannel', {
                url: '/channels/:channelId',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-edit-channel.client.view.html',
                controller: 'AdminEditChannelController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    channelResolve: ['$stateParams', 'ApiChannels', function ($stateParams, ApiChannels) {
                        return ApiChannels.get({
                            _id: $stateParams.channelId
                        });
                    }]
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.contestants', {
                url: '/contestants',
                templateUrl: 'modules/fu/client/views/admin/events/contestants/admin-list-contestants.client.view.html',
                controller: 'AdminListContestantsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editContestant', {
                url: '/contestants/edit/:contestantId',
                templateUrl: 'modules/fu/client/views/admin/events/contestants/admin-edit-contestant.client.view.html',
                controller: 'AdminEditContestantController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    contestantResolve: ['$stateParams', 'ApiContestants', function ($stateParams, ApiContestants) {
                        return ApiContestants.get({
                            _id: $stateParams.contestantId
                        });
                    }]
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.events', {
                url: '/events',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-list-events.client.view.html',
                controller: 'AdminListEventsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editEvent', {
                url: '/events/edit/:eventId',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-edit-event.client.view.html',
                controller: 'AdminEditEventController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    eventResolve: ['$stateParams', 'ApiEvents', function ($stateParams, ApiEvents) {
                        return ApiEvents.get({
                            _id: $stateParams.eventId
                        });
                    }]
                }
            })
            .state('adminEditEvent', {
                url: '/game/:eventSlug/:leagueSlug/edit',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-edit-event.client.view.html',
                controller: 'AdminEditEventController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    eventResolve: ['$stateParams', 'ApiEventsSlug', function ($stateParams, ApiEventsSlug) {
                        return ApiEventsSlug.get({
                            slug: $stateParams.eventSlug
                        });
                    }]
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.groups', {
                url: '/groups',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-list-groups.client.view.html',
                controller: 'AdminListGroupsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.createGroup', {
                url: '/groups/create',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-create-group.client.view.html',
                controller: 'AdminCreateGroupController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editGroup', {
                url: '/groups/:groupId',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-edit-group.client.view.html',
                controller: 'AdminEditGroupController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    groupResolve: ['$stateParams', 'ApiGroups', function ($stateParams, ApiGroups) {
                        return ApiGroups.get({
                            _id: $stateParams.groupId
                        });
                    }]
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.leagues', {
                url: '/leagues',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-list-leagues.client.view.html',
                controller: 'AdminListLeaguesController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leaguesBySport', {
                url: '/leagues/:sportId',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-list-leagues.client.view.html',
                controller: 'AdminListLeaguesController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editLeague', {
                url: '/leagues/edit/:leagueId',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-edit-league.client.view.html',
                controller: 'AdminEditLeagueController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.sports', {
                url: '/sports',
                templateUrl: 'modules/fu/client/views/admin/events/sports/admin-list-sports.client.view.html',
                controller: 'AdminListSportsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editSport', {
                url: '/sports/edit/:sportId',
                templateUrl: 'modules/fu/client/views/admin/events/sports/admin-edit-sport.client.view.html',
                controller: 'AdminEditSportController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    sportResolve: ['$stateParams', 'ApiSports', function ($stateParams, ApiSports) {
                        return ApiSports.get({
                            _id: $stateParams.sportId
                        });
                    }]
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.allProPicks', {
                url: '/propicks/all',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-all.client.view.html',
                controller: 'AdminPropicksAllController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.sportProPicksMonth', {
                url: '/propicks/sport/mont',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-sport-month.client.view.html',
                controller: 'AdminPropicksSportMonthController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leagueProPicksMonth', {
                url: '/propicks/league/month',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-league-month.client.view.html',
                controller: 'AdminPropicksLeagueMonthController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.sportProPicksTotals', {
                url: '/propicks/sport/totals',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-sport-totals.client.view.html',
                controller: 'AdminPropicksSportTotalsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leagueProPicksTotals', {
                url: '/propicks/league/totals',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-league-totals.client.view.html',
                controller: 'AdminPropicksLeagueTotalsController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);

'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin.resolveSports', {
                url: '/resolve',
                templateUrl: 'modules/fu/client/views/admin/resolve/admin-resolve-list-sports.client.view.html',
                controller: 'AdminResolveListSportsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.resolveSport', {
                url: '/resolve/:sportId',
                templateUrl: 'modules/fu/client/views/admin/resolve/admin-resolve-sport.client.view.html',
                controller: 'AdminResolveSportController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('channel', {
                abstract:true,
                template: '<div ui-view></div>',
                url: '/channel/:channelSlug'
            })
                .state('channel.main', {
                    url: '',
                    abstract: true,
                    templateUrl: 'modules/fu/client/views/channel.client.view.html'
                })
                    .state('channel.main.home', {
                        url: '',
                        templateUrl: 'modules/fu/client/views/channels/channel-games.client.view.html'
                    })
                    .state('channel.main.date', {
                        url: '/:date',
                        templateUrl: 'modules/fu/client/views/channels/channel-games.client.view.html'
                    });

    }
]);
'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('discover', {
                abstract: true,
                url: '/discover',
                templateUrl: 'modules/fu/client/views/discover.client.view.html'
            })
            .state('discover.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                title: 'Top Handicappers | FansUnite',
                description: 'Find handicappers with 100% verified and transparent results to follow, track and copy their predictions. ',
                keywords: 'top handicappers, best tipsters, fansunite leaderboard'
            })
            .state('discover.sport', {
                url: '/:sportSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            })
            .state('discover.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            })
            .state('discover.contestant', {
                url: '/:sportSlug/:leagueSlug/:contestantSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            });
    }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/fu/client/views/splash.client.view.html'
            })
            .state('hub', {
                url: '/hub',
                templateUrl: 'modules/fu/client/views/hub.client.view.html',
                title: 'Hub | FansUnite',
                description: '',
                keywords: '',
                data: {
                    roles: ['user']
                }
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: 'modules/fu/client/views/profile.client.view.html'
            })
            .state('gamecenter', {
                url: '/game/:eventSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/gamecenter.client.view.html'
            });

    }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('makePicks', {
                abstract: true,
                url: '/make-picks',
                templateUrl: 'modules/fu/client/views/make-picks.client.view.html'
            })
            .state('makePicks.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html',
                title: 'Free Online Sportsbook | FansUnite',
                description: 'Track your bets on our free online sportsbook with up-to-date odds for every sport and league.',
                keywords: 'free online sportsbook, free online sports betting, latest odds'
            })
            .state('makePicks.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html',
                description: 'Latest betting odds for every sport. Track your bets with our free online sportsbook.',
                keywords: 'free online sportsbook, free online sports betting, latest odds'
            });

    }
]);
'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('basePurchaseSuccess', {
                url: '/base-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/base-purchase-success.client.view.html',
                title: 'Thank You for Purchasing Email Notifications | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('proPurchaseSuccess', {
                url: '/pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/pro-purchase-success.client.view.html',
                title: 'Thank You for Purchasing FansUnite Pro | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('6monthProPurchaseSuccess', {
                url: '/six-pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/6-purchase-success.client.view.html',
                title: 'Thank You for Purchasing 6 Months FansUnite Pro | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('trialSuccess', {
                url: '/trial-pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/trial-purchase-success.client.view.html',
                title: 'Thank You for Signing up for a Free Trial | FansUnite',
                data: {
                    roles: ['user']
                }
            });
    }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('signupSuccess', {
                url: '/signup-success?redirect',
                templateUrl: 'modules/fu/client/views/signup/signup-success.client.view.html',
                title: 'Thank You for Signing Up | FansUnite',
                data: {
                    roles: ['user']
                }
            });
    }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider.
            state('static', {
                templateUrl: '/modules/fu/client/views/static.client.view.html',
                abstract: true
            })
            .state('static.about', {
                url:'/about',
                templateUrl: '/modules/fu/client/views/static/static.about.client.view.html',
                title: 'About FansUnite | Sports Betting Social Network',
                description: 'FansUnite is a Sports betting Social Network. Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
                keywords: 'sports betting, social network, community'
            })
            .state('static.betting101', {
                url:'/betting101',
                templateUrl: '/modules/fu/client/views/static/static.betting101.client.view.html',
                title: 'Learn the Basics of Sports Betting | FansUnite',
                description: 'Learn how to bet moneylines, point spreads, total points and team totals. Understand the different odds formats and bet types.',
                keywords: 'moneyline, spreads, totals, team totals'
            })
            .state('static.glossary', {
                url: '/glossary',
                templateUrl: '/modules/fu/client/views/static/static.glossary.client.view.html',
                title: 'Betting Glossary | FansUnite',
                description: 'Find the most common betting terms that every sports bettor amateur to professional needs to know.',
                keywords: 'glossary, learn sports betting, teach sports betting'
            }).
            state('static.howPicksAreGraded', {
                url: '/how-picks-are-graded',
                templateUrl: '/modules/fu/client/views/static/static.how-picks-are-graded.client.view.html',
                title: 'Learn How Picks are Graded at FansUnite | Sports Betting Social Network',
                description: 'Track your bets on FansUnite and have our platform automatically grade each wager. Learn more about how each bet is graded.',
                keywords: 'bet tracking, pick tracker'
            }).
            state('static.faq', {
                url: '/faq',
                templateUrl: '/modules/fu/client/views/static/static.faq.client.view.html',
                title: 'FAQ at FansUnite | Sports Betting Social Network',
                description: 'FansUnite is a unique Sports Betting platform where you can collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
                keywords: 'faq, sports betting, social network, community'
            }).
            state('static.terms', {
                url: '/terms',
                templateUrl: '/modules/fu/client/views/static/static.terms.client.view.html',
                title: 'FansUnite Terms | Sports Betting Social Network',
                description: '',
                keywords: ''
            }).
            state('static.rules', {
                url: '/rules',
                templateUrl: '/modules/fu/client/views/static/static.rules.client.view.html',
                title: 'FansUnite Rules | Sports Betting Social Network',
                description: '',
                keywords: ''
            }).
            state('static.privacy', {
                url: '/privacy',
                templateUrl: '/modules/fu/client/views/static/static.privacy.client.view.html',
                title: 'Privacy Policy | FansUnite',
                description: 'Privacy policy.',
                keywords: 'privacy policy'
            }).
            state('static.contact', {
                url: '/contact',
                templateUrl: '/modules/fu/client/views/static/static.contact.client.view.html',
                title: 'Contact FansUnite | Sports Betting Social Network',
                description: 'FansUnite is always open to feedback. Contact us with any questions, comments and suggestions.',
                keywords: 'contact us, feedback, suggestions'
            }).
            state('static.offer-not-available', {
                url: '/not-available',
                templateUrl: '/modules/fu/client/views/static/static.offer-not-available.client.view.html',
                title: 'Not Available | FansUnite',
                description: ''
            }).
            state('static.userguide', {
                url: '/user-guide',
                templateUrl: '/modules/fu/client/views/static/static.user-guide.client.view.html',
                title: 'FansUnite User Guide | Sports Betting Social Network',
                description: 'Learn how to use FansUnite, a social sports betting platform. Follow the top handicappers and become more profitable.',
                keywords: 'user guide, profitable, sports betting'
            }).
            state('static.sportsbooks', {
                url: '/top-10-sportsbooks',
                templateUrl: '/modules/fu/client/views/static/static.top-10-sports-books.client.view.html',
                title: 'Top 10 Sportsbooks | Unbiased Reviews | FansUnite',
                description: 'Unbiased sportsbook reviews from FansUnite. Find the best online sportsbook.',
                keywords: 'best online sportsbook, betting offers, free bets'
            }).
            state('static.sportsbookReviews', {
                url: '/sportsbook-review/:name',
                templateUrl: '/modules/fu/client/views/static/static.sportsbook-review.client.view.html'
            }).
            state('static.monthlyRevenueShare', {
                url: '/monthly-revenue-share',
                templateUrl: '/modules/fu/client/views/static/static.monthly-revenue-share.client.view.html',
                title: 'Monthly Revenue Share | FansUnite',
                description: "FansUnite rewards it's top handicappers with a monthly revenue share. Eligible members receive a portion of our revenue each month.",
                keywords: 'revenue share, top handicappers, rewards'
            }).
            state('static.press', {
                url: '/press',
                templateUrl: '/modules/fu/client/views/static/static.press.client.view.html',
                title: 'FansUnite Press | Sports Betting Social Network',
                description: 'News and press about FansUnite, the sports betting social network.',
                keywords: 'press release, fansunite news, fansunite articles'
            }).
            state('whyGoPro', {
                url: '/why-go-pro',
                templateUrl: '/modules/fu/client/views/static/static.why-go-pro.client.view.html',
                title: 'FansUnite Pro Membership | Sports Betting Social Network',
                description: 'Join FansUnite Pro subscription to get access to our pro picks, email notifications and weekly betting progress reports.',
                keywords: 'pro picks, email notifications, progress reports'
            });
    }
]);
'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/fu/client/views/users/login.client.view.html',
                title: 'Login | FansUnite'
            })
            .state('signup', {
                url: '/signup?redirect',
                templateUrl: 'modules/fu/client/views/users/signup.client.view.html',
                title: 'Sign Up | FansUnite'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'modules/fu/client/views/users/settings.client.view.html',
                data: {
                    roles: ['user']
                },
                title: 'Settings | FansUnite',
                description: '',
                keywords: ''
            })
            .state('myFollowing', {
                url: '/my-following',
                templateUrl: 'modules/fu/client/views/users/my-following.client.view.html',
                data: {
                    roles: ['user']
                },
                title: 'My Handicappers | FansUnite',
                description : '',
                keywords: ''
            });
    }
]);

'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
        state('verifyEmailSuccess', {
            url: '/verify-email-success',
            templateUrl: 'modules/fu/client/views/email/verify-email-success.client.view.html',
            title: 'Thank You Verifying your Email | FansUnite'
        }).
        state('verifyEmailSuccessUsername', {
            url: '/verify-email-success/:username',
            templateUrl: 'modules/fu/client/views/email/verify-email-success.client.view.html',
            title: 'Thank You Verifying your Email | FansUnite'
        }).
        state('verifyEmailFailure', {
            url: '/verify-email-failure',
            templateUrl: 'modules/fu/client/views/email/verify-email-failure.client.view.html',
            title: 'Unable to Verify Email | FansUnite'
        });
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminHomeController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminCreateChannelController', ['$scope', 'Channels', 'Sports', 'Leagues', '$state',
    function ($scope, Channels, Sports, Leagues, $state) {
        $scope.channel = {};

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.submit = function(){

            function cb(err, channel){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.channel = channel;
                    $state.go('admin.editChannel',{channelId: $scope.channel._id});
                }
            }
            Channels.create($scope.channel, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditChannelController', ['$scope', 'channelResolve', 'Channels', 'Sports', '$state',
    function ($scope, channelResolve, Channels, Sports, $state) {
        $scope.channel = channelResolve;

        $scope.dateGroups = ['upcoming', 'daily'];

        $scope.submit = function(){
            function cb(err, channel){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.channel = channel;
                    $state.go('admin.channels');
                }
            }
            Channels.update($scope.channel, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListChannelsController', ['$scope', 'Channels',
    function ($scope, Channels) {

        function cb(err, channels){
            $scope.channels = channels;
        }

        Channels.getAll(cb);

    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditContestantController', ['$scope', 'contestantResolve', 'Contestants', '$state',
    function ($scope, contestantResolve, Contestants, $state) {
        $scope.contestant = contestantResolve;

        $scope.submit = function(){
            function cb(err, contestant){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.contestant = contestant;
                    $state.go('admin.contestants');
                }
            }
            Contestants.update($scope.contestant, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListContestantsController', ['$scope', 'Sports', 'Leagues',
    function ($scope, Sports, Leagues) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getLeagues = function(){
            function cb(err, leagues){
                $scope.leagues = leagues;
            }
            Sports.getLeagues($scope.sport._id, cb);
        };

        $scope.getLeagueContestants = function(){
            function cb(err, contestants){
                $scope.contestants = contestants;
            }
            Leagues.getContestants($scope.league._id, cb);
        };

        $scope.getSportContestants = function(){
            function cb(err, contestants){
                $scope.contestants = contestants;
            }
            Sports.getContestants($scope.sport._id, cb);
        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditEventController', ['$scope', 'eventResolve', 'Events', 'Picks', '$state', '$filter',
    function ($scope, eventResolve, Events, Picks, $state, $filter) {
        $scope.event = eventResolve;

        //Setup for table
        $scope.event.$promise.then(function(event) {
            $scope.events = [{count:0, event: event}];

            $scope.sportSlug = $filter('slugify')(event.sport.name);
            $scope.getPicks();

        });

        $scope.getPicks = function(){

            function cbGetPicks(err, picks){
                $scope.picks = picks;
                $scope.events[0].count = picks.length;
            }

            Events.getPicks($scope.event, cbGetPicks);
        };

        $scope.submit = function(){
            function cb(err, event){
                if(err) {
                    $scope.error = err;
                } else {
                    $scope.saved = true;
                    $scope.event = event;
                }
            }
            $scope.saved = false;
            Events.update($scope.event, cb);
        };


        $scope.isNCAAB = function(event){
            return event.event.league.name === 'NCAAB';
        };
        $scope.isNotNCAAB = function(event){
            return event.event.league.name !== 'NCAAB';
        };
        $scope.isDotaOrLeague = function(event){
            if(event.event.league.ref.group){
                return event.event.league.ref.group.name === 'League of Legends' || event.event.league.ref.group.name === 'Dota 2';
            }
        };
        $scope.isCsGo = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'CS:GO';
            }
        };
        $scope.isStarcraft = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'Starcraft 2';
            }
        };

        $scope.saveEvent = function(event){

            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    for(var field in updatedEvent){
                        if(field.indexOf('Score') !== -1 || field === 'contestantWinner'){
                            event[field] = updatedEvent[field];
                        }
                    }
                    $scope.setWinner(updatedEvent);
                    $scope.getPicks();
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
                Events.resolve(event, cb);
            }
        };

        $scope.cancelEvent = function(event){

            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    $scope.getPicks();
                }
            }

            if (confirm('Are you sure you want cancel this event?')) {
                Events.cancel(event, cb);
            }
        };
        

        $scope.boxingMethodOfVictory = ['Decision', 'Knockout', 'Draw', 'Disqualification', 'No Contest'];
        $scope.mmaMethodOfVictory = ['Decision', 'Knockout', 'Submission', 'Draw', 'Disqualification', 'No Contest'];


        $scope.results = ['Pending', 'Win', 'Loss', 'Push', 'Cancelled', 'Half-Win', 'Half-Loss'];

        $scope.savePick = function(pick){
            function cb(err, updatedPick){
                pick.profit = updatedPick.profit;
                pick.roi = updatedPick.roi;
                pick.result = updatedPick.result;
            }
            Picks.resolve(pick, cb);
        };

        $scope.setContestants = function(event){
            $scope.contestants = [
                undefined,
                {name: event.contestant1.name, ref:event.contestant1.ref},
                {name: event.contestant2.name, ref:event.contestant2.ref}
            ];
            return $scope.contestants;
        };


        $scope.setWinner = function(event){
            console.log(event);
            if(event.contestantWinner) {
                var found = $filter('filter')($scope.contestants, function (contestant) {
                    if(contestant) return contestant.ref === event.contestantWinner.ref;
                });
                console.log(found);
                if (found.length) $scope.event.contestantWinner = $scope.contestants[$scope.contestants.indexOf(found[0])];
            }
        };


    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListEventsController', ['$scope', 'Sports', 'Leagues',
    function ($scope, Sports, Leagues) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getLeagues = function(){
            function cb(err, leagues){
                $scope.leagues = leagues;
            }
            Sports.getLeagues($scope.sport._id, cb);
        };

        $scope.page = 0;

        $scope.getLeagueEvents = function(){
            function cb(err, Events){
                $scope.Events = Events;
            }
            Leagues.getEvents($scope.league._id, $scope.page, cb);
        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminCreateGroupController', ['$scope', 'Groups', 'Sports', '$state',
    function ($scope, Groups, Sports, $state) {
        $scope.group = {};

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.submit = function(){

            function cb(err, group){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.group = group;
                    $state.go('admin.editGroup',{groupId: $scope.group._id});
                }
            }
            Groups.create($scope.group, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditGroupController', ['$scope', 'groupResolve', 'Groups', 'Sports', '$state',
    function ($scope, groupResolve, Groups, Sports, $state) {
        $scope.group = groupResolve;

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.submit = function(){
            function cb(err, group){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.group = group;
                    $state.go('admin.groups');
                }
            }
            Groups.update($scope.group, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListGroupsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getGroups = function(){
            function cb(err, groups){
                $scope.groups = groups;
            }
            Sports.getGroups($scope.sport._id, cb);
        };

    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditLeagueController', ['$scope', '$stateParams', 'Leagues', 'Sports', '$state',
    function ($scope, $stateParams, Leagues, Sports, $state) {

        function cb_getGroups(err, groups){
            $scope.groups = groups;
        }

        function cb_getLeague(err, league){
            $scope.league = league;
            Sports.getGroups($scope.league.sport.ref, cb_getGroups);
        }

        Leagues.get($stateParams.leagueId, cb_getLeague);

        $scope.submit = function(){
            function cb(err, league){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.league = league;
                    $state.go('admin.leaguesBySport', {sportId: $scope.league.sport.ref});
                }
            }
            Leagues.update($scope.league, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListLeaguesController', ['$scope', '$stateParams', '$state', 'Sports',
    function ($scope, $stateParams, $state, Sports) {

        function cb_getSports(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb_getSports);

        $scope.getLeagues = function(){
            $state.go('admin.leaguesBySport', {sportId:$scope.sport});
        };


        function cb_getLeagues(err, leagues){
            $scope.leagues = leagues;
        }

        if($stateParams.sportId){
            $scope.sport = $stateParams.sportId;
            Sports.getLeagues($stateParams.sportId, cb_getLeagues);

        }

        $scope.activeFilterEnabled = false;

        $scope.activeFilter = function(sport){
            if($scope.activeFilterEnabled){
                return sport.active;
            }
            return true;
        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminEditSportController', ['$scope', 'sportResolve', 'Sports', '$state',
    function ($scope, sportResolve, Sports, $state) {
        $scope.sport = sportResolve;

        $scope.submit = function(){
            function cb(err, sport){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.sport = sport;
                    $state.go('admin.sports');
                }
            }
            Sports.update($scope.sport, cb);

        };
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminListSportsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminPropicksAllController', ['$scope', 'Propicks',
    function ($scope, Propicks) {
        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getAll(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminPropicksLeagueMonthController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getByLeague(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminPropicksLeagueTotalsController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getTotalsByLeague(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminPropicksSportMonthController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getBySport(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminPropicksSportTotalsController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getTotalsBySport(cb);
    }
]);

'use strict';

angular.module('fu.admin').controller('AdminResolveListSportsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            console.log(sports);
            $scope.sports = sports;
        }

        Sports.getResolveList(cb);

    }
]);

'use strict';

angular.module('fu.admin').controller('AdminResolveSportController', ['$scope', '$stateParams', 'Sports', 'Events', '$filter',
    function ($scope, $stateParams, Sports, Events, $filter) {
        $scope.sportId = $stateParams.sportId;

        function cb(err, events){
            console.log(events);
            $scope.events = events;
        }
        function cbGetSport(err, sport){
            $scope.sport = sport;
            Sports.getResolveEvents($scope.sport._id, cb);
        }

        Sports.get($scope.sportId, cbGetSport);

        /**
         *  Filters
         */

        $scope.isNCAAB = function(event){
            return event.event.league.name === 'NCAAB';
        };
        $scope.isNotNCAAB = function(event){
            return event.event.league.name !== 'NCAAB';
        };
        $scope.isDotaOrLeague = function(event){
            if(event.event.league.ref.group){
                return event.event.league.ref.group.name === 'League of Legends' || event.event.league.ref.group.name === 'Dota 2';
            }
        };
        $scope.isCsGo = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'CS:GO';
            }
        };
        $scope.isStarcraft = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'Starcraft 2';
            }
        };

        /**
         * Boxing/MMA
         */

        $scope.boxingMethodOfVictory = ['Decision', 'Knockout', 'Draw', 'Disqualification', 'No Contest'];
        $scope.mmaMethodOfVictory = ['Decision', 'Knockout', 'Submission', 'Draw', 'Disqualification', 'No Contest'];


        $scope.cancelEvent = function(event){
            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    event = updatedEvent;
                }
            }

            if (confirm('Are you sure you want to cancel this event?')) {
                Events.cancel(event, cb);
            }
        };


        $scope.saveEvent = function(event){

            function cb(err, updatedEvent){
                console.log(updatedEvent);
                if(err){
                    alert(err);
                } else {
                    for(var field in updatedEvent){
                        if(field.indexOf('Score') !== -1 || field === 'contestantWinner'){
                            event[field] = updatedEvent[field];
                        }
                    }
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
               Events.resolve(event, cb);
            }

        };

        $scope.setContestants = function(event){
            return [
                undefined,
                {name: event.contestant1.name, ref:event.contestant1.ref},
                {name: event.contestant2.name, ref:event.contestant2.ref}
            ];
        };

        $scope.setWinner = function(contestants, event){
            if(event.contestantWinner) {
                var found = $filter('filter')(contestants, function (contestant) {
                    if(contestant) return contestant.ref === event.contestantWinner.ref;
                });
                if (found.length) event.contestantWinner = contestants[contestants.indexOf(found[0])];
            }
        };
    }
]);

'use strict';

angular.module('fu').controller('AuthSideMenuController', ['$scope', '$filter', '$location', 'Modal', 'Authentication', 'User', '$rootScope',
    function ($scope, $filter, $location, Modal, Authentication, User, $rootScope) {
        $scope.authentication = Authentication;
        $scope.user = User;
        $scope.showSideMenu = false;

        $scope.isActive = function(page){
            return page === $location.url();
        };

        $scope.notificationCount = function(){
            return $filter('filter')($scope.user.info.notifications, {'new':true}).length;
        };

        $scope.showMyPicks = function(){
            Modal.showModal(
                'modules/fu/client/views/users/modal/modal-my-picks.client.view.html',
                'ModalMyPicksController',
                {},
                'my-picks'
            );
        };

        $scope.showChannelSelect = function(){
            Modal.showModal(
                'modules/fu/client/views/channels/modal/modal-choose-channels.client.view.html',
                'ModalChooseChannelsController',
                {},
                'choose-channels'
            );
        };

        $scope.showNotifications = function(){
            Modal.showModal(
                'modules/fu/client/views/notifications/modal/modal-notifications.client.view.html',
                'ModalNotificationsController',
                {},
                'notifications'
            );
        };

        $rootScope.$on('toggleSideMenu', function(){
            $scope.toggleSideMenu();
        });

        $scope.toggleSideMenu = function(){
            $scope.showSideMenu = !$scope.showSideMenu;
        };

    }
]);

'use strict';

angular.module('fu').controller('BetSlipController', ['$scope', 'BetSlip', '$rootScope', '$location', 'Loading', 'Modal',
    function ($scope, BetSlip, $rootScope, $location, Loading, Modal) {
        $scope.betSlip = BetSlip;
        $scope.loading = Loading;
        $scope.show = false;
        $scope.isPicksPage = $location.url().indexOf('make-picks') !== -1;

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $scope.isPicksPage =  toState.name.indexOf('makePicks') !== -1;
            });

        $scope.events = BetSlip.events;

        function highlightPicks(values){
            for(var i=0; i<$scope.events.length; i++){
                for(var j=0; j<$scope.events[i].picks.length; j++){
                    var pick = $scope.events[i].picks[j];
                    for(var k=0; k<values.length; k++){
                        if(pick._id === values[j].betId){
                            pick.error = true;
                            if('odds' in values[j]){
                                pick.odds = values[j].odds;
                                pick.oddsChanged = true;
                            }
                        }
                    }
                }
            }
        }

        function highlightEvents(values){
            for(var i=0; i<$scope.events.length; i++){
                for(var j=0; j<values.length; j++){
                    if(values[j].eventId === $scope.events[i].event._id){
                        $scope.events[i].error = true;
                    }
                }
            }
        }


        function handleError(err){
            $scope.errorMessage = err.message;
            $scope.betSlip.status.error = true;
            $scope.betSlip.status.submitted = false;

            switch (err.type){
                case 'invalid units':
                    highlightPicks(err.values);
                    break;
                case 'units':
                    break;
                case 'started':
                    highlightEvents(err.values);
                    break;
                case 'changed':
                    highlightPicks(err.values);
                    break;
                case 'duplicate':
                    highlightPicks(err.values);
                    break;
            }
        }



        $scope.submitPicks = function(){

            $scope.betSlip.status.error = false;
            $scope.betSlip.status.submitted = false;
            $scope.errorMessage = null;

            function cb(err){
                if(err) handleError(err);

            }

            Modal.showModal(
                '/modules/fu/client/views/make-picks/modal/modal-make-picks-confirm.client.view.html',
                'ModalMakePicksConfirmController',
                {
                    submitCallback: function () {
                        return cb;
                    }
                },
                'prompt'
            );

        };

        $scope.toggleShow = function(){
            $scope.show = !$scope.show;
        };

    }
]);

'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Channels', 'SocketChannel', 'Loading', 'Page',
    function ($scope, $state, $stateParams, $location, Authentication, Channels, SocketChannel, Loading, Page) {

        $scope.date = $stateParams.date;
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.location = $location;

        function setDate(date){
            $scope.currentDate = new Date(date);
            $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
            $scope.dayBeforeYesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 2);
            $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
        }

        if($scope.date){
            if(!moment($scope.date, "YYYY-MM-DD", true).isValid()) $state.go('channel', {channelSlug:$scope.channelSlug });
            var date = $scope.date.split('-');
            date = new Date(date[0], date[1]-1, date[2]);
            setDate(date);
        }

        function setupSocket(){
            $scope.socket = SocketChannel;
            if($scope.socket){
                $scope.socket.connect();
            }
            $scope.socket.emit('join channel', $scope.channel._id);
        }

        function updateMetaData(){
            Page.meta.title = $scope.channel.name + ' Betting Community | FansUnite';
            Page.meta.description = 'Daily '+$scope.channel.name+' betting discussions, pro picks, free tips, odds and community consensus.';
            Page.meta.keywords = $scope.channel.name+' betting, '+$scope.channel.name+' pro picks, '+$scope.channel.name+' free tips, '+$scope.channel.name+' odds, '+$scope.channel.name+' consensus';
        }

        function cb(err, channelContent){
            if(!channelContent) $state.go('not-found');
            $scope.loading.isLoading.pageLoading = false;
            $scope.channelContent = channelContent;
            $scope.channel = channelContent.channel;
            setupSocket();
            updateMetaData();

            if(!$scope.date){
                switch($scope.channel.dateGroup){
                    case 'upcoming':
                        $scope.upcoming = true;
                        setDate( new Date());
                        break;
                    case 'daily':
                        setDate( new Date());
                        break;
                    case 'weekly':
                        break;
                }
            }

        }

        $scope.loading.isLoading.pageLoading = true;
        Channels.getContent($scope.channelSlug, $scope.currentDate, cb);

        $scope.updateDate = function(date){
            $state.go('channel.main.date', {channelSlug:$scope.channelSlug, date:date.toISOString().substring(0, 10)});
            $scope.upcoming = false;
            setDate(date);
            $scope.getEvents();
        };

        $scope.getEvents = function(){
            $scope.eventsLoading = true;
            function cb(err, events){
                $scope.channelContent.eventGroups = events;
                $scope.eventsLoading = false;
            }
            if($scope.upcoming){
                Channels.getEvents($scope.channelSlug, null, cb);
            } else {
                Channels.getEvents($scope.channelSlug, $scope.currentDate, cb);
            }
        };

        $scope.setUpcoming = function(){
            $state.go('channel.main.home', {channelSlug:$scope.channelSlug});
            $scope.upcoming = true;
            setDate(new Date());
            $scope.getEvents();
        };

    }
]);

'use strict';

angular.module('fu').controller('ModalChooseChannelsController', ['$scope', '$modalInstance', 'Modal', 'Channels',
    function($scope, $modalInstance, Modal, Channels) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, channels){
            $scope.channels = channels;
        }

        Channels.getAll(cb);

    }
]);


'use strict';

angular.module('fu').controller('DiscoverController', ['$scope', '$stateParams', '$state', '$filter', 'Authentication', 'Leaderboard', 'Page', 'Keywords',
    function ($scope, $stateParams, $state, $filter, Authentication, Leaderboard, Page, Keywords) {
        $scope.authentication   = Authentication;
        $scope.sportSlug        = $stateParams.sportSlug;
        $scope.leagueSlug       = $stateParams.leagueSlug;
        $scope.contestantSlug   = $stateParams.contestantSlug;
        $scope.page = Page;



        $scope.filters = {
            sports: [
                {name:'All Sports', _id:'all'}
            ],
            leagues: [
                {name:'All Leagues', _id:'all'}
            ],
            contestants: [
                {name:'All Teams', _id: 'all'}
            ],
            homeAway: [
                {name:'Home/Away', id:'both'},
                {name:'Home',id:'home'},
                {name:'Away', id:'away'}
            ],
            betDurations: [
                {name: 'All Periods', id: 'all'}
            ],
            betTypes: [
                {name:'All Bet Types', id: 'all'}
            ],
            minBets: [
                {name: 'No Minimum Picks', id: 'all'},
                {name: '100 picks', id: 100},
                {name: '50 picks', id: 50},
                {name: '30 picks', id: 30},
                {name: '10 picks', id: 10},
            ],
            dates: [
                {id : 'last7Days',  name : 'Last 7 Days'},
                {id : 'last30Days', name : 'Last 30 Days'},
                {id : 'last60Days', name : 'Last 60 Days'},
                {id : 'last90Days', name : 'Last 90 Days'},
                {id : 'last6Months', name : 'Last 6 Months'},
                {id : 'lastYear', name : 'Last Year'},
                {id : 'allTime', name : 'All Time'}
            ]
        };

        $scope.filter = {
            sport:       $scope.filters.sports[0],
            league:      $scope.filters.leagues[0],
            contestant:  $scope.filters.contestants[0],
            homeAway:    $scope.filters.homeAway[0],
            betDuration: $scope.filters.betDurations[0],
            betType:     $scope.filters.betTypes[0],
            minBets:     $scope.filters.minBets[0],
            date:        $scope.filters.dates[1]
        };

        $scope.updateLeagues = function(){
            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                var selectedLeague = $filter('filter')($scope.filters.leagues, function(league){
                    return league._id === $scope.filter.league._id;
                });
                if(selectedLeague.length){
                    $scope.filter.league =  $scope.filters.leagues[$scope.filters.leagues.indexOf(selectedLeague[0])];
                } else {
                    $scope.filter.league = $scope.filters.leagues[0];
                }
            }

            if($scope.filter.sport._id !== 'all'){
                var sportId =  $scope.filter.sport._id;
                var dateId = $scope.filter.date.id;
                Leaderboard.getLeagues(sportId, dateId, cb);
            }
        };

        $scope.sportChange = function(){
            updateBetTypes();
            updateBetDurations();

            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                $scope.filter.league = $scope.filters.leagues[0];
            }

            if($scope.filter.sport._id === 'all') {
                $state.go('discover.home');
            } else {
                $state.go('discover.sport', {sportSlug: $scope.filter.sport.slug});
                $scope.filter.contestant = $scope.filters.contestants[0];
                var sportId =  $scope.filter.sport._id;
                var dateId = $scope.filter.date.id;

                Leaderboard.getLeagues(sportId, dateId, cb);
            }


        };

        $scope.leagueChange = function(){
            updateBetTypes();
            updateBetDurations();

            function cb(err, contestants){
                $scope.filters.contestants = [{name:'All Teams', _id:'all'}];
                $scope.filters.contestants = $scope.filters.contestants.concat(contestants);
                $scope.filter.contestant = $scope.filters.contestants[0];
            }

            if($scope.filter.league._id === 'all'){
                $state.go('discover.sport', {sportSlug: $scope.filter.sport.slug});
            } else {
                $state.go('discover.league', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug});
                var leagueId =  $scope.filter.league._id;
                Leaderboard.getContestants(leagueId, cb);
            }
        };

        $scope.contestantChange = function(){
            if($scope.filter.contestant._id === 'all') {
                $state.go('discover.league', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug});
            } else {
                $state.go('discover.contestant', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug, contestantSlug: $scope.filter.contestant.slug});
            }
        };


        $scope.filter = {
            sport:       $scope.filters.sports[0],
            league:      $scope.filters.leagues[0],
            contestant:  $scope.filters.contestants[0],
            homeAway:    $scope.filters.homeAway[0],
            betDuration: $scope.filters.betDurations[0],
            betType:     $scope.filters.betTypes[0],
            minBets:     $scope.filters.minBets[0],
            date:        $scope.filters.dates[1]
        };

        function updatePageMeta(){
            var capperTextCap = 'Handicappers';
            var picksTextCap = 'Picks';
            var capperText = 'handicappers';
            var picksText = 'picks';
            if($scope.filter.sport._id !== 'all'){
                capperTextCap = Keywords.getCapperText($scope.filter.sport.name, true);
                capperText = Keywords.getCapperText($scope.filter.sport.name, false);
            }

            console.log($scope.filter);

            if($scope.filter.contestant._id !== 'all'){
                $scope.page.meta.title = 'Top '+$scope.filter.contestant.name+' '+capperTextCap + ' | FansUnite';
                $scope.page.meta.description = 'Find the best '+$scope.filter.contestant.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.';
                $scope.page.meta.keywords = 'top '+$scope.filter.contestant.name+' '+capperText+', best '+$scope.filter.contestant.name+' '+capperText;
            } else if ($scope.filter.league._id !== 'all' ){
                $scope.page.meta.title = 'Top '+$scope.filter.league.name+' '+capperTextCap + ' | FansUnite';
                $scope.page.meta.description = 'Find the best '+$scope.filter.league.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.';
                $scope.page.meta.keywords = 'top '+$scope.filter.league.name+' '+capperText+', best '+$scope.filter.league.name+' '+capperText;
            } else if ($scope.filter.sport._id !== 'all'){
                $scope.page.meta.title = 'Top '+$scope.filter.sport.name+' '+capperTextCap + ' | FansUnite';
                $scope.page.meta.description = 'Find the best '+$scope.filter.sport.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.';
                $scope.page.meta.keywords = 'top '+$scope.filter.sport.name+' '+capperText+', best '+$scope.filter.sport.name+' '+capperText;
            }
        }

        $scope.updateLeaderboard = function(){

            var query = {
                dateId:  $scope.filter.date.id,
                sportId:  $scope.filter.sport._id,
                leagueId: $scope.filter.league._id,
                contestantId: $scope.filter.contestant._id,
                homeAway: $scope.filter.homeAway.id,
                betDuration: $scope.filter.betDuration.id,
                betType: $scope.filter.betType.id,
                minBets: $scope.filter.minBets.id
            };

            function cb(err, leaderboard){
                $scope.leaderboard = leaderboard;
                setPages();
                updateRank();
                updatePageMeta();
            }

            Leaderboard.getLeaderboard(query, cb);
        };

        function setBetTypes(betTypeArray){
            $scope.filters.betTypes = [{name:'All Bet Types', id: 'all'}];
            for(var i=0; i<betTypeArray.length; i++){
                $scope.filters.betTypes.push({id:betTypeArray[i], name:betTypeArray[i]});
            }
            $scope.filter.betType = $scope.filters.betTypes[0];
        }

        function setBetDurations(betDurationArray){
            $scope.filters.betDurations = [{name: 'All Periods', id: 'all'}];
            for(var i=0; i<betDurationArray.length; i++){
                $scope.filters.betDurations.push({id:betDurationArray[i], name:betDurationArray[i]});
            }
            $scope.filter.betDuration = $scope.filters.betDurations[0];
        }

        function updateBetTypes(){
            if($scope.filter.league._id !== 'all'){
                setBetTypes($scope.filter.league.betTypes);
            } else if($scope.filter.sport._id !== 'all'){
                setBetTypes($scope.filter.sport.betTypes);
            }
        }

        function updateBetDurations(){
            if($scope.filter.league._id !== 'all'){
                setBetDurations($scope.filter.league.betDurations);
            } else if($scope.filter.sport._id !== 'all'){
                setBetDurations($scope.filter.sport.betDurations);
            }

        }


        function selectSportDropdown(){
            var selectedSport = $filter('filter')($scope.filters.sports, function(sport){
                return sport.slug === $scope.sportSlug;
            });
            if(selectedSport.length){
                $scope.filter.sport = $scope.filters.sports[$scope.filters.sports.indexOf(selectedSport[0])];
            } else {
                $scope.filter.sport = $scope.filters.sports[0];
            }
        }



        function selectLeagueDropdown(){
            var selectedLeague = $filter('filter')($scope.filters.leagues, function(league){
                return league.slug === $scope.leagueSlug;
            });
            if(selectedLeague.length){
                $scope.filter.league = $scope.filters.leagues[$scope.filters.leagues.indexOf(selectedLeague[0])];
            } else {
                $scope.filter.league = $scope.filters.leagues[0];
            }
        }

        function selectContestantDropdown(){
            var selectedContestant = $filter('filter')($scope.filters.contestants, function(contestant){
                return contestant.slug === $scope.contestantSlug;
            });
            if(selectedContestant.length){
                $scope.filter.contestant = $scope.filters.contestants[$scope.filters.contestants.indexOf(selectedContestant[0])];
            } else {
                $scope.filter.contestant = $scope.filters.contestants[0];
            }
        }


        function cbGetContestants(err, contestants){
            $scope.filters.contestants = $scope.filters.contestants.concat(contestants);
            if($scope.contestantSlug){
                selectContestantDropdown();
            } else {
                updateBetTypes();
                updateBetDurations();
                $scope.updateLeaderboard();
            }
        }


        function cbGetLeagues(err, leagues){
            $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
            if($scope.leagueSlug){
                selectLeagueDropdown();
                var leagueId =  $scope.filter.league._id;
                Leaderboard.getContestants(leagueId, cbGetContestants);
            } else {
                updateBetTypes();
                updateBetDurations();
                $scope.updateLeaderboard();
            }
        }


        function cbGetSports(err, sports){
            $scope.filters.sports = $scope.filters.sports.concat(sports);
            if($scope.sportSlug){
                 selectSportDropdown();
                 var sportId =  $scope.filter.sport._id;
                 var dateId = $scope.filter.date.id;
                 Leaderboard.getLeagues(sportId, dateId, cbGetLeagues);
            } else {
                $scope.updateLeaderboard();
            }
        }


        Leaderboard.getSports(cbGetSports);


        function setPages(){
            $scope.totalItems = $scope.leaderboard.length;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.maxSize = 5;
        }

        $scope.order = 'profit';
        $scope.updateOrder = function(field){
            $scope.order = field;
            updateRank();
        };

        $scope.currentOrder = function(user){
            return -user[$scope.order];
        };

        $scope.rank = 'N/A';

        function updateRank(){
            var rankFound = false;
            $scope.leaderboard = $filter('orderBy')($scope.leaderboard, $scope.currentOrder);
            for(var i=0; i<$scope.leaderboard.length; i++){
                if($scope.authentication.user._id === $scope.leaderboard[i].user._id){
                    $scope.rank = i+1;
                    rankFound = true;
                }
            }
            if(!rankFound) $scope.rank = 'N/A';
        }

    }

]);

'use strict';

angular.module('fu').controller('GamecenterController', ['$scope', '$stateParams', '$filter', 'Gamecenter', 'User', 'Page', '$location',
    function ($scope, $stateParams, $filter, Gamecenter, User, Page, $location) {
        $scope.eventSlug = $stateParams.eventSlug;
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.location = $location;


        function initializeMakePicks(){
            $scope.betTypes = $scope.gamecenter.bets.betTypes;
            $scope.betDurations =  $scope.gamecenter.bets.betDurations;
            if($scope.betTypes.length) $scope.activeBetType = $scope.betTypes[0];
            if($scope.betDurations.length) $scope.activeBetDuration = $scope.betDurations[0];
            $scope.columns = $scope.betTypes.length;
            if($scope.betTypes.indexOf('team totals') !== - 1) $scope.columns++;
        }


        $scope.proActive = false;
        $scope.allActive = false;

        function initilizePicksTab(){
            if($scope.proCount > 0){
                $scope.proActive = true;
            }  else {
                $scope.proPicks = [];
                $scope.allActive = true;
            }

        }

        $scope.followingPicks = [];
        function initializeFollowingPicks(){
            var allPicks =  $scope.allPicks.concat($scope.proPicks);
            $scope.followingPicks = $filter('filter')(allPicks, function(pick){
                var following = $filter('filter')(User.info.following, function(following){
                    return pick.user.ref._id === following._id;
                });
                return following.length;
            });
        }

        function setMetaData(){
            var separator = ' at ';
            var homeTeam;
            var awayTeam;
            if($scope.event.neutral) separator = ' vs. ';
            if($scope.event.contestant1.ref.name2){
                homeTeam = $scope.event.contestant1.ref.name2;
            } else {
                homeTeam = $scope.event.contestant1.name;
            }
            if($scope.event.contestant2.ref.name2){
                awayTeam = $scope.event.contestant2.ref.name2;
            } else {
                awayTeam = $scope.event.contestant2.name;
            }
            var date = $filter('date')($scope.event.startTime, 'MMM d y');

            Page.meta.title = homeTeam + separator + awayTeam + ' Odds, Picks, Consensus & Discussion - '+ date +' | FansUnite';
            Page.meta.description =  'Up-to-date odds, free picks, community consensus and betting discussion for '+$scope.event.contestant1.name+' vs. '+$scope.event.contestant2.name+' ('+ date + ').';
            Page.meta.keywords = $scope.event.contestant1.name+', '+$scope.event.contestant2.name+', odds, betting discussion, free tips, pro picks, consensus';
        }


        function cb(err, gamecenter){
            $scope.gamecenter   = gamecenter;
            $scope.consensus    = gamecenter.consensus;
            $scope.header       = gamecenter.header;
            $scope.picks        = gamecenter.picks;
            $scope.discussion   = gamecenter.discussion;
            $scope.bets         = gamecenter.bets;
            $scope.allPicks     = gamecenter.picks.general;
            $scope.proPicks     = gamecenter.picks.pro;
            $scope.proCount     = gamecenter.picks.proCount;
            $scope.proHidden    = gamecenter.picks.proHidden;
            $scope.generalCount  = gamecenter.picks.generalCount;
            $scope.generalHidden = gamecenter.picks.generalHidden;
            $scope.event        = gamecenter.event;
            setMetaData();
            initializeFollowingPicks();
            initializeMakePicks();
            initilizePicksTab();
        }

        Gamecenter.get($scope.eventSlug, $scope.leagueSlug, cb);

        $scope.updateActiveBetDuration = function(betDuration){
            $scope.activeBetDuration = betDuration;
        };

        $scope.setActiveBetType = function(betType){
            $scope.activeBetType = betType;
        };

    }
]);

'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication', 'Hub', 'CommentsPreviews', 'SocketHub', 'Loading', '$filter', 'User', 'StripeService',
    function ($scope, Authentication, Hub, CommentsPreviews, SocketHub, Loading, $filter, User, StripeService) {
        $scope.authentication = Authentication;
        $scope.user = User;
        $scope.loading = Loading;
        $scope.socket = SocketHub;
        if($scope.socket){
            $scope.socket.connect();
        }

        /**
         * General Hub Info
         */

        function cbGetHub(err, hub){
            $scope.loading.isLoading.pageLoading = false;
            $scope.hub = hub;
            $scope.disableScroll = false;
            setPages();
            updateRank();
        }
        $scope.loading.isLoading.pageLoading = true;
        Hub.getHub(cbGetHub);

        /**
         * Picks Feed
         */

        $scope.picks = {
            all:{
                pending: [],
                completed: []
            },
            pro: {
                pending: [],
                completed: []
            }
        };

        $scope.pages = {
            all:{
                pending: 0,
                completed: 0
            },
            pro: {
                pending: 0,
                completed: 0
            }
        };

        $scope.tab = 'all';


        $scope.pickFilters = ['pending', 'completed'];
        $scope.pickFilter = $scope.pickFilters[0];
        $scope.setPickFilter = function(pickFilter){
        };

        $scope.filterChange = function(pickFilter){
            $scope.pickFilter = pickFilter;
            if($scope.picks[$scope.tab][$scope.pickFilter].length === 0){
                $scope.getPicks();
            }
        };
        $scope.tabChange = function(tab){
            $scope.tab = tab;
            if($scope.picks[$scope.tab][$scope.pickFilter].length === 0){
                $scope.getPicks();
            }
        };

        $scope.getPicks = function(){
            function cbGetPicks(err, picks){
                $scope.picks[$scope.tab][$scope.pickFilter] = $scope.picks[$scope.tab][$scope.pickFilter].concat(picks);
                $scope.pages[$scope.tab][$scope.pickFilter]++;
                $scope.disableScroll = false;
            }

            var query = {
                page: $scope.pages[$scope.tab][$scope.pickFilter],
                type: $scope.pickFilter
            };
            if($scope.tab === 'pro') query.pro = true;
            $scope.disableScroll = true;
            Hub.getPicks(query, cbGetPicks);
        };

        //$scope.getPicks();
        $scope.disableScroll = true;

        $scope.getMorePicks = function(){
            if(!$scope.disableScroll){
                $scope.disableScroll = true;
                $scope.getPicks();
            }
        };

        /**
         * Talk
         */


        $scope.getTalk = function(){
            var query = {
                sportId: 'all',
                leagueId: 'all',
                count: 5
            };

            function cb(err, previews){
                $scope.previews = previews;
            }

            CommentsPreviews.getPreviews(query, cb);
        };
        $scope.getTalk();

        /**
         * Leaderboard
         */


        function setPages(){
            $scope.totalItems = $scope.hub.leaderboard.length;
            $scope.currentPage = 1;
            $scope.pageSize = 5;
            $scope.maxSize = 0;
        }

        $scope.rank = 'N/A';

        function updateRank(){
            var rankFound = false;
            var leaderboard = $filter('orderBy')($scope.hub.leaderboard, 'profit', true);

            for(var i=0; i<leaderboard.length; i++){
                if($scope.authentication.user._id === leaderboard[i].user._id){
                    $scope.rank = i+1;
                    rankFound = true;
                }
            }
            if(!rankFound) $scope.rank = 'N/A';

        }

        $scope.showSubscriptionModal = function(){
            StripeService.showSubscriptionModal();
        };

    }
]);

'use strict';

angular.module('fu').controller('MainController', ['$scope', '$state', 'Authentication', 'User', 'Loading', '$rootScope', 'Page', '$http',
    function ($scope, $state, Authentication, User, Loading, $rootScope, Page, $http) {
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.page = Page;

        if($scope.authentication.user && !User.info.initialized) User.initialize();

        $scope.isPicksPage = function(){
            return $state.current.name.indexOf('makePicks') !== -1;
        };
        $scope.isBlog = function(){
            return $state.current.name.indexOf('blog') !== -1;
        };
        $scope.isAdmin = function(){
            if($scope.authentication.user) return  $scope.authentication.user.roles.indexOf('admin') !== -1;
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                $scope.page.meta.title = $state.current.title;
                $scope.page.meta.description = $state.current.description;
                $scope.page.meta.keywords = $state.current.keywords;
            }
        });


        $scope.resendVerificationEmail = function() {
            $scope.loading.isLoading.formSubmit = true;
            $scope.resendSuccess = $scope.resendError = null;
            $http.post('/api/verification/send').success(function(response) {
                $scope.loading.isLoading.formSubmit = false;
                $scope.resendSuccess = response.message;
            }).error(function(response) {
                $scope.loading.isLoading.formSubmit = false;
                $scope.resendError = response.message;
            });
        };
    }
]);

'use strict';

angular.module('fu').controller('MakePicksController', ['$scope',
    function ($scope) {

        $scope.showMenu = false;
        $scope.$on('toggleMenu', function(){
            $scope.showMenu = !$scope.showMenu;
        });

        $scope.toggleMenu = function(){
            $scope.showMenu = !$scope.showMenu;
        };
    }
]);

'use strict';

angular.module('fu').controller('MakePicksMenuController', ['$scope', '$stateParams', '$filter', 'Authentication', 'MakePicks', '$rootScope', 'Page',
    function ($scope, $stateParams, $filter, Authentication, MakePicks, $rootScope, Page) {
        $scope.authentication = Authentication;
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;

        function updateMeta(){
            Page.meta.title = 'Free '+$scope.activeSport.name+ ' - '+MakePicks.active.league.name+' Online Sportsbook | FansUnite';
            Page.meta.description = 'Track your bets on our free online sportsbook with up-to-date '+MakePicks.active.league.name+' odds.';
            Page.meta.keywords = 'free '+MakePicks.active.league.name+' online sportsbook, free online '+MakePicks.active.league.name+' betting, latest odds';
        }

        $scope.updateSport = function(sport){
            $scope.activeSub1 = null;
            if(sport === $scope.activeSport){
                $scope.activeSport = null;
            } else {
                $scope.activeSport = sport;
            }
        };


        $scope.updateSub1 = function(sub1, abstract){
            if(sub1 === $scope.activeSub1 && abstract){
                $scope.activeSub1 = null;
            } else {
                $scope.activeSub1 = sub1;
                $scope.activeSub2 = null;
                MakePicks.active.league = $scope.activeSub1;
                updateMeta();
            }
        };

        $scope.updateSub2 = function(sub2){
            $scope.activeSub2 = sub2;
            MakePicks.active.league = $scope.activeSub2;
            updateMeta();
        };

        $scope.setActiveMenu = function(){
            var activeSport = $filter('filter')($scope.menu, {slug:$scope.sportSlug});
            if(activeSport.length === 1){
                $scope.activeSport = activeSport[0];
                for(var i=0; i<$scope.activeSport.main.length; i++){
                    var sub1 = $scope.activeSport.main[i];
                    if('main' in sub1){
                        for(var j=0; j<sub1.main.length;j++){
                            var sub2 = sub1.main[j];
                            if(sub2.slug === $scope.leagueSlug){
                                $scope.activeSub1 = sub1;
                                $scope.activeSub2 = sub2;
                                MakePicks.active.league = $scope.activeSub2;
                                updateMeta();
                                break;
                            }
                        }
                    }
                    if(sub1.slug === $scope.leagueSlug){
                        $scope.activeSub1 = sub1;
                        MakePicks.active.league = $scope.activeSub1;
                        updateMeta();
                        break;
                    }
                }
            }
            $rootScope.$broadcast('menuSet');
        };


        function cbGetMenu(err, menu){

            if(!err){
                MakePicks.menu = menu;
                $scope.menu = menu;
                $scope.setActiveMenu();
            }
        }
        MakePicks.getMenu(cbGetMenu);

        $scope.showMenu = false;



    }
]);

'use strict';

angular.module('fu').controller('MakePicksPicksController', ['$scope', '$stateParams', 'Authentication', 'MakePicks',
    function ($scope, $stateParams, Authentication, MakePicks) {
        $scope.authentication = Authentication;

        $scope.query = {};
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;

        $scope.menu = MakePicks.menu;
        $scope.makePicks = MakePicks;

        $scope.setActiveBetType = function(betType){
            $scope.activeBetType = betType;
        };
        $scope.setActiveBetDuration = function(betDuration){
            $scope.activeBetDuration = betDuration;
        };

        function getEvents(query){
            function cbGetEvents(err, results){
                console.log(results);
                if(!err){
                    $scope.events = results.events;
                    $scope.betTypes = results.betTypes;
                    if($scope.betTypes.length) $scope.activeBetType = $scope.betTypes[0];
                    $scope.betDurations = results.betDurations;
                    if($scope.betDurations.length) $scope.activeBetDuration = $scope.betDurations[0];
                    $scope.columns = $scope.betTypes.length;
                    if($scope.betTypes.indexOf('team totals') !== - 1) $scope.columns++;
                }
            }
            MakePicks.getEvents(query, cbGetEvents);
        }


        $scope.getEvents = function(){
            var query = {};
            if(MakePicks.active.league){
                query.leagueId = MakePicks.active.league._id;
                getEvents(query);
            }
        };

        $scope.$on('menuSet', function() {
            $scope.getEvents();
        });


        if($scope.menu.length){
            $scope.getEvents();
        }

        $scope.toggleMenu = function(){
            $scope.$emit('toggleMenu');
        };
    }
]);

'use strict';

angular.module('fu').controller('ModalMakePicksConfirmController', ['$scope', '$modalInstance', 'submitCallback', 'Modal', 'BetSlip', 'Loading', 'Authentication', '$location',
    function($scope, $modalInstance, submitCallback, Modal, BetSlip, Loading, Authentication, $location) {
        $scope.betSlip = BetSlip;
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.loading = Loading;
        $scope.authentication = Authentication;
        $scope.location = $location;

        $scope.confirmYes = function(){
            $scope.betSlip.submit(submitCallback);
        };

        $scope.modalInstance.result.then(function (selectedItem) {
        }, function () {
            $scope.betSlip.status.submitted = false;
        });
    }
]);


'use strict';

angular.module('fu').controller('MyFollowingController', ['$scope', 'User', 'Sports', '$filter', 'Trending',
    function ($scope, User, Sports, $filter, Trending) {
        $scope.filters = {};

        $scope.filters = {
            sports: [
                {name:'All Sports', _id:'all'}
            ],
            leagues: [
                {name:'All Leagues', _id:'all'}
            ],
            dates: [
                {id : 'last7Days',  name : 'Last 7 Days'},
                {id : 'last30Days', name : 'Last 30 Days'},
                {id : 'last60Days', name : 'Last 60 Days'},
                {id : 'last90Days', name : 'Last 90 Days'},
                {id : 'last6Months', name : 'Last 6 Months'},
                {id : 'lastYear', name : 'Last Year'},
                {id : 'allTime', name : 'All Time'}
            ]
        };

        $scope.filter = {
            sport:       $scope.filters.sports[0],
            league:      $scope.filters.leagues[0],
            date:        $scope.filters.dates[1]
        };

        function cbGetSports(err, sports){
            $scope.filters.sports = $scope.filters.sports.concat(sports);
        }

        Sports.getAll(cbGetSports);
        var followingList = [];

        function cbGetFollowing(err, following){
            $scope.followingLeaderboard = following;
            followingList = following.concat([]);
            updateList();
        }

        $scope.updateFollowing = function(){
            var query = {
                dateId:  $scope.filter.date.id,
                sportId:  $scope.filter.sport._id,
                leagueId: $scope.filter.league._id
            };
            User.getFollowing(query, cbGetFollowing);
        };
        $scope.updateFollowing();

        $scope.updateLeagues = function(){
            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                var selectedLeague = $filter('filter')($scope.filters.leagues, function(league){
                    return league._id === $scope.filter.league._id;
                });
                if(selectedLeague.length){
                    $scope.filter.league =  $scope.filters.leagues[$scope.filters.leagues.indexOf(selectedLeague[0])];
                } else {
                    $scope.filter.league = $scope.filters.leagues[0];
                }
            }

            if($scope.filter.sport._id !== 'all'){
                var sportId =  $scope.filter.sport._id;
                Sports.getLeagues(sportId, cb);
            }
        };



        $scope.order = 'profit';
        $scope.updateOrder = function(field){
            $scope.order = field;
        };

        $scope.currentOrder = function(user){
            return -user[$scope.order];
        };

        $scope.limitOn = true;
        $scope.toggleLimit = function(){
            $scope.limitOn = !$scope.limitOn;
        };

        $scope.limit = function(){
            if($scope.limitOn) return 5;
            return 9999999;
        };

        $scope.madePicks = true;
        $scope.hasPicks = true;

        var madePicksFilter = function(user){
            return user.profit !== 0;
        };
        var hasPicksFilter = function(user){
            return user.events.length > 0;
        };

        function updateList(){
            var list = followingList.concat([]);
            if($scope.madePicks) list = $filter('filter')(list, madePicksFilter);
            if($scope.hasPicks) list = $filter('filter')(list, hasPicksFilter);
            $scope.followingList = list;
        }

        $scope.toggleHasPicks = function(){
            $scope.hasPicks = !$scope.hasPicks;
            updateList();
        };

        $scope.toggleMadePicks = function(){
            $scope.madePicks = !$scope.madePicks;
            updateList();
        };

        $scope.updateTrending = function(){
            var query = {
                sportId: $scope.filter.sport._id,
                leagueId: $scope.filter.league._id,
                dateId: $scope.filter.date.id,
                count: 4
            };
            function cb(err, trending){
                console.log(trending);
                $scope.trending = trending;
            }

            Trending.get(query, cb);
        };

        $scope.updateTrending();

    }
]);

'use strict';

angular.module('fu').controller('ModalNotificationsController', ['$scope', '$modalInstance', 'Modal', 'User', 'Authentication',
    function($scope, $modalInstance, Modal, User, Authentication) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.notifications = User.info.notifications;
        $scope.authentication = Authentication;

    }
]);


'use strict';

angular.module('fu').controller('ModalPickCommentController', ['$scope', '$modalInstance', 'Modal', 'pick', 'Picks',
    function($scope, $modalInstance, Modal, pick, Picks) {
        $scope.pick = pick;
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, comments){
            $scope.comments = comments;
        }

        Picks.getComments($scope.pick, cb);
    }
]);


'use strict';

angular.module('fu').controller('ProfileController', ['$scope', '$state', '$stateParams', 'Users', 'Authentication', '$filter', 'Loading', 'Page', '$location',
    function ($scope, $state, $stateParams, Users, Authentication, $filter, Loading, Page, $location) {
        $scope.username = $stateParams.username;
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.location = $location;
        if(!$scope.username) $state.go('hub');

        Page.meta.title = $scope.username + ' Picks & Verified Record | FansUnite';
        Page.meta.description = 'Get access to '+$scope.username+"'s sportsbetting picks with 100% verified and transparent results.";
        Page.meta.keywords = 'free picks, free tips, pro picks, pro tips';

        function cbGetProfile(err, profile){
            if(!profile) $state.go('not-found');
            $scope.loading.isLoading.pageLoading = false;
            if(!err) $scope.profile = profile;
            $scope.initializeTracker($scope.profile.trackerPicks);
        }
        $scope.loading.isLoading.pageLoading = true;
        Users.getProfile($scope.username, cbGetProfile);

        /**
         *
         *
         * TRACKER
         *
         */

        $scope.trackerTabs = [
            {active:false},
            {active:false},
            {active:false},
            {active:false}
        ];

        $scope.initialized = false;
        $scope.initialClick = function(){
            if(!$scope.initialized) $scope.trackerTabs[0].active = true;
            $scope.initialized = true;
        };

        $scope.initializeTracker = function(picks){
            if(picks.length>0){
                $scope.picks = $filter('filter')(picks, function(pick){
                    return pick.result !== 'Pending';
                });
                $scope.betTypeStats = getSummaryStats($scope.picks, 'betType');
                $scope.sportStats = getSummaryStats($scope.picks, 'event.sport');
                $scope.allTeamStats = getSummaryStats($scope.picks, 'contestant.ref');
                $scope.allTeamStats = $filter('limitTo')($scope.allTeamStats, 5);

                $scope.betTypeColumnChart = getColumnChart($scope.betTypeStats, 'Bet Type');
                $scope.sportColumnChart = getColumnChart($scope.sportStats, 'Sport');
                $scope.teamColumnChart = getColumnChart($scope.allTeamStats, 'Team');
                $scope.betTypeWageredPieChart = getPieChart($scope.betTypeStats, 'Bet Type', {label:'Units Wagered',field:'units'});
                $scope.profitAreaChart = getAreaChart($scope.picks, {label:'Profit',field:'profit'}, 'Day');
                $scope.sportWageredPieChart = getPieChart($scope.sportStats, 'Sport', {label:'Units Wagered',field:'units'});

                $scope.updateOverview('Day');
            }
        };


        $scope.username = $stateParams.username;
        $scope.authentication = Authentication;


        var colors ={
            'moneyline': '#134580',     //blue
            'spread': '#ed7023',        //orange
            'team totals': '#F9BF3B',   //yellow
            'total points': '#00B16A',  //green
            'sets': '#32b5bf',          //indigo

            'basketball': '#E87E04', //Orange
            'hockey': '#4183D7', // blue
            'soccer': '#26A65B', //green
            'baseball':'#F4D03F', //yellow
            'mixed martial arts': '#CF000F', //red
            'football': '#34495E', //dark orange
            'e sports': '#663399', //purple

            'tennis': '#3FC380', //green
            'aussie rules': '#D24D57', //red
            'cricket': '#F4B350', //orange
            'curling': '#81CFE0', //blue
            'golf': '#36D7B7', //green
            'rugby league': '#F5D76E', //yellow
            'rugby union': '#9B59B6', //purple
            'volleyball': '#6C7A89' //gray
        };

        var colorList = [
            '#134580', '#ed7023', '#00B16A', '#F9BF3B', '#32b5bf', '#D24D57', '#9B59B6', '#6C7A89', '#CF000F', '#26A65B', '#81CFE0'
        ];


        //set axis title
        //set legend
        var groupResult = function(category, property, value, picks, color, color2){

            //Check for category name
            if(category && typeof category === 'object' && 'name' in category){
                category = category.name;
            }

            //Filter Picks
            var properties = property.split('.');
            picks = $filter('filter')(picks, function(pick){
                var compare = pick;
                for(var i=0; i<properties.length; i++){
                    if(compare && properties[i] in compare){
                        compare = compare[properties[i]];
                    }
                }

                return compare === value;
            });

            var results = {};
            if(picks.length > 0){

                //Category, Win, Loss, Push, Total, Units Wagered, Avg. Odds, Win %, ROI, Profit
                results = {
                    category: category,
                    win: 0,
                    loss: 0,
                    push: 0,
                    cancelled: 0,
                    pending:0,
                    total: picks.length,
                    units: 0,
                    avgOdds: 0,
                    totalOdds: 0,
                    winPercentage: 0,
                    roi: 0,
                    profit:0,
                    color: color
                };

                if(color2){
                    results.color2 = color2;
                }

                for(var i= 0; i<picks.length;i++){
                    if(picks[i].result.toLowerCase() === 'half-loss'){
                        results.loss++;
                    } else if(picks[i].result.toLowerCase() === 'half-win'){
                        results.win++;
                    } else {
                        results[picks[i].result.toLowerCase()]++;
                    }

                    results.units += picks[i].units;
                    results.totalOdds += picks[i].odds;
                    results.profit += picks[i].profit;
                }

                results.avgOdds = results.totalOdds/results.total;
                results.roi = (results.profit/results.units)*100;
                results.winPercentage = (results.win/results.total)*100;
            }
            return results;
        };

        var getUnique = function(array, field){
            var unique = $filter('unique')(array, field);
            unique = $filter('map')(unique, field);
            unique = $filter('remove')(unique, undefined);
            return unique;
        };

        var getSummaryStats = function(picks, field){

            var unique = getUnique(picks, field);
            var stats = [];
            var colorIndex = 0;

            for (var i=0; i<unique.length;i++){

                var property = field;
                var value = unique[i];

                //Update property and value if name is included
                if(unique[i] && typeof unique[i] === 'object'  && 'name' in unique[i]){
                    property = property +'.name';
                    value = value.name;
                }

                //get colours for the current category
                var color;
                var color2;
                if(unique[i] && field === 'contestant.ref' && 'darkColor' in unique[i]){
                    color = unique[i].lightColor;
                    color2 = unique[i].darkColor;
                } else if(unique[i] && typeof unique[i] === 'object' && 'name' in unique[i]) {
                    if(unique[i].name.toLowerCase() in colors){
                        color = colors[unique[i].name.toLowerCase()];
                    } else {
                        color = colorList[colorIndex];
                        colorIndex++;
                    }
                } else if(value in colors){
                    color = colors[value];
                } else {
                    color = colorList[colorIndex];
                    colorIndex++;
                }

                if(colorIndex > 11){
                    colorIndex = 0;
                }

                //Get results for the current category
                var results = groupResult(unique[i], property, value, picks, color, color2);
                if(results){
                    stats.push(results);
                }
            }

            stats = $filter('orderBy')(stats, 'profit', true);
            return stats;
        };

        /**
         * Chart Defaults
         */

        var areaChartDefaults = {
            type: 'AreaChart',
            displayed: true,
            data: {
                cols: [
                    {id: 'date', label:'Date', type:'date', p:{}}
                ],
                rows: []
            },
            options: {
                curveType: 'function',
                isStacked: 'true',
                fill: 20,
                displayExactValues: true,
                legend:null,
                vAxis: {
                    title: 'Profit (Units)',
                    gridlines: {
                        count: -1,
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    gridlines:{
                        count:-1,
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    slantedText: false,
                    baselineColor: '#dfe5e9',
                    format:'MMM d, y',
                    textStyle:{ fontSize:12}
                },
                animation: {
                    duration: 500,
                    startup:true
                },
                chartArea:{
                    left:50,
                    top:10,
                    height:'80%',
                    width:'100%',
                    backgroundColor: {
                        stroke:'#dfe5e9',
                        strokeWidth:1
                    }
                },
                colors:['#054481'],
                explorer:{
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                fontName: 'Lato'
            },
            formatters: {}

        };

        var columnChartDefaults = {
            type: 'ColumnChart',
            displayed: true,
            data: {
                cols: [],
                rows: []
            },
            options: {
                fontName: 'Lato',
                displayExactValues: true,
                bars: 'horizontal',
                vAxis: {
                    title: 'Profit (Units)',
                    gridlines: {
                        color:'transparent',
                        count:-1
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    gridlines:{
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12},
                    textPosition: 'none'
                },
                animation: {
                    duration: 1000,
                    startup:true
                },
                chartArea:{
                    left:50,
                    top:10,
                    height:'80%',
                    width:'100%',
                    backgroundColor: {
                        stroke:'#dfe5e9',
                        strokeWidth:1
                    }
                },
                colors: []

            },
            formatters: {}
        };

        var donutChartDefaults = {
            type: 'PieChart',
            displayed: true,
            data: {
                cols: [

                ],
                rows: [

                ]
            },
            options: {
                fontName: 'Lato',
                displayExactValues: true,
                pieHole: 0.4,
                vAxis: {
                    title: 'Profit (Units)',
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    titleTextStyle: {italic: false, fontSize:12},
                    slantedText: false,
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                animation: {
                    duration: 1000,
                    startup:true
                },
                chartArea:{
                    bottom:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:'90%',
                    backgroundColor: {
                        stroke:'#dfe5e9',
                        strokeWidth:1
                    }
                },
                legend: 'none',
                colors: []
            },
            formatters: {}
        };

        /**
         * Initialize Charts
         */

        var getAreaChart = function(picks, category, duration){
            //Get chart defaults
            var chart = angular.copy(areaChartDefaults);
            chart.data.cols.push({id: category.field, label: category.label, type: 'number', p: {}});

            //initialize variables
            var totalValue = 0;
            var durationValue = 0;
            var lastCompareDate = new Date();
            var values = [];

            picks = $filter('orderBy')(picks, 'event.startTime');

            //Loop through each pick
            for(var i=0; i<picks.length; i++){

                //check to see how to group values based on day, week, or month
                var currentStartTime = new Date(picks[i].event.startTime);
                var compareDate;
                switch (duration){
                    case 'Day':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        break;
                    case 'Week':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        compareDate.setDate(compareDate.getDate() - compareDate.getDay()+1);
                        break;
                    case 'Month':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), 1, 0, 0, 0, 0, 0);
                        break;
                }

                if(compareDate.toString() !== lastCompareDate.toString()){
                    totalValue += durationValue;
                    values.push({c:[{v:compareDate}, {v:parseFloat(totalValue.toFixed(2))}]});
                    durationValue = 0;
                    durationValue += picks[i][category.field];
                } else {
                    durationValue += picks[i][category.field];
                }
                lastCompareDate = compareDate;
            }

            //Add last value
            if(values.length){
                values[values.length - 1].c[1].v = values[values.length - 1].c[1].v + durationValue;
            }

            chart.data.rows = values;
            return chart;
        };

        var getColumnChart = function(statSummary, category){
            var chart = angular.copy(columnChartDefaults);
            chart.data.cols = [
                {id: category, label:category, type:'string'},
                {id: 'profit', label:'profit', type:'number'},
                {role: 'style', type:'string'}
            ];

            for(var i=0; i<statSummary.length; i++){
                chart.data.rows.push(
                    {c:[{v:statSummary[i].category},{v:parseFloat(statSummary[i].profit.toFixed(2))}]}
                );
                var style = '';
                if(statSummary[i].color){
                    style = 'fill-color:'+statSummary[i].color;
                    if(statSummary[i].color2){
                        style += ';stroke-color:'+statSummary[i].color2+'; stroke-width: 2; ';
                    }
                }

                chart.data.rows[i].c.push({v:style});
            }

            //if no colours than delete color field
            if(chart.options.colors.length === 0){
                delete chart.options.colors;
            }
            return chart;

        };

        var getPieChart = function(statSummary, category, value){

            //Get chart defaults
            var chart = angular.copy(donutChartDefaults);

            chart.data.cols.push({id: category, label:category, type:'string', p:{}});
            chart.data.cols.push({id: value.field, label:value.label, type:'number', p:{}});

            //Loop through each start summary
            for(var i=0; i<statSummary.length; i++){

                //add rows
                chart.data.rows.push({
                    c: [ { v: statSummary[i].category }, { v:  statSummary[i][value.field] } ]
                });

                //add colors
                if(statSummary[i].color){
                    chart.options.colors.push(statSummary[i].color);
                }
            }

            //If no colours exist than delete color field
            if(chart.options.colors.length === 0){
                delete chart.options.colors;
            }
            return chart;
        };

        /**
         * OVERVIEW TAB
         */

        $scope.overviewFilter = 'Day';

        $scope.updateOverview = function(overviewFilter){

            //Update overview filter
            $scope.overviewFilter = overviewFilter;
            $scope.overviewStats = [];
            var lastStartDate = new Date();
            var index = -1;

            //loop through picks
            for(var i=0; i<$scope.picks.length;i++) {

                //Get compare date
                var currentStartTime = new Date($scope.picks[i].event.startTime);
                var compareDate;
                switch ($scope.overviewFilter) {
                    case 'Day':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        break;
                    case 'Week':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        compareDate.setDate(compareDate.getDate() - compareDate.getDay() + 1);
                        break;
                    case 'Month':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), 1, 0, 0, 0, 0, 0);
                        break;
                }

                if (Date.UTC(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate()) < Date.UTC(lastStartDate.getFullYear(), lastStartDate.getMonth(), lastStartDate.getDate(), lastStartDate.getHours())) {
                    if (index !== -1) {
                        $scope.overviewStats[index].avgOdds = $scope.overviewStats[index].totalOdds / $scope.overviewStats[index].total;
                        $scope.overviewStats[index].roi = ($scope.overviewStats[index].profit / $scope.overviewStats[index].units) * 100;
                        $scope.overviewStats[index].winPercentage = ($scope.overviewStats[index].win / $scope.overviewStats[index].total) * 100;
                    }

                    var results = {
                        category: compareDate,
                        win: 0,
                        loss: 0,
                        push: 0,
                        cancelled: 0,
                        pending: 0,
                        total: 0,
                        units: 0,
                        avgOdds: 0,
                        totalOdds: 0,
                        winPercentage: 0,
                        roi: 0,
                        profit: 0
                    };

                    index++;
                    if (index === 10) {
                        break;
                    }
                    $scope.overviewStats.push(results);
                }

                $scope.overviewStats[index][$scope.picks[i].result.toLowerCase()]++;
                $scope.overviewStats[index].total++;
                $scope.overviewStats[index].units += $scope.picks[i].units;
                $scope.overviewStats[index].totalOdds += $scope.picks[i].odds;
                $scope.overviewStats[index].profit += $scope.picks[i].profit;

                lastStartDate = compareDate;
            }

            if(index < 10){
                $scope.overviewStats[index].avgOdds = $scope.overviewStats[index].totalOdds/$scope.overviewStats[index].total;
                $scope.overviewStats[index].roi = ($scope.overviewStats[index].profit/$scope.overviewStats[index].total)*100;
                $scope.overviewStats[index].winPercentage = ($scope.overviewStats[index].win/$scope.overviewStats[index].total)*100;
            }

        };

        $scope.updateProfitAreaChart = function(overviewFilter){
            $scope.profitAreaChart = getAreaChart($scope.picks, {label:'Units Wagered',field:'profit'}, overviewFilter);
        };

        /**
         * SPORT TAB
         */


        $scope.selectedSport = null;
        $scope.updateLeagueStats = function(sport){
            $scope.selectedSport = sport;
            var picks = $filter('filter')($scope.picks, function(pick){
                return pick.event.sport.name === sport;
            });
            $scope.showLeagueChart = false;
            $scope.leagueStats = getSummaryStats(picks, 'event.league');
            $scope.teamStats = [];

            if(sport !== 'Soccer' && sport !== 'E Sports' && sport !== 'Tennis'){
                $scope.showLeagueChart = true;
                $scope.leagueWageredPieChart = getPieChart($scope.leagueStats, 'League', {label:'Units Wagered',field:'units'});
            } else {
                $scope.showLeagueChart = false;
                $scope.leagueWageredPieChart = null;
                $scope.leagueProfitLineChart = null;
            }
        };

        $scope.selectedLeague = null;
        $scope.updateTeamStats = function(league){
            $scope.selectedLeague = league;
            var picks = $filter('filter')($scope.picks, function(pick){
                return pick.event.league.name === league;
            });
            $scope.teamStats = getSummaryStats(picks, 'contestant.name');
        };


        /**
         * General
         */







    }
]);

'use strict';

angular.module('fu').controller('PurchaseSuccessController', ['$scope', '$timeout', '$stateParams', '$state', '$location',
    function($scope, $timeout, $stateParams, $state, $location) {

        $scope.redirectUrl = $stateParams.redirect;

        $scope.counter = 10;
        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.redirectUrl){
                    $location.url($scope.redirectUrl);
                } else{
                    $state.go('hub');
                }
            }
            $scope.myTimeout = $timeout($scope.onTimeout,1000);
        };
        $scope.myTimeout = $timeout($scope.onTimeout,1000);

        $scope.stop = function(){
            $timeout.cancel($scope.myTimeout);
        };

    }
]);
'use strict';

angular.module('fu').controller('ModalShareController', ['$scope', 'type', 'pick', 'event',
    function($scope, type, pick, event) {
        $scope.type = type;
        $scope.pick = pick;
        $scope.event = event;
    }
]);
'use strict';

angular.module('fu').controller('SignUpSucesssController', ['$scope', '$state', '$stateParams', '$timeout', '$location',
    function($scope, $state, $stateParams, $timeout, $location) {

        $scope.counter = 10;
        $scope.redirectUrl = $stateParams.redirect;


        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.redirectUrl) {
                    $location.url($scope.redirectUrl);
                } else {
                    $state.go('hub');
                }
            }
            $scope.myTimeout = $timeout($scope.onTimeout,1000);
        };
        $scope.myTimeout = $timeout($scope.onTimeout,1000);

        $scope.stop = function(){
            $timeout.cancel($scope.myTimeout);
        };
    }
]);


'use strict';

angular.module('fu').controller('ModalSplashVideoController', ['$scope', '$modalInstance', 'Modal',
    function($scope, $modalInstance, Modal) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
    }
]);


'use strict';

angular.module('core').controller('SplashController', ['$scope', 'Modal', '$state', 'Authentication', 'Page', 'Mixpanel', 'Leaderboard',
    function($scope, Modal, $state, Authentication, Page, Mixpanel, Leaderboard) {
        $scope.authentication = Authentication;
        if($scope.authentication.user) $state.go('hub');

        $scope.page = Page;
        $scope.mixpanel = Mixpanel;


        $scope.showVideoModal = function(){
                Modal.showModal(
                '/modules/fu/client/views/splash/modal/modal-splash-video.client.view.html',
                'ModalSplashVideoController',
                {},
                'splash-video'
            );
        };


        $scope.query = {
            sportId:        'all',
            leagueId:       'all',
            contestantId:   'all',
            homeAway:       'both',
            betDuration:    'all',
            betType:        'all',
            minBets:        'all',
            dateId:         'last30Days',
            count:          5
        };

        function cb(err, leaderboard){
            $scope.leaderboard = leaderboard;
        }

        Leaderboard.getLeaderboard($scope.query, cb);

    }
]);
'use strict';

angular.module('fu').controller('StaticController', ['$scope', '$location', '$anchorScroll', '$state', 'Authentication', 'Page',
    function($scope, $location, $anchorScroll, $state, Authentication, Page) {

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                Page.meta.title = $state.current.title;
                Page.meta.description = $state.current.description;
                Page.meta.keywords = $state.current.keywords;
            }
        });

        // Scroll to Div
        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        //Accordion
        $scope.oneAtATime = false;

        $scope.opened = false;

        $scope.isCollapsed = false;
    }
]);


'use strict';

angular.module('fu').controller('PressController', ['$scope',
    function($scope) {

        $scope.press = [
            { show:false },
            { show:false },
            { show:false },
            { show:false },
            { show:false },
            { show:false }
        ];
    }
]);
'use strict';

angular.module('core').controller('ProController', ['$scope', '$state', '$anchorScroll', '$location', 'Page', 'StripeService', 'Authentication', 'Mixpanel', 'User',
    function($scope, $state, $anchorScroll, $location, Page, StripeService, Authentication, Mixpanel, User) {

        $anchorScroll();

        $scope.stripeService = StripeService;
        $scope.page = Page;
        $scope.mixpanel = Mixpanel;
        $scope.user = User;
        $scope.authentication = Authentication;


        $scope.newSubscription = function(plan){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else {
                    switch(plan){
                        case 'base':
                            $state.go('basePurchaseSuccess');
                            break;
                        case 'premium-1':
                            $state.go('proPurchaseSuccess');
                            break;
                        case 'premium-6':
                            $state.go('6monthProPurchaseSuccess');
                            break;
                    }
                }
            }


            if(Authentication.user){
                switch (plan){
                    case 'base':
                        $scope.stripeService.newBaseSubscription(cb);
                        break;
                    case 'premium-1':
                        $scope.stripeService.newPremium1Subscription(cb);
                        break;
                    case 'premium-6':
                        $scope.stripeService.newPremium6Subscription(cb);
                        break;
                }
            } else {
                $state.go('signup');
            }
        };


        $scope.changeSubscription = function(plan){
            function cb(err){
                if(!err) $scope.success = 'Updated Subscription';
                console.log(err);
            }

            $scope.stripeService.changeSubscription(plan, cb);
        };


        $scope.gotoAnchor = function() {
            var newHash = 'go-pro-now';
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash('go-pro-now');
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        };

        $scope.authentication = Authentication;

    }
]);
'use strict';

angular.module('core').controller('SportsbookController', ['$scope', '$stateParams', '$filter', '$state', 'Page', 'Location', 'SportsbookService',
    function($scope, $stateParams, $filter,  $state, Page, Location, SportsbookService) {

        $scope.sportsbookName = $stateParams.name;

        if($scope.sportsbookName){
            //If sportsbook name, Review Page
            $scope.sportsbook = SportsbookService.getSportsbook($scope.sportsbookName.replace('-',' '));
            Page.meta.title = $scope.sportsbookName.replace('-', ' ')+' Review | FansUnite' ;
            Page.meta.description = 'Unbiased review of '+ $scope.sportsbookName.replace('-', ' ')+' from FansUnite.';
            Page.meta.keywords = $scope.sportsbookName+' review, '+$scope.sportsbookName+' betting offers, '+$scope.sportsbookName+' free bets';

            if(!$scope.sportsbook){
                $state.go('404');
            }
        } else {
            //No sportsbook name, top 10 page
            SportsbookService.getSportsbooks(function(sportsbooks){
                $scope.sportsbooks = sportsbooks;
            });
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            Page.meta.title = $scope.sportsbookName.replace('-', ' ')+' Review | FansUnite';
            Page.meta.description = $scope.sportsbookName.replace('-', ' ')+' review from FansUnite.';
            Page.meta.keywords = $scope.sportsbookName+' review, '+$scope.sportsbookName+' betting offers, '+$scope.sportsbookName+' free bets';

        });

        $scope.location = Location;

    }
]);
'use strict';

angular.module('fu').controller('ModalSubscriptionController', ['$scope', '$modalInstance', '$state', 'Modal', 'StripeService', 'Authentication', '$location', 'User',
    function($scope, $modalInstance, $state, Modal, StripeService, Authentication, $location, User) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.stripeService = StripeService;
        $scope.authentication = Authentication;
        $scope.modal.closeModal($scope.modalInstance);
        $scope.location = $location;
        $scope.user = User;

        $scope.newSubscription = function(plan){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.modal.closeModal($scope.modalInstance);
                    switch(plan){
                        case 'base':
                            $state.go('basePurchaseSuccess', {redirect:$scope.location.path()});
                            break;
                        case 'premium-1':
                            $state.go('proPurchaseSuccess', {redirect:$scope.location.path()});
                            break;
                        case 'premium-6':
                            $state.go('6monthProPurchaseSuccess', {redirect:$scope.location.path()});
                            break;
                    }
                }
            }

            if(Authentication.user){
                switch (plan){
                    case 'base':
                        $scope.stripeService.newBaseSubscription(cb);
                        break;
                    case 'premium-1':
                        $scope.stripeService.newPremium1Subscription(cb);
                        break;
                    case 'premium-6':
                        $scope.stripeService.newPremium6Subscription(cb);
                        break;
                }
            } else {
                $state.go('signup');
            }
        };

        $scope.changeSubscription = function(plan){
            function cb(err){
                if(!err) $scope.success = 'Thank you for updating your subscription to '+ plan;
                if(err) $scope.error = err;
            }

            $scope.stripeService.changeSubscription(plan, cb);
        };

        $scope.close = function(){
            $modalInstance.dismiss();
        };
    }
]);
'use strict';

angular.module('fu').controller('TopMenuController', ['$scope', '$state', 'Authentication', 'Search', '$http', '$rootScope', '$location', 'Modal', 'User',
    function ($scope, $state, Authentication, Search, $http, $rootScope, $location, Modal, User) {
        $scope.authentication = Authentication;
        $scope.state = $state;
        $scope.location = $location;
        $scope.user = User;
        $scope.searchLoading = false;

        $scope.getResults = function() {
            return $http.get('/api/search', {
                params: {
                    text: $scope.searchText
                }
            }).then(function(response){
                return response.data;
            });
        };

        var excludeRedirect = ['/login', '/', '/blog'];
        $scope.signupUrl = function(){
            if(excludeRedirect.indexOf($scope.location.path()) !== -1) return '/signup';
            return '/signup?redirect='+$scope.location.path();
        };

        $scope.toggleSideMenu = function(){
            $rootScope.$emit('toggleSideMenu');
        };

        $scope.searchSelected = function($model){
            $scope.searchText = '';
            switch($model.type){
                case 'event':
                    $state.go('gamecenter', {eventSlug: $model.slug, leagueSlug: $model.leagueSlug});
                    break;
                case 'channel':
                    $state.go('channel.main.home', {channelSlug: $model.slug});
                    break;
                case 'user':
                    $state.go('profile', {username: $model.name});
                    break;
            }
        };


        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        $scope.showTrialModal = function(){
            Modal.showModal(
                'modules/fu/client/views/trial/modal/modal-trial.client.view.html',
                'ModalTrialController',
                null,
                'trial'
            );
        };

    }
]);

'use strict';

angular.module('fu').controller('ChartModalController', ['$scope','$modalInstance', 'picks', 'statSummary', 'field', 'title',
    function($scope, $modalInstance, picks, statSummary, field, title) {
        $scope.picks = picks;
        $scope.statSummary = statSummary;
        $scope.field = field;
        $scope.title = title;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);
'use strict';

angular.module('fu').controller('ModalTrialController', ['$scope', '$modalInstance', '$state', 'Modal', 'Trial', 'Authentication', 'User', '$location',
    function($scope, $modalInstance, $state, Modal, Trial, Authentication, User, $location) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        $scope.authentication = Authentication;
        $scope.user = User;

        $scope.activateTrial = function(){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.modal.closeModal($scope.modalInstance);
                    $state.go('trialSuccess', {redirect: $location.path()});
                }
            }

            Trial.activate(cb);
        };

    }
]);
'use strict';

angular.module('fu').controller('LoginController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);

'use strict';

angular.module('fu').controller('ModalMyPicksController', ['$scope', '$modalInstance', 'Modal', 'User', 'Authentication',
    function ($scope, $modalInstance, Modal, User, Authentication) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        $scope.show = 'pending';
        $scope.user = User;
        $scope.completedPicks = [];
        $scope.pendingPicks = [];
        $scope.page = 1;
        $scope.authentication = Authentication;

        function getCompletedPicks(){
            function cb(err, picks){
                if(!err) $scope.completedPicks = picks;
            }
            User.getCompletedPicks($scope.page , cb);
        }


        function getPendingPicks(){
            function cb(err, picks){
                console.log(picks);
                if(!err) $scope.pendingPicks = picks;
            }
            User.getPendingPicks(cb);
        }

        getPendingPicks();

        $scope.updateShow = function(type){
            $scope.show = type;
            if(type === 'completed') getCompletedPicks();
            if(type === 'pending') getPendingPicks();
        };


    }
]);

'use strict';

angular.module('fu').controller('SettingsController', ['$scope', '$http', '$location', '$state', 'Users', 'Authentication', 'Sports', 'StripeService', 'Page', 'Modal', 'User', 'ApiUsers',
    function($scope, $http, $location, $state, Users, Authentication, Sports, StripeService, Page, Modal, User, ApiUsers) {
        $scope.authentication = Authentication;
        $scope.stripe = StripeService;
        $scope.user = User;
        Page.meta.title = $scope.authentication.user.username+' Settings | FansUnite';
        Page.meta.description = $scope.authentication.user.username+' settings.';

        if (!$scope.authentication.user) $state.go('home');

        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.authentication.user.additionalProvidersData) {
                return true;
            }
            return false;
        };

        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
        };

        $scope.removeUserSocialAccount = function(provider) {
            $scope.success = $scope.error = null;

            $http.delete('/api/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.authentication.user = Authentication.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.updateUserProfile = function() {
            $scope.success = $scope.error = null;
            delete $scope.authentication.user.profileUrl; // controlled by upload-image-url directive
            delete $scope.authentication.user.avatarUrl; // controlled by upload-image-url directive
            var user = new ApiUsers($scope.authentication.user);

            user.$update(function(response) {
                $scope.success = 'Profile Saved Successfully';
                Authentication.user = response;
            }, function(response) {
                $scope.error = response.data.message;
            });
        };

        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = 'Profile Saved Successfully';
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.newSubscription = function(){
            Modal.showModal('/modules/core/views/subscription-modal.client.view.html', 'SubscriptionModalController', null);

        };

        $scope.cancelSubscription = function(){
            $scope.stripe.cancelSubscription(function(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.success = 'Your subscription has been cancelled.';
                }
            });
        };

        $scope.resumeSubscription = function(){
            $scope.stripe.resumeSubscription(function(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.success = 'Your subscription has been renewed.';
                }
            });
        };


        $scope.oddsFormats = ['Decimal', 'American', 'Fractional'];
        Sports.getAll(function(err, sports){
            $scope.sports = sports;
        });
        $scope.profileImage = '../../modules/users/img/signup/profile.png';


        /**
         * Notifications
         */

        function cb(err, followingSettings){
            console.log(followingSettings);
            if(!err) $scope.followingSettings = followingSettings;
        }

        User.getFollowingSettings(cb);


        $scope.toggleFollowingSettings = function(followingSettings){
            followingSettings.$update();
        };

    }
]);
'use strict';

angular.module('fu').controller('SignupController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;


    }
]);

'use strict';

angular.module('fu').controller('VerifyEmailController', ['$scope', '$timeout', 'Page', 'Mixpanel', '$stateParams', '$state',
    function($scope,  $timeout, Page,  Mixpanel, $stateParams, $state) {

        $scope.mixpanel = Mixpanel;
        $scope.page = Page;
        $scope.mixpanel.accountVerified();

        if($stateParams.username){
            $scope.username = $stateParams.username;
        }

        $scope.counter = 5;
        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.username){
                    $state.go('profile',{username:$scope.username});
                } else{
                    $state.go('hub');
                }
            }
            $scope.myTimeout = $timeout($scope.onTimeout,1000);
        };
        $scope.myTimeout = $timeout($scope.onTimeout,1000);

        $scope.stop = function(){
            $timeout.cancel($scope.myTimeout);
        };

    }
]);
'use strict';

angular.module('fu.admin').directive('adminBoolean', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.boolean.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminDate', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.date.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminDatetime', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.datetime.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminNumber', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.number.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminSelect', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            options: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.select.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminSelectRef', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            options: '=',
            displayField: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.select.ref.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminString', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.string.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminSubmit', function () {
    return {
        restrict: 'E',
        scope: {
            error: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.submit.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminTextbox', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.textbox.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminTime', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.time.client.template.html'
    };
});
'use strict';

angular.module('fu.admin').directive('adminListBoolean', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/list/admin.list.boolean.client.template.html'
    };
});
'use strict';

angular.module('fu').directive('adminScoresTable', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            events:'=',
            sport: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;
            switch($scope.sport.name){
                case 'basketball':
                    directive = '<bet-moneyline bets="bets"></bet-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-spread bets="bets"></bet-spread>';
                    break;
                case 'points':
                    directive = '<bet-points bets="bets"></bet-points>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);


        }]
    };
}]);

'use strict';

angular.module('fu').directive('btnComment', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-comment.client.template.html',
        controller: ['$scope', 'Modal', function ($scope, Modal) {
            $scope.showCommentModal = function () {
                Modal.showModal(
                    '/modules/fu/client/views/pick/modal/modal-pick-comment.client.view.html',
                    'ModalPickCommentController', {
                        pick: function () {
                            return $scope.pick;
                        }
                    },
                    'pick-comment'
                );
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('btnFacebookLike', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-facebook-like.client.template.html'
    };
});
'use strict';

angular.module('fu').directive('btnFollowRect', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow-rect.client.template.html',
        controller: ['$scope', 'User', '$filter', 'Follow', 'Authentication', '$state', function($scope, User, $filter, Follow, Authentication, $state){
            var following = User.info.following;
            $scope.authentication = Authentication;

            $scope.isFollowing = function(){
                var found = $filter('filter')(following, {_id: $scope.userId});
                return found.length > 0;
            };

            $scope.text = function(){
                if($scope.isFollowing()){
                    return '- Unfollow';
                } else {
                    return '+ Follow';
                }
            };

            $scope.toggleFollow = function(){
                if(!$scope.authentication.user) {
                    $state.go('signup');
                } else {
                    if($scope.isFollowing()){
                        Follow.unfollow($scope.userId);
                    } else {
                        Follow.follow($scope.userId);
                    }
                }
            };
        }]
    };
});

'use strict';

angular.module('fu').directive('btnFollow', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow.client.template.html',
        controller: ['$scope', 'User', '$filter', 'Follow', 'Authentication', '$state', function($scope, User, $filter, Follow, Authentication, $state){
            var following = User.info.following;
            $scope.authentication = Authentication;

            $scope.isFollowing = function(){
                var found = $filter('filter')(following, {_id: $scope.userId});
                return found.length > 0;
            };


            $scope.imgUrl = function(){
                if($scope.isFollowing()){
                    return 'modules/fu/client/img/buttons/follow/following.png';
                } else {
                    return 'modules/fu/client/img/buttons/follow/follow.png';
                }
            };

            $scope.toggleFollow = function(){
                if(!$scope.authentication.user) {
                    $state.go('signup');
                } else {
                    if($scope.isFollowing()){
                        Follow.unfollow($scope.userId);
                    } else {
                        Follow.follow($scope.userId);
                    }
                }
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('btnMessage', function () {
    return {
        restrict: 'E',
        scope: {
            username:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-message.client.template.html',
        controller: ['$scope', '$state', 'Authentication', function($scope, $state ,Authentication){
            $scope.authentication = Authentication;
            $scope.buttonClicked = function(){
                if(!$scope.authentication.user) {
                    $state.go('signup');
                } else {
                    $state.go('messages.newWithUser', {username:$scope.username});
                }
            };
        }]
    };
});

'use strict';

angular.module('fu').directive('btnPendingPicks', function () {
    return {
        restrict: 'E',
        scope: {
            username:'=',
            pickCount: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-pending-picks.client.template.html'
    };
});
'use strict';

angular.module('fu').directive('btnShare', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-share.client.template.html',
        controller: ['$scope', 'Modal', function ($scope, Modal) {
            $scope.sharePick = function() {
                Modal.showModal(
                    '/modules/fu/client/views/share/modal/modal-share.client.view.html',
                    'ModalShareController', {
                        type: function () {
                            return 'pick';
                        },
                        pick: function () {
                            return $scope.pick;
                        },
                        event: function () {
                            return $scope.event;
                        }
                    }, 'share');
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('btnSubscribe', function () {
    return {
        restrict: 'E',
        scope: {
            channelId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-subscribe.client.template.html',
        controller: ['$scope', '$state', '$filter', 'User', 'Channels', 'Authentication', function($scope, $state, $filter, User, Channels, Authentication){
            var channels = User.info.channels;
            $scope.authentication = Authentication;

            $scope.isSubscribed = function(){
                var found = $filter('filter')(channels, {_id: $scope.channelId });
                return found.length > 0;
            };


            $scope.text = function(){
                if($scope.isSubscribed()){
                    return '- Unsubscribe';
                } else {
                    return '+ Subscribe';
                }
            };

            $scope.toggleSubscribe = function(){
                if(!$scope.authentication.user) $state.go('signup');
                if($scope.isSubscribed()){
                    Channels.unsubscribe($scope.channelId);
                } else {
                    Channels.subscribe($scope.channelId);
                }
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('btnTracker', function () {
    return {
        restrict: 'E',
        scope: {
            username:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-tracker.client.template.html'
    };
});
'use strict';

angular.module('fu').directive('btnTwitterFollow', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-twitter-follow.client.template.html'
    };
});
'use strict';

angular.module('fu').directive('btnUpgrade', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'modules/fu/client/templates/buttons/btn-upgrade.client.template.html',
        controller: ['$scope', '$filter', 'StripeService', function($scope, $filter, StripeService){
            $scope.showSubscriptionModal = function(){
                StripeService.showSubscriptionModal();
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('areaChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            height: '='
        },
        templateUrl: 'modules/fu/client/templates/charts/area-chart.client.template.html',
        controller: ['$scope', 'Charts', function ($scope, Charts){
            $scope.chart = Charts.createChart('area', $scope.data);
        }]
    };
});
'use strict';

angular.module('fu').directive('chat', function() {
    return {
        restrict: 'E',
        scope: {
            socket: '=',
            messages: '=',
            channel: '='
        },
        templateUrl: 'modules/fu/client/templates/chat/chat.client.template.html',
        controller: ['$scope', 'Authentication', function($scope, Authentication) {
            
            $scope.authentication = Authentication;
            $scope.showFullChat = false;

            $scope.sendMessage = function () {
                var chat = {
                    message: this.text,
                    user: {name: $scope.authentication.user.username, ref: $scope.authentication.user._id}
                };
                if($scope.channel) chat.channel = {name: $scope.channel.name, ref: $scope.channel._id};
                $scope.socket.emit('new message', chat);
                this.text = '';


            };

            $scope.socket.on('new message', function(messages){
                $scope.messages = $scope.messages.concat(messages);
            });

            $scope.goToBottom = function() {
                 var chatBox = document.getElementById('chat-box');
                 chatBox.scrollTop = 99999;
            };


            $scope.$on('$destroy', function () {
                $scope.socket.removeListener('chatMessage');
            });

        }]
    };
});

'use strict';

angular.module('fu').directive('commentForm', function() {
    return {
        restrict: 'E',
        scope: {
            text: '=',
            pick: '=',
            event: '=',
            comment: '=',
            replyIndex: '=',
            showReply: '=',
            reply: '=',
            comments: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/comment-form.client.template.html',
        controller: ['$scope', 'Events', 'Picks', function($scope, Events, Picks) {
            $scope.toolbarOptions = [
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage','insertLink', 'insertVideo']
            ];

            function newPickComment(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.comments.push(comment);
                }

                Picks.newComment($scope.pick, $scope.text, cb);
            }

            function newEventComment(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.comments.push(comment);
                }

                Events.newComment($scope.event, $scope.text, cb);
            }

            function pickCommentReply(){
                function cb(err, comment){
                    console.log(comment);
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.reply.replies.push(comment.reply);
                    $scope.comment = comment.comment;
                }
                Picks.commentReply($scope.pick, $scope.comment, $scope.replyIndex, $scope.reply.user, $scope.text, cb);
            }

            function eventCommentReply(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.reply.replies.push(comment.reply);
                    $scope.comment = comment.comment;
                }
                Events.commentReply($scope.event, $scope.comment, $scope.replyIndex, $scope.reply.user, $scope.text, cb);
            }

            $scope.submit = function(){
                $scope.error = null;
                if($scope.text === '' || !$scope.text) {
                    $scope.error = 'Nothing to comment' ;
                    return;
                }
                if($scope.pick){
                    if($scope.comment){
                        pickCommentReply();
                    } else {
                        newPickComment();
                    }
                } else if($scope.event){
                    if($scope.comment){
                        eventCommentReply();
                    } else {
                        newEventComment();
                    }
                }
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('comments', function() {
    return {
        restrict: 'E',
        scope: {
            comments: '=',
            pick: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/comments.client.template.html',
        controller: ['$scope', 'Authentication',  function($scope, Authentication) {

            $scope.authentication = Authentication;
            $scope.newComment = '';
            $scope.showReply = false;

            $scope.toggleReply = function(){
                $scope.showReply = !$scope.showReply;
            };

            /*
            //Join Room
            CommentSocket.emit('join discussion', $scope.discussionId);

            //Get all comments
            Comments.query({discussionId: $scope.discussionId}, function(comments){
                $scope.comments = comments;
            });

            $scope.newPost = function(){
                if($scope.text){
                    var comment = {discussion: $scope.discussionId, user:{name: $scope.authentication.user.username, ref: $scope.authentication.user._id}, text: $scope.text, users: [$scope.authentication.user._id]};
                    var newPost = {type: $scope.type, comment:comment};
                    CommentSocket.emit('new post', newPost);
                    $scope.text = '';
                }
            };

            $scope.commentReply = function(comment, text){
                if(text){
                    var parentComment = {user: comment.user, text: comment.text};
                    var newComment = {user:{name: $scope.authentication.user.username, ref: $scope.authentication.user._id}, text: text};
                    var commentReply = {path:[], commentId: comment._id, comment: newComment, parentComment: parentComment, discussionId: $scope.discussionId, type:$scope.type};

                    CommentSocket.emit('comment reply', commentReply);
                    $scope.text = '';
                }
            };

            CommentSocket.on('new post', function(newPost){
                $scope.comments.unshift(newPost);
            });

            CommentSocket.on('new reply', function(comment){
                for(var i=0; i<$scope.comments.length; i++){
                    if(comment._id === $scope.comments[i]._id){
                        $scope.comments[i] = comment;
                    }
                }
            });
            */
        }]
    };
});

'use strict';

angular.module('fu').directive('discussionPreview', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {

            var directive;

            if($scope.preview.pick){
                directive = '<discussion-preview-pick preview="preview"></discussion-preview-pick>';
            } else if($scope.preview.event){

                directive = '<discussion-preview-event preview="preview"></discussion-preview-event>';
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
}]);

'use strict';

angular.module('core').directive('discussionPreviews', function(){
    return {
        restrict: 'E',
        scope: {
            previews: '='
        },
        templateUrl: '/modules/fu/client/templates/comments/discussion-previews.client.template.html',
        controller: ['$scope', function($scope){


        }]
    };
});



'use strict';

angular.module('fu').directive('discussionPreviewEvent', function () {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/discussion-previews/discussion-preview-event.client.template.html',
        controller: ['$scope', '$filter', '$sce', function ($scope, $filter, $sce){
            $scope.category = $scope.preview.league.name;
            $scope.eventSlug = $scope.preview.event.slug;
            $scope.leagueSlug = $scope.preview.league.slug;
            $scope.title = $filter('teamNameHeader')($scope.preview.event);
            $scope.commentCount = $scope.preview.event.commentCount;
            $scope.commentPreview = $sce.trustAsHtml($filter('limitTo')($filter('striptags')($scope.preview.text),50));
        }]
    };
});
'use strict';

angular.module('fu').directive('discussionPreviewPick', function () {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/discussion-previews/discussion-preview-pick.client.template.html',
        controller: ['$scope', '$filter', '$sce', function ($scope, $filter, $sce){
            $scope.category = $scope.preview.league.name;
            $scope.eventSlug = $scope.preview.event.slug;
            $scope.leagueSlug = $scope.preview.league.slug;
            $scope.title = $filter('betName')($scope.preview.pick, $scope.preview.event);
            $scope.commentCount = $scope.preview.pick.commentCount;
            $scope.commentPreview = $sce.trustAsHtml($filter('limitTo')($filter('striptags')($scope.preview.text),50));
        }]
    };
});
'use strict';

angular.module('fu').factory('RecursionHelper', ['$compile', function($compile){
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);
'use strict';

angular.module('fu').directive('replies', ["RecursionHelper", function(RecursionHelper) {
    return {
        restrict: 'E',
        scope: {
            replies: '=',
            event: '=',
            pick: '=',
            replyIndex: '=',
            comment: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        templateUrl: 'modules/fu/client/templates/comments/replies.client.template.html',
        controller: ['$scope', '$filter', function($scope, $filter) {

            $scope.getAvatarUrl = function(user){
                var userFound = $filter('filter')($scope.comment.users, {_id: user.ref});
                return userFound[0].avatarUrl;
            };
        }]
    };
}]);
'use strict';

angular.module('fu').directive('logo', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            contestantName: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/contestant/logo.client.template.html',
        controller: ['$scope',  function ($scope){

        }]
    };
});

'use strict';

angular.module('fu').directive('loading', function () {
    return {
        restrict: 'E',
        scope: {
            isLoading: '=',
            color: '=',
            bgColor: '=',
            size:'='
        },
        templateUrl: 'modules/fu/client/templates/general/loading.client.template.html'
    };
});
'use strict';

angular.module('core').directive('slideToggle', function() {
    return {
        restrict: 'A',
        scope:{
            isOpen: '=slideToggle'
        },
        link: function(scope, element, attr) {
            var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
            scope.$watch('isOpen', function(newVal,oldVal){
                if(newVal !== oldVal){
                    if(newVal === true){
                        element.stop().slideDown(slideDuration);
                    } else {
                        element.stop().slideUp(slideDuration);
                    }
                    //element.stop().slideToggle(slideDuration);
                }
            });
        }
    };
});
'use strict';

angular.module('core').directive('sportIcon', function(){
    return {
        restrict: 'E',
        scope: {
            url: '=',
            color: '='
        },
        templateUrl: '/modules/fu/client/templates/general/sport-icon.client.template.html',
        controller: ['$scope', function($scope){

        }]
    };
});



'use strict';

angular.module('fu').directive('youtube', ["$sce", function($sce) {
    return {
        restrict: 'EA',
        scope: { code: '='},
        replace: true,
        template: '<div><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
        link: function (scope) {
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    scope.url =$sce.trustAsResourceUrl('https://www.youtube.com/embed/' + newVal);
                }
            });
        }
    };
}]);
'use strict';

angular.module('fu').directive('betSection', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '=',
            betType: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.betType){
                case 'moneyline':
                    directive = '<bet-section-moneyline event="event" bets="bets"></bet-section-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-section-spread event="event" bets="bets"></bet-section-spread>';
                    break;
                case 'sets':
                    directive = '<bet-section-sets event="event" bets="bets"></bet-section-sets>';
                    break;
                case 'total points':
                    directive = '<bet-section-total-points event="event"  bets="bets"></bet-section-total-points>';
                    break;
                case 'team totals':
                    directive = '<bet-section-team-totals event="event" bets="bets"></bet-section-team-totals>';
                    break;
                default:
                    directive = '<bet-section-general bet-type="betType" event="event" bets="bets"></bet-section-general>';
                    break;

            }

            var el = $compile(directive)($scope);
            $element.append(el);


        }]
    };
}]);

'use strict';

angular.module('fu').directive('betSectionGeneral', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            betType: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-general.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
        }]
    };
});
'use strict';

angular.module('fu').directive('betSectionMoneyline', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-moneyline.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
            if($scope.bets && 'draw' in $scope.bets){
                $scope.isDraw = true;
            }
        }]
    };
});
'use strict';

angular.module('fu').directive('betSectionSets', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-sets.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;

        }]
    };
});
'use strict';

angular.module('fu').directive('betSectionSpread', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-spread.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;

        }]
    };
});
'use strict';

angular.module('fu').directive('betSectionTeamTotals', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-team-totals.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
        }]
    };
});
'use strict';

angular.module('fu').directive('betSectionTotalPoints', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-total-points.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;

        }]
    };
});
'use strict';

angular.module('fu').directive('bet', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '=',
            betType: '='
        },
        template: '',
        controller:  ['$scope', '$element', 'BetSlip',  function ( $scope, $element, BetSlip) {
            var directive;
            switch($scope.betType){
                case 'moneyline':
                    directive = '<bet-moneyline bets="bets"></bet-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-spread bets="bets"></bet-spread>';
                    break;
                case 'points':
                    directive = '<bet-points bets="bets"></bet-points>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

            $scope.addBet = function(bet){
                BetSlip.addRemove(bet, $scope.event);
            };

        }]
    };
}]);

'use strict';

angular.module('fu').directive('betMoneyline', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bets/bet-moneyline.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.addBet = $scope.$parent.addBet;
            if($scope.bets){
                $scope.bet = $scope.bets[0];
            }
        }]
    };
});
'use strict';

angular.module('fu').directive('betPoints', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bets/bet-points.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            $scope.addBet = $scope.$parent.addBet;
            if($scope.bets){
                $scope.activeBet = $filter('filter')($scope.bets, {active:true})[0];
                var altLines = $filter('filter')($scope.bets, {altLine:true});
                if(altLines.length){
                    $scope.isAlt = true;
                }
            }

            $scope.setActive = function(bet){
                $scope.bets[$scope.bets.indexOf($scope.activeBet)].active = false;
                bet.active = true;
                $scope.activeBet = bet;
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('betSpread', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bets/bet-spread.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            $scope.addBet = $scope.$parent.addBet;
            if($scope.bets){
                $scope.activeBet = $filter('filter')($scope.bets, {active:true})[0];
                var altLines = $filter('filter')($scope.bets, {altLine:true});
                if(altLines.length){
                    $scope.isAlt = true;
                }
            }

            $scope.setActive = function(bet){
                $scope.bets[$scope.bets.indexOf($scope.activeBet)].active = false;
                bet.active = true;
                $scope.activeBet = bet;
            };
        }]
    };
});
'use strict';

angular.module('fu').directive('makePicks', function () {
    return {
        restrict: 'E',
        scope: {
            event: '=',
            betTypes: '=',
            betDurations: '=',
            columns: '=',
            activeBetType: '=',
            activeBetDuration: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/make-picks.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1 = $scope.event.contestant1.ref;
            $scope.contestant2 = $scope.event.contestant2.ref;

            $scope.mainBets = $scope.event.bets.main;


        }]
    };
});
'use strict';

angular.module('fu').directive('notification', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        template: '',
        controller:  ['$scope', '$element', 'User',  function ( $scope, $element, User) {
            var directive;

            switch($scope.notification.type){
                case 'follow':
                    directive = '<notification-follow notification="notification"></notification-follow>';
                    break;
                case 'copy pick':
                    directive = '<notification-copy-pick notification="notification"></notification-copy-pick>';
                    break;
                case 'pick comment':
                    directive = '<notification-pick-comment notification="notification"></notification-pick-comment>';
                    break;
                case 'comment reply':
                    directive = '<notification-comment-reply notification="notification"></notification-comment-reply>';
                    break;
                case 'activity':
                    directive = '<notification-activity notification="notification"></notification-activity>';
                    break;
            }


            var el = $compile(directive)($scope);
            $element.append(el);

            $scope.readNotification = function(notification){
                function cb(err, updatedNotif){
                    if(!err) notification.new = false;
                }

                User.readNotification(notification, cb);
            };

        }]
    };
}]);

'use strict';

angular.module('fu').directive('notificationActivity', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-activity.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});
'use strict';

angular.module('fu').directive('notificationCommentReply', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-comment-reply.client.template.html',
        controller: ['$scope', function ($scope){

            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});
'use strict';

angular.module('fu').directive('notificationCopyPick', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-copy-pick.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});
'use strict';

angular.module('fu').directive('notificationFollow', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-follow.client.template.html',
        controller: ['$scope', function ($scope){

            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});
'use strict';

angular.module('fu').directive('notificationPickComment', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-pick-comment.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});
'use strict';

angular.module('fu').directive('consensusPick', function () {
    return {
        restrict: 'E',
        scope: {
            consensusPick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/consensus-pick.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('hotPick', function () {
    return {
        restrict: 'E',
        scope: {
            hotPick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/hot-pick.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            switch($scope.hotPick.pick.betType){
                case 'moneyline':
                    $scope.value = $filter('formatOdds')($scope.hotPick.pick.value);
                    break;
                case 'spread':
                    $scope.value = $filter('formatSpread')($scope.hotPick.pick.value);
                    break;
                case 'total points':
                    $scope.value = $scope.hotPick.pick.value;
                    break;
            }
        }]
    };
});
'use strict';

angular.module('fu').directive('pickRowCompleted', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-row/pick-row-completed.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('pickRowPending', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-row/pick-row-pending.client.template.html',
        controller: ['$scope', function ($scope){
            console.log($scope.pick);
        }]
    };
});
'use strict';

angular.module('fu').directive('pickTable', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            picks: '=',
            type: '='
        },
        template: '',
        controller: ['$scope', '$element', function ($scope, $element){

            var directive;

            switch($scope.type){
                case 'completed':
                    directive = '<pick-table-completed picks="picks"></pick-table-completed>';
                    break;
                case 'pending':
                    directive = '<pick-table-pending picks="picks"></pick-table-pending>';
                    break;

            }

            var el = $compile(directive)($scope);
            $element.append(el);




        }]
    };
}]);
'use strict';

angular.module('fu').directive('pickTableCompleted', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-table/pick-table-completed.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});
'use strict';

angular.module('fu').directive('pickTablePending', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-table/pick-table-pending.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});
'use strict';

angular.module('fu').directive('popularGame', function () {
    return {
        restrict: 'E',
        scope: {
            popularGame: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/popular-game.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});
'use strict';

angular.module('fu').directive('share', function(){
    return {
        restrict: 'E',
        scope: {
            type: '=',
            pick: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/share/share.client.template.html',
        controller: ['$scope','$filter', 'Authentication', '$http', function($scope, $filter, Authentication, $http){

            $scope.twitterHandle = '@FansUnite';
            $scope.shareLoading = false;

            $scope.getPickText = function(pick){

                var odds = $filter('formatOdds')(pick.odds);
                var betText;
                var result = pick.result;


                switch(pick.betType){
                    case 'spread':
                        betText = pick.contestant.name + ' ' +$filter('formatSpread')(pick.spread)+' spread';
                        break;
                    case 'moneyline':
                        betText = pick.contestant.name + ' moneyline';
                        break;
                    case 'team totals':
                        betText = pick.contestant.name + ' '+pick.overUnder+' '+$filter('formatPoints')(pick.points);
                        break;
                    case 'total points':
                        betText = pick.overUnder+' '+$filter('formatPoints')(pick.points)+' '+$scope.event.contestant1.name+'/'+$scope.event.contestant2.name;
                        break;
                    case 'sets':
                        betText = pick.contestant.name + ' '+pick.overUnder+' '+$filter('formatPoints')(pick.points)+' sets';
                        break;
                }

                var betDurationText;
                var betDurations = ['1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter'];
                if(betDurations.indexOf(pick.betDuration) !== -1){
                    betDurationText = '('+betDurations[betDurations.indexOf(pick.betDuration)]+')';
                }

                var unitText = 'unit';
                var text;

                if(result === 'Pending'){
                    if(pick.units > 1){
                        unitText = unitText+'s';
                    }
                    text = pick.units +' '+unitText+' on '+betText;
                } else if(result.indexOf('Win') !== -1){
                    if(pick.profit !== 1){
                        unitText = unitText+'s';
                    }
                    text = 'Won '+pick.profit.toFixed(2) +' '+unitText+' on '+betText;

                } else if(result.indexOf('Loss') !== -1){
                    if(pick.profit !== 1){
                        unitText = unitText+'s';
                    }
                    text = 'Loss '+Math.abs(parseInt(pick.profit)) +' '+unitText+' on '+betText;

                } else if(result === 'Push'){
                    text = 'Push on '+betText;

                } else if(result === 'Cancelled'){
                    text = 'Cancelled on '+betText;
                }

                if(betDurationText){
                    text = text +' '+betDurationText;
                }

                var url = 'https://fansunite.com/profile/'+Authentication.user.username;
                text = text +' '+ $scope.twitterHandle +' '+url;

                return text;

            };


            switch($scope.type){
                case 'pick':
                    $scope.shareText = $scope.getPickText($scope.pick);
                    break;
            }




            $scope.isAuthenticated = function(provider){
                var authenticated = false;
                if('additionalProvidersData' in Authentication.user){
                    if(provider in Authentication.user.additionalProvidersData){
                        authenticated = true;
                    }
                }
                if(Authentication.user.provider === provider){
                    authenticated = true;
                }
                return authenticated;
            };
            $scope.authentication = Authentication;

            $scope.facebookShare = false;
            $scope.twitterShare = false;
            $scope.share = function(){
                $scope.shareLoading = true;
                $scope.success = null;
                $scope.error = null;
                $http.post('/api/user/share', {
                    facebookShare: $scope.facebookShare,
                    twitterShare: $scope.twitterShare,
                    shareText: $scope.shareText,
                    imgUrl: $scope.imageUrl
                }).
                    success(function(data, status, headers, config) {
                        $scope.success = 'Shared';
                        $scope.shareLoading = false;
                    }).
                    error(function(data, status, headers, config) {
                        $scope.error = 'Unable to share';
                        $scope.shareLoading = false;
                    });
            };
        }]
    };
});



'use strict';

angular.module('users').directive('trackerSummary', function() {
    return {
        restrict: 'E',
        scope:{
            stats: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/summary-table.html',
        controller: ['$scope', function($scope) {


        }]
    };
});


angular.module('users').directive('overviewCategorySummary', function() {
    return {
        restrict: 'E',
        scope:{
            stats: '=',
            title: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/overview-category-summary.html',
        controller: ['$scope', function($scope) {


        }]
    };
});

angular.module('users').directive('trackerHistory', function(){
    return {
        restrict: 'E',
        scope:{
            picks: '=',
            username: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/tracker-history.html',
        controller: ['$scope', '$filter', 'Authentication', function($scope, $filter, Authentication) {

            $scope.authentication = Authentication;

            var getUnique = function(array, field){
                var unique = $filter('unique')(array, field);
                unique = $filter('map')(unique, field);
                unique = $filter('remove')(unique, undefined);
                return unique;
            };

            $scope.filters = {
                sport: [{name:'All Sports', id:'all'}],
                league: [{name:'All Leagues', id:'all'}],
                team: [{name:'All Teams', id: 'all'}],
                homeAway: ['Home/Away', 'Home', 'Away'],
                betDuration: ['All Periods'],
                betType: ['All Bet Types'],
                unitSize: [{name:'All Unit Sizes', id:'all'}, {name:'1 Unit', id:1}, {name:'2 Units', id:2}, {name:'3 Units', id:3}, {name:'4 Units', id:4}, {name:'5 Units', id:5}],
                date: [{name: 'All Time', date:'all'}]
            };

            $scope.filter = {
                sport: $scope.filters.sport[0],
                league: $scope.filters.league[0],
                team: $scope.filters.team[0],
                homeAway: $scope.filters.homeAway[0],
                betDuration: $scope.filters.betDuration[0],
                betType: $scope.filters.betType[0],
                unitSize: $scope.filters.unitSize[0],
                date: $scope.filters.date[0]
            };

            $scope.initializeFilters = function(){

                //Sports
                var sports = getUnique($scope.picks, 'event.sport');
                $scope.filters.sport = $scope.filters.sport.concat(sports);

                //Bet Types
                var betTypes = getUnique($scope.picks, 'betType');
                $scope.filters.betType = $scope.filters.betType.concat(betTypes);

                $scope.updateFilterBetDurations();
                $scope.initializeDateFilters();
            };

            $scope.initializeDateFilters = function(){
                var date = new Date();
                var today = date;
                var endDate = new Date();
                $scope.filters.date = [{name: 'All Time', startDate:'all', endDate: endDate,  primary:true}];
                $scope.filters.date.push({name:'Last 7 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 30 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 60 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 90 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90, today.getHours(), today.getMinutes()), endDate: endDate,  primary:true});
                $scope.filters.date.push({name:'Last 6 Months', startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate(), today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filter.date = $scope.filters.date[0];

            };

            $scope.historyFilter = function(pick){
                if($scope.filter.sport.id === 'all' || $scope.filter.sport.ref === pick.event.sport.ref){
                    if($scope.filter.league.id === 'all' || $scope.filter.league.ref._id === pick.event.league.ref._id){
                        if($scope.filter.team.id === 'all' || ('contestant' in pick && $scope.filter.team.name === pick.contestant.name)){
                            if($scope.filter.betType === 'All Bet Types' || $scope.filter.betType === pick.betType){
                                if($scope.filter.homeAway === 'Home/Away' || ('contestant' in pick && $scope.filter.homeAway.toLowerCase() === pick.contestant.homeAway)){
                                    if($scope.filter.betDuration === 'All Periods' || $scope.filter.betDuration === pick.betDuration){
                                        if($scope.filter.unitSize.id === 'all' || $scope.filter.unitSize.id === pick.units){
                                            if($scope.filter.date.startDate === 'all' || (new Date(pick.eventStartTime) >= $scope.filter.date.startDate && new Date(pick.eventStartTime) <= $scope.filter.date.endDate)){
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            };

            $scope.updateFilterLeagues = function(){
                $scope.filters.league = [{name:'All Leagues', id:'all'}];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return pick.event.sport.ref === $scope.filter.sport.ref;
                });
                var leagues = getUnique(picks, 'event.league');
                $scope.filters.league = $scope.filters.league.concat(leagues);
                $scope.filter.league = $scope.filters.league[0];
            };

            $scope.updateFilterTeams = function(){
                $scope.filters.team = [{name:'All Teams', id:'all'}];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return pick.event.league.ref._id === $scope.filter.league.ref._id;
                });
                var teams = getUnique(picks, 'contestant.ref');
                $scope.filters.team = $scope.filters.team.concat(teams);
                $scope.filter.team = $scope.filters.team[0];
            };

            $scope.updateFilterBetDurations = function(){
                $scope.filters.betDuration = ['All Periods'];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                var betDurations = getUnique(picks, 'betDuration');
                $scope.filters.betDuration = $scope.filters.betDuration.concat(betDurations);
                $scope.filter.betDuration = $scope.filters.betDuration[0];
            };

            $scope.updateFilterDates = function(){

                $scope.initializeDateFilters();

                if($scope.filter.league.ref && $scope.filter.league.ref.seasons){
                    for(var i=0; i<$scope.filter.league.ref.seasons.length; i++){
                        $scope.filters.date.push({name:$scope.filter.league.ref.seasons[i].name, startDate: new Date($scope.filter.league.ref.seasons[i].startDate), endDate: new Date($scope.filter.league.ref.seasons[i].endDate), primary:true});

                    }
                }
            };

            $scope.updateHistoryStats = function(){

                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                picks = $filter('filter')(picks, $scope.search.text);

                $scope.historyStats = {
                    profit:0,
                    roi:0,
                    win:0,
                    loss:0,
                    push:0,
                    total:picks.length,
                    units:0,
                    totalOdds:0,
                    winPercent:0,
                    avgOdds:0,
                    avgBet:0
                };

                for(var i=0; i<picks.length; i++){
                    if(picks[i].result.toLowerCase() === 'half-loss'){
                        $scope.historyStats.loss++;
                    } else if(picks[i].result.toLowerCase() === 'half-win'){
                        $scope.historyStats.win++;
                    } else {
                        $scope.historyStats[picks[i].result.toLowerCase()]++;
                    }
                    $scope.historyStats.units += picks[i].units;
                    $scope.historyStats.totalOdds += picks[i].odds;
                    $scope.historyStats.profit += picks[i].profit;
                }

                $scope.historyStats.avgOdds = $scope.historyStats.totalOdds/$scope.historyStats.total;
                $scope.historyStats.roi = ($scope.historyStats.profit/$scope.historyStats.units)*100;
                $scope.historyStats.winPercentage = ($scope.historyStats.win/$scope.historyStats.total)*100;
                $scope.historyStats.avgBet = $scope.historyStats.units/$scope.historyStats.total;


            };

            $scope.currentPage = 1;
            $scope.pageSizes = [10, 20, 30, 40, 50];
            $scope.pageSize = {number:$scope.pageSizes[0]};
            $scope.search = {text:''};

            $scope.updatePages = function(){
                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                picks = $filter('filter')(picks, $scope.search.text);
                $scope.numberOfPages = Math.ceil(picks.length / $scope.pageSize.number);

                $scope.pages = function() {
                    var pages = [];
                    for (var i = 1; i <= $scope.numberOfPages; i++) {
                        pages.push(i);
                    }
                    return pages;
                };

                $scope.currentPage = 1;
            };

            $scope.nextPage = function() {
                if ($scope.currentPage !== $scope.numberOfPages) {
                    $scope.currentPage++;
                }
            };

            $scope.prevPage = function() {
                if ($scope.currentPage !== 1) {
                    $scope.currentPage--;
                }
            };



            $scope.getExportHeader = function(){
                return ['result', 'date', 'sport', 'league', 'home team', 'away team', 'bet', 'bet type', 'bet duration', 'odds', 'units', 'roi', 'profit'];
            };

            $scope.getExportData = function() {
                var exportData = [];

                for (var i = 0; i < $scope.picks.length; i++) {
                    exportData.push({
                        result: $scope.picks[i].result,
                        date: new Date($scope.picks[i].event.startTime),
                        sport: $scope.picks[i].event.sport.name,
                        league: $scope.picks[i].event.league.name,
                        home: $scope.picks[i].event.contestant1.name,
                        away: $scope.picks[i].event.contestant2.name,
                        bet: $filter('betName')($scope.picks[i], $scope.picks[i].event),
                        betType: $scope.picks[i].betType,
                        period: $scope.picks[i].betDuration,
                        odds: $filter('formatOdds')($scope.picks[i].odds),
                        units: $scope.picks[i].units,
                        roi: $scope.picks[i].roi,
                        profit: $scope.picks[i].profit
                    });
                    /*
                     if('contestantWinner' in $scope.picks[i].event){
                     exportData[i].contestantWinner = $scope.picks[i].event.contestantWinner.name;
                     } else if ($scope.picks[i].event.draw){
                     exportData[i].contestantWinner = 'draw';
                     }
                     */
                }

                return exportData;
            };


            $scope.initializeFilters();
            $scope.updateHistoryStats();
            $scope.updatePages();

        }]
    };
});

angular.module('users').directive('trackerLineChart', function(){
    return {
        restrict: 'E',
        scope:{
            picks: '=',
            statSummary: '=',
            field: '=',
            includeZoom: '=',
            title: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/tracker-line-chart.html',
        controller: ['$scope', '$filter', 'Modal', function($scope, $filter, Modal) {

            var lineChartDefaults = {
                type: 'LineChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'date', label:'Date', type:'date', p:{}}
                    ],
                    rows: []
                },
                options: {
                    curveType: 'function',
                    fill: 20,
                    displayExactValues: true,
                    legend:null,
                    vAxis: {
                        title: 'Profit (Units)',
                        gridlines: {
                            count:-1,
                            color:'transparent'
                        },
                        titleTextStyle: {italic: false, fontSize:12},
                        baselineColor: '#dfe5e9',
                        textStyle:{ fontSize:12}
                    },
                    hAxis: {
                        gridlines:{
                            count:-1,
                            color:'transparent'
                        },
                        titleTextStyle: {italic: false, fontSize:12},
                        slantedText: false,
                        baselineColor: '#dfe5e9',
                        format:'MMM d, y',
                        textStyle:{ fontSize:12}
                    },
                    animation: {
                        duration: 300,
                        startup:true
                    },
                    chartArea:{
                        left:50,
                        top:10,
                        height:'80%',
                        width:'100%',
                        backgroundColor: {
                            stroke:'#dfe5e9',
                            strokeWidth:1
                        }
                    },
                    explorer:{
                        actions: ['dragToZoom', 'rightClickToReset'],
                        axis: 'horizontal'
                    },
                    fontName: 'Lato',
                    colors: []
                },

                formatters: {}
            };

            var getLineChart = function(statSummary, picks, field, duration){
                var chart = angular.copy(lineChartDefaults);

                if(!$scope.includeZoom){
                    chart.options.vAxis.gridlines.color ='#fafafa';
                    chart.options.legend = {position: 'top', textStyle: { color: 'gray', fontName: 'Lato', fontSize: 14}};
                    chart.options.chartArea.top = 'auto';
                }

                var totalValue = {};
                var durationValue = {};
                var lastCompareDate = new Date();
                var values =[];
                var total = {};

                //Initialize the columns and colors
                for(var i=0; i<statSummary.length; i++) {

                    //Initialize columns
                    chart.data.cols.push({id: statSummary[i].category, label: statSummary[i].category, type: 'number', p: {}});
                    totalValue[statSummary[i].category] = 0;
                    durationValue[statSummary[i].category] = 0;
                    total[statSummary[i].category] = 0;

                    //Initialize colors
                    if(statSummary[i].color){
                        chart.options.colors.push(statSummary[i].color);
                    }
                }

                //Order Picks
                picks = $filter('orderBy')(picks, 'event.startTime');


                //Loop through each pick
                for(var j=0; j<picks.length; j++){
                    var currentCategory;

                    //Get the current category name
                    if(field.indexOf('.') !== -1){
                        var properties = field.split('.');
                        currentCategory =  picks[j];
                        for(var k=0; k<properties.length; k++){
                            currentCategory =  currentCategory[properties[k]];
                        }
                        currentCategory = currentCategory.name;
                    } else {
                        currentCategory = picks[j][field];
                    }

                    //check to see how to group values based on day, week, or month
                    var currentStartTime = new Date(picks[j].event.startTime);
                    var compareDate;

                    switch (duration){
                        case 'Day':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                            break;
                        case 'Week':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                            compareDate.setDate(compareDate.getDate() - compareDate.getDay()+1);
                            break;
                        case 'Month':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), 1, 0, 0, 0, 0, 0);
                            break;
                    }

                    if(compareDate.toString() !== lastCompareDate.toString()){
                        var row = {c: [{v:compareDate}]};
                        for(var l=0; l<statSummary.length; l++){
                            totalValue[statSummary[l].category] += durationValue[statSummary[l].category];
                            row.c.push({v:parseFloat(totalValue[statSummary[l].category].toFixed(2))});
                            durationValue[statSummary[l].category] = 0;
                        }
                        values.push(row);
                        durationValue[currentCategory] += picks[j].profit;
                    } else {
                        durationValue[currentCategory] += picks[j].profit;
                    }
                    lastCompareDate = compareDate;

                }

                for(var m=0; m<statSummary.length; m++){
                    values[values.length - 1].c[m+1].v = values[values.length - 1].c[m+1].v + durationValue[statSummary[m].category];
                    values[values.length - 1].c[m+1].v = parseFloat(values[values.length - 1].c[m+1].v.toFixed(2));
                }


                //If not colours were added, than remove color option
                if(chart.options.colors.length === 0){
                    delete chart.options.colors;
                }
                chart.data.rows = values;
                return chart;
            };


            $scope.filter = 'Day';
            $scope.updateChart = function(filter){
                $scope.filter = filter;
                $scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, filter);
            };

            $scope.showModal = function(){
                Modal.showModal('modules/fu/client/templates/tracker/chart-modal.html', 'ChartModalController', {
                    picks: function () {
                        return $scope.picks;
                    },
                    statSummary: function () {
                        return $scope.statSummary;
                    },
                    field: function(){
                        return $scope.field;
                    },
                    title: function(){
                        return $scope.title;
                    }
                }, 'lg');
            };

            //$scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, 'Day');

            $scope.$watch('statSummary', function () {
                $scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, $scope.filter);
            });


        }]
    };
});

'use strict';

angular.module('fu').directive('trendingCard', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            value: '=',
            type: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.type){
                case 'profit':
                    directive = '<trending-card-profit user="user" value="value"></trending-card-profit>';
                    break;
                case 'streak':
                    directive = '<trending-card-streak user="user" value="value"></trending-card-streak>';
                    break;
                case 'follows':
                    directive = '<trending-card-follows user="user" value="value"></trending-card-follows>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
}]);

'use strict';

angular.module('fu').directive('trendingCardFollows', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-follows.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('trendingCardProfit', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-profit.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('trendingCardStreak', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-streak.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('trendingTable', ["$compile", function ($compile) {
    return {
        restrict: 'E',
        scope: {
            users: '=',
            type: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.type){
                case 'profit':
                    directive = '<trending-table-profit users="users"></trending-table-profit>';
                    break;
                case 'streak':
                    directive = '<trending-table-streak users="users"></trending-table-streak>';
                    break;
                case 'follows':
                    directive = '<trending-table-follows users="users"></trending-table-follows>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
}]);

'use strict';

angular.module('fu').directive('trendingTableFollows', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-follows.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});
'use strict';

angular.module('fu').directive('trendingTableProfit', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-profit.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('trendingTableStreak', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-streak.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('eventPickList', function () {
    return {
        restrict: 'E',
        scope: {
            events: '=',
            includeUser: '='
        },
        templateUrl: 'modules/fu/client/templates/user-picks/event-pick-list.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});
'use strict';

angular.module('fu').directive('pickList', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '=',
            event: '=',
            includeUser: '='
        },
        templateUrl: 'modules/fu/client/templates/user-picks/pick-list.client.template.html',
        controller: ['$scope', 'UserPicks', 'BetSlip', 'Modal', function ($scope, UserPicks, BetSlip, Modal){

            $scope.userPicks = UserPicks;

            $scope.copyPick = function(pick, event){

                if(!$scope.userPicks.hasStarted(event) && !$scope.userPicks.isOwn(pick) && !$scope.userPicks.isCopied(pick) && !$scope.userPicks.isPicked(pick)){
                    var newPick = pick.bet;
                    newPick.copiedFrom = {user: {name: pick.user.name, ref: pick.user.ref._id}, pick: pick._id};
                    if('copiedOrigin' in pick){
                        newPick.copiedOrigin = pick.copiedOrigin;
                    } else {
                        newPick.copiedOrigin = newPick.copiedFrom;
                    }
                    BetSlip.addRemove(newPick, event);
                }
            };


            $scope.sharePick = function(pick, event){
                Modal.showModal(
                    '/modules/fu/client/views/share/modal/modal-share.client.view.html',
                    'ModalShareController', {
                    type: function () {
                        return 'pick';
                    },
                    pick: function () {
                        return pick;
                    },
                    event: function(){
                        return event;
                    }
                }, 'share');
            };


            $scope.showCommentModal = function(pick){
                Modal.showModal(
                    '/modules/fu/client/views/pick/modal/modal-pick-comment.client.view.html',
                    'ModalPickCommentController',{
                        pick: function (){
                            return pick;
                        }
                    },
                    'pick-comment'
                );
            };

        }]
    };
});
'use strict';

angular.module('fu').directive('avatar', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            username: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/users/avatar.client.template.html',
        controller: ['$scope',  function ($scope){

        }]
    };
});

'use strict';

angular.module('fu').directive('loginForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/login-form.client.template.html',
        controller: ['$scope', '$state', 'UserAuth',  function ($scope,  $state, UserAuth){

            $scope.signin = function() {

                function cb(err){
                    if(err){
                        $scope.error = err;
                    } else {
                        $state.go('hub');
                    }
                }

                UserAuth.login($scope.form, cb);
            };

        }]
    };
});

'use strict';

angular.module('fu').directive('signupForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/signup-form.client.template.html',
        controller: ['$scope', '$state', 'UserAuth', 'Sports', 'Loading', function ($scope, $state, UserAuth, Sports, Loading) {

            $scope.loading = Loading;

            $scope.redirectUrl = $state.params.redirect;

            if($scope.redirectUrl){
                if($scope.redirectUrl.indexOf('profile')!== -1){
                    var redirectUrl = [];
                    if($scope.redirectUrl.indexOf('/')!== -1){
                        redirectUrl = $scope.redirectUrl.split('/');
                    } else if ($scope.redirectUrl.indexOf('%2F')!== -1){
                        redirectUrl = $scope.redirectUrl.split('%2F');
                    }
                    if (redirectUrl.length){
                        $scope.username = redirectUrl[redirectUrl.length -1];
                    }
                }
            }

            $scope.signup = function(isValid) {
                $scope.error = null;
                $scope.loading.isLoading.formSubmit = true;


                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity', 'userForm');
                    $scope.invalid = true;
                    $scope.loading.isLoading.formSubmit = false;
                    return false;
                }

                function cb(err){
                    $scope.loading.isLoading.formSubmit = false;
                    if(err){
                        $scope.error = err;
                    } else {
                        if($scope.redirectUrl){
                            $state.go('signupSuccess', {redirect: $scope.redirectUrl});
                        } else{
                            $state.go('signupSuccess');
                        }
                    }
                }
                UserAuth.signup($scope.form, cb);
            };

            Sports.getAll(function(err, sports){
                $scope.sports = sports;
            });
        }]
    };
});

'use strict';

angular.module('fu').directive('uploadProfilePicture', function() {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/upload-profile-picture.client.template.html',
        controller: ['$scope', '$http', 'Authentication', function($scope, $http, Authentication) {
            //$scope.profileImage = '../../modules/users/img/signup/profile.png';

            $scope.profileUrl = 'http://res.cloudinary.com/hltkmtrz5/image/upload/v1408811714/profile-add.png';

            if(Authentication.user.profileUrl.indexOf('profile-default.png') === -1){
                $scope.profileUrl = Authentication.user.profileUrl;
            }

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.openUpload = function () {
                FileUpload.click();
            };

            $scope.uploadFile = function(files) {
                var file = files[0];
                var ext = file.name.split('.');
                ext = ext[ext.length-1].toLowerCase();
                switch(ext){
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                    case 'png':
                        $scope.invalidImageType = false;
                        var fd = new FormData();
                        fd.append('file', files[0]);
                        $http.post('/api/profileupload', fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                            .success(function(response){
                                Authentication.user = response;
                                $scope.profileUrl = Authentication.user.profileUrl;
                            })
                            .error(function(response){
                                console.log('error');
                            });
                        break;
                    default:
                        $scope.invalidImageType = true;
                        return;
                }
            };
        }]
    };
});

'use strict';

angular.module('fu').filter('abbrTeamName',[function() {
    return function(contestant) {
        if(contestant.abbreviation){
            return contestant.abbreviation;
        } else {
            return contestant.name.substring(0,3).toUpperCase();
        }
    };
}]);
'use strict';

angular.module('fu').filter('addPlus', function() {
    return function(value) {
        if(value > 0){
            return '+' + value;
        } else {
            return value;
        }
    };
});


'use strict';

angular.module('fu').filter('betLine',['$filter', function($filter) {
    return function(bet) {
        var text;
        switch(bet.betType){
            case 'spread':
                text = $filter('formatSpread')(bet.spread);
                break;
            case 'total points':
                text = bet.overUnder+' '+$filter('formatPoints')(bet.points);
                break;
            case 'moneyline':
                if(bet.draw){
                    text = 'Draw';
                } else {
                    text = $filter('formatOdds')(bet.odds);
                }
                break;
        }
        return text;
    };
}]);
'use strict';

angular.module('fu').filter('betName',['$filter', function($filter) {
    return function(pick, event) {
        var text;
        switch(pick.betType){
            case 'spread':
                text = pick.contestant.name+' '+$filter('formatSpread')(pick.spread);
                break;
            case 'total points':
                text = pick.overUnder+' '+$filter('formatPoints')(pick.points) +' ' + $filter('pointName')(event);
                break;
            case 'team totals':
                text = pick.contestant.name+' '+pick.overUnder+' '+$filter('formatPoints')(pick.points) + ' ' + $filter('pointName')(event);
                break;
            case 'moneyline':
                if(pick.draw){
                    text = 'Draw';
                } else {
                    text = pick.contestant.name + ' Moneyline';
                }
                break;
            case 'sets':
                text = pick.contestant.name+' '+$filter('formatSpread')(pick.spread)+' sets';
                break;
            default:
                text = pick.contestant.name;
                break;

        }
        return text;
    };
}]);
'use strict';

angular.module('fu').filter('displayBetValue',['$filter', function($filter) {
    return function(value, type) {
        var displayValue;
        switch(type){
            case 'spread':
                displayValue = $filter('formatSpread')(value);
                break;
            case 'total points':
                displayValue = $filter('formatPoints')(value);
                break;
            case 'odds':
            case 'moneyline':
                displayValue = $filter('formatOdds')(value);
                break;
        }
        return displayValue;
    };
}]);
'use strict';

angular.module('fu').filter('displayHeaderValue',['$filter', function($filter) {
    return function(value, type) {
        var displayValue;
        switch(type){
            case 'spread':
                displayValue = $filter('formatSpread')(value);
                break;
            case 'total points':
                displayValue = 'o'+$filter('formatPoints')(value);
                break;
            case 'odds':
                displayValue = $filter('formatOdds')(value);
                break;
        }
        return displayValue;
    };
}]);
'use strict';

angular.module('fu').filter('formatOdds', ['Authentication', function(Authentication) {
    return function(odds) {
        var oddsFormat = 'Decimal';
        if(Authentication.user){
            oddsFormat = Authentication.user.oddsFormat;
        }
        if(typeof odds !== 'undefined' && odds !== null){
            switch(oddsFormat){
                case 'Decimal':
                    return odds.toFixed(2);
                case 'American':
                    var americanOdds;
                    if(odds === 1){
                        americanOdds = 'Even';
                    }
                    else if (odds<2){
                        americanOdds = parseInt(-100/(odds - 1));
                    } else {
                        americanOdds = 100*(odds-1);
                        americanOdds = '+'+parseInt(americanOdds);
                    }
                    return americanOdds;
                /*
                case 'Fractional':
                    var fractionalOdds = new Fraction(odds.toFixed(3));
                    return fractionalOdds.n+'/'+fractionalOdds.d;
                    */
            }
        }
    };
}]);

'use strict';

angular.module('core').filter('formatPoints', function(){
    return function(points){
        if(!isNaN(points)){
            var value = points % 1;
            var pointsText;
            if (Math.abs(value) === 0.75 || Math.abs(value) === 0.25){
                var points1 = points - 0.25;
                var points2 = points + 0.25;
                points1 = points1.toFixed(1);
                points2 = points2.toFixed(1);
                if (value < 0){
                    pointsText = points2+ ', ' + points1;
                } else {
                    pointsText = points1+ ', ' + points2;
                }

            } else {
                points = points.toFixed(1);
                pointsText = points;
            }
            return pointsText;
        }
    };
});
'use strict';

angular.module('fu').filter('formatProfit', function() {
    return function(profit) {
        return profit.toFixed(1);
    };
});


'use strict';

angular.module('fu').filter('formatResult', [ function() {
    return function(result) {
        var resultText;

        switch(result){
            case 'Win':
                resultText = 'w';
                break;
            case 'Loss':
                resultText = 'l';
                break;
            case 'Push':
                resultText = 'p';
                break;
            case 'Cancelled':
                resultText = 'c';
                break;
            case 'Half-Win':
                resultText = 'hw';
                break;
            case 'Half-Loss':
                resultText = 'hl';
                break;
        }

        return resultText;
    };
}]);

'use strict';

angular.module('fu').filter('formatRoi', function() {
    return function(profit) {
        return profit.toFixed(1)+'%';
    };
});


'use strict';

angular.module('core').filter('formatSpread', function(){
    return function(spread){
        if(!isNaN(spread) && spread !== null){
            var value = spread % 1;
            var spreadText;
            if (Math.abs(value) === 0.75 || Math.abs(value) === 0.25){
                var spread1 = spread - 0.25;
                var spread2 = spread + 0.25;
                spread1 = spread1.toFixed(1);
                spread2 = spread2.toFixed(1);
                if(spread1 > 0){
                    spread1 = '+'+spread1;
                }
                if(spread2 > 0){
                    spread2 = '+'+spread2;
                }
                if (value < 0){
                    spreadText = spread2+ ', ' + spread1;
                } else {
                    spreadText = spread1+ ', ' + spread2;
                }

            } else {
                spread = spread.toFixed(1);
                if(spread> 0){
                    spread = '+'+spread;
                }
                spreadText = spread;
            }
            return spreadText;
        }
    };
});
'use strict';

angular.module('fu').filter('gameName', ['$sce', function($sce){
    return function(pick, hasScores){
        var teamNames;
        var homeContestant;
        var awayContestant;
        var event = pick.event;
        var separator = '@';
        var selected;
        if(event.neutral) separator = 'VS ';

        switch(pick.betType){
            case 'moneyline':
            case 'spread':
            case 'team totals':
            case 'sets':
                if(pick.contestant){
                    if(pick.contestant.ref === event.contestant1.ref){
                        selected = 'home';
                    } else if(pick.contestant.ref === event.contestant2.ref){
                        selected = 'away';
                    }
                }
                break;
        }

        if(selected === 'home'){
            homeContestant = '<span class="selected">'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span>'+event.contestant2.name+'</span>';
        } else if (selected === 'away'){
            homeContestant = '<span>'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span class="selected">'+event.contestant2.name+'</span>';
        } else{
            homeContestant = '<span>'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span>'+event.contestant2.name+'</span>';
        }

        if(hasScores){
            homeContestant = '<span class="score score-1">'+pick.contestant1Score+'</span>' + homeContestant;
            awayContestant = '<span class="score score-2">'+pick.contestant2Score+'</span>' + awayContestant;
        }
        teamNames = '<div>'+awayContestant+'</div><div>'+homeContestant+'</div>';

        return $sce.trustAsHtml(teamNames);
    };
}]);
'use strict';

angular.module('fu').filter('pickName', ['$filter', '$sce', function($filter, $sce) {
    return function(pick){
        var pickName;
        switch(pick.betType){
            case 'moneyline':
                pickName = 'ML';
                if(pick.draw) pickName = 'Draw';
                break;
            case 'spread':
                pickName = 'Spread <div>' + $filter('formatSpread')(pick.spread) + '</div>';
                break;
            case 'team totals':
            case 'total points':
                pickName = pick.overUnder + '<div>' + $filter('formatPoints')(pick.points) + '</div>';
                break;
            case 'sets':
                pickName = 'Sets <div>' +  $filter('formatPoints')(pick.spread) + '</div>';
                break;
        }

        return $sce.trustAsHtml(pickName);
    };
}]);
'use strict';

angular.module('fu').filter('pickReturn', function() {
    return function(pick){
        return (pick.odds* pick.units).toFixed(1);
    };
});
'use strict';

angular.module('fu').filter('pointName', function(){
    return function(event){
        if(event){
            switch(event.sport.name){
                case 'Hockey':
                case 'Soccer':
                    return 'Goals';
                case 'Boxing':
                case 'Mixed Martial Arts':
                    return 'Rounds';
                case 'Baseball':
                    return 'Runs';
                case 'Tennis':
                    return 'Games';
                case 'Volleyball':
                    return 'Sets';
                default:
                    return 'Points';
            }
        }
    };
});
'use strict';

angular.module('fu').filter('shortBetName',['$filter', function($filter) {
    return function(pick, event) {
        var text;
        var shortName;
        if(pick.contestant){
            var shortNameArray = pick.contestant.name.split(' ');
            shortName = shortNameArray[shortNameArray.length-1];
        }
        switch(pick.betType){
            case 'spread':
                text = shortName+' '+$filter('formatSpread')(pick.spread);
                break;
            case 'total points':
                text = pick.overUnder+' '+$filter('formatPoints')(pick.points) +' ' + $filter('pointName')(event);
                break;
            case 'team totals':
                text = shortName+' '+pick.overUnder+' '+$filter('formatPoints')(pick.points) + ' ' + $filter('pointName')(event);
                break;
            case 'moneyline':
                if(pick.draw){
                    text = 'Draw';
                } else {
                    text = shortName + ' Moneyline';
                }
                break;
            case 'sets':
                text = shortName+' '+$filter('formatSpread')(pick.spread)+' sets';
                break;
        }
        return text;
    };
}]);
'use strict';

angular.module('fu').filter('shortNameBetType',[function() {
    return function(betType) {
        switch (betType) {
            case 'moneyline':
                return 'ML';
            case 'total points':
                return 'Totals';
            case 'team totals':
                return 'Team Totals';
            case 'spread':
                return 'Spread';
        }
    };
}]);
'use strict';

angular.module('fu').filter('shortTeamNameHeader',[function() {
    return function(event) {
        var separator = ' @ ';
        if(event.neutral) event.separator = ' vs. ';
        if(event.contestant1.name2 && event.contestant2.name2){
            return event.contestant2.name2 + separator + event.contestant1.name2;
        } else {
            return event.contestant2.name + separator + event.contestant1.name;
        }
    };
}]);
'use strict';

angular.module('fu').filter('slugify',[function() {
    return function(event) {
        return event
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
    };
}]);
'use strict';

angular.module('fu').filter('startFrom', function() {
    return function(input, start) {
        if(input){
            start = +start; //parse to int
            return input.slice(start);
        }
    };
});
'use strict';

angular.module('fu').filter('striptags', function() {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }
);
'use strict';

angular.module('fu').filter('teamNameHeader',[function() {
    return function(event) {
        var separator = ' @ ';
        if(event.neutral) event.separator = ' vs. ';
        return event.contestant2.name + separator + event.contestant1.name;
    };
}]);
'use strict';

angular.module('fu').factory('ApiAuth', ['$resource',
    function ($resource) {
        return $resource('api/auth/:action', {}, {
            login: { method: 'POST', params: {action: 'signin'} },
            signup: { method: 'POST', params: {action: 'signup'} }
        });
    }
]);

'use strict';

angular.module('fu').factory('ApiChannels', ['$resource',
    function ($resource) {
        return $resource('api/channels/:_id/:action', { _id: '@_id' }, {
            update:       { method: 'PUT' },
            subscribe:    { method: 'POST', params: {action: 'subscribe'}},
            unsubscribe:  { method: 'POST', params: {action: 'unsubscribe'}}
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiChannelsContent', ['$resource',
    function ($resource) {
        return $resource('api/channels/:slug/content', { slug: '@_slug' });
    }
]);
'use strict';

angular.module('fu').factory('ApiChannelsEvents', ['$resource',
    function ($resource) {
        return $resource('api/channels/:slug/events', { slug: '@_slug' });
    }
]);
'use strict';

angular.module('fu').factory('ApiComments', ['$resource',
    function ($resource) {
        return $resource('api/comments/:_id', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiCommentsPreviews', ['$resource',
    function ($resource) {
        return $resource('api/comments/:_id/previews', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiContestants', ['$resource',
    function ($resource) {
        return $resource('api/contestants/:_id/:action', { _id: '@_id' }, {
            update:  { method: 'PUT' },
            merge:   { method: 'PUT', params: {action: 'merge'}}
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiEvents', ['$resource',
    function ($resource) {
        return $resource('api/events/:_id/:action', { _id: '@_id' }, {
            update: { method: 'PUT' },
            cancel:     { method: 'PUT', params: {action: 'cancel'}},
            report:     { method: 'POST', params: {action: 'report'}},
            reresolve:  { method: 'POST', params: {action: 'reresolve'}},
            resolve:    { method: 'PUT', params: {action: 'resolve'}},
            getPicks:   { method: 'GET', params: {action: 'picks'}, isArray: true}
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiEventsComments', ['$resource',
    function ($resource) {
        return $resource('api/events/:event/comments/:_id', { _id: '@_id', event: '@event' }, {
            update:  { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiEventsGamecenter', ['$resource',
    function ($resource) {
        return $resource('api/events/:_id/gamecenter', { _id: '@_id' });
    }
]);
'use strict';

angular.module('fu').factory('ApiEventsSlug', ['$resource',
    function ($resource) {
        return $resource('api/events/slug/:slug', { slug: '@slug' }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiGamecenter', ['$resource',
    function ($resource) {
        return $resource('api/gamecenter/:eventSlug/:leagueSlug', { eventSlug: '@eventSlug', leagueSlug:'@leagueSlug' });
    }
]);
'use strict';

angular.module('fu').factory('ApiGroups', ['$resource',
    function ($resource) {
        return $resource('api/groups/:_id', { _id: '@_id' }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiHub', ['$resource',
    function ($resource) {
        return $resource('api/hub', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiHubPicks', ['$resource',
    function ($resource) {
        return $resource('api/hub/picks', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiLeaderboard', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiLeaderboardContestants', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/contestants');
    }
]);
'use strict';

angular.module('fu').factory('ApiLeaderboardLeagues', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/leagues');
    }
]);
'use strict';

angular.module('fu').factory('ApiLeaderboardSports', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/sports');
    }
]);
'use strict';

angular.module('fu').factory('ApiLeagues', ['$resource',
    function ($resource) {
        return $resource('api/leagues/:_id/:action', { _id: '@_id' }, {
            update:     { method: 'PUT' },
            getContestants: { method: 'GET', params: {action: 'contestants'}, isArray:true }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiMakePicks', ['$resource',
    function ($resource) {
        return $resource('api/makepicks', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiMakePicksMenu', ['$resource',
    function ($resource) {
        return $resource('api/makepicks/menu', {});
    }
]);

'use strict';

angular.module('fu').factory('ApiPicks', ['$resource',
    function ($resource) {
        return $resource('api/picks/:_id/:action', { _id: '@_id' }, {
            update:  { method: 'PUT' },
            report:  { method: 'PUT', params: {action: 'report'}},
            resolve: { method: 'PUT', params: {action: 'resolve'}}
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiPicksComments', ['$resource',
    function ($resource) {
        return $resource('api/picks/:pick/comments/:_id', { _id: '@_id', pick: '@pick' }, {
            update:  { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiPropicksAll', ['$resource',
    function ($resource) {
        return $resource('api/propicks/all', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiPropicksLeague', ['$resource',
    function ($resource) {
        return $resource('api/propicks/league', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiPropicksLeagueTotals', ['$resource',
    function ($resource) {
        return $resource('api/propicks/league/totals', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiPropicksSport', ['$resource',
    function ($resource) {
        return $resource('api/propicks/sport', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiPropicksSportTotals', ['$resource',
    function ($resource) {
        return $resource('api/propicks/sport/totals', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiSearch', ['$resource',
    function ($resource) {
        return $resource('api/search', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiSports', ['$resource',
    function ($resource) {
        return $resource('api/sports/:_id/:action', { _id: '@_id' }, {
            update:         { method: 'PUT' },
            getLeagues:     { method: 'GET', params: {action: 'leagues'}, isArray:true },
            getContestants: { method: 'GET', params: {action: 'contestants'}, isArray:true },
            getGroups: { method: 'GET', params: {action: 'groups'}, isArray:true },
            getResolveEvents: { method: 'GET', params: {action: 'resolveevents'}, isArray:true }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiSportsResolvelist', ['$resource',
    function ($resource) {
        return $resource('api/sports/resolvelist', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiTrending', ['$resource',
    function ($resource) {
        return $resource('api/trending', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiTrialActivate', ['$resource',
    function ($resource) {
        return $resource('api/trial/activate', {});
    }
]);
'use strict';

angular.module('fu').factory('ApiUserFollowing', ['$resource',
    function ($resource) {
        return $resource('api/user/following', {}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserFollowingSettings', ['$resource',
    function ($resource) {
        return $resource('api/user/following/settings/:_id', {_id:'@_id'}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserInfo', ['$resource',
    function ($resource) {
        return $resource('api/user/info', {}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserMakePicks', ['$resource',
    function ($resource) {
        return $resource('api/user/makepicks', {}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserMessagecount', ['$resource',
    function ($resource) {
        return $resource('api/user/messagecount', {}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserNotification', ['$resource',
    function ($resource) {
        return $resource('api/user/notifications/:_id/read', {_id: '@_id' }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserPicksCompleted', ['$resource',
    function ($resource) {
        return $resource('api/user/picks/completed', { }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserPicksPending', ['$resource',
    function ($resource) {
        return $resource('api/user/picks/pending', { }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserProfile', ['$resource',
    function ($resource) {
        return $resource('api/users/:username/profile', { username: '@username' }, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUserStatus', ['$resource',
    function ($resource) {
        return $resource('api/user/status', {}, {
            update: { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('fu').factory('ApiUsersFollow', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/follow', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);


'use strict';

angular.module('fu').factory('ApiUsersUnfollow', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/unfollow', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);


'use strict';

angular.module('fu').factory('BetSlip', [ '$filter', 'ApiUserMakePicks', 'Loading', 'Authentication', 'User',
    function($filter, ApiUserMakePicks, Loading, Authentication, User) {
        var events = [];
        var stats = {count:0};
        var status = {submitted: false, error: false};

        function addEvent(event){
            events.push({event:event, date: event.startTime, picks: []});
        }

        function addPick(pick, eventIndex){
            events[eventIndex].picks.push(pick);
        }

        function removePick(eventIndex, pickIndex){
            events[eventIndex].picks.splice(pickIndex, 1);
            if(events[eventIndex].picks.length === 0){
                events.splice(eventIndex, 1);
            }
        }

        function getEventIndex(event){
            var eventFound = $filter('filter')(events, function(e){
                return e.event === event;
            });
            if(eventFound.length) return events.indexOf(eventFound[0]);
        }

        function calculatePickCount(){
            if(events.length === 0){
                stats.count = 0;
                return;
            }
            for(var i=0; i<events.length; i++){
                if(i===0){
                    stats.count = events[i].picks.length;
                } else{
                    stats.count = stats.count + events[i].picks.length;
                }
            }
        }

        function checkIfErrors(){
            var hasError = false;
            for(var i=0; i<events.length; i++){
                for(var j=0; j<events[i].picks.length; j++){
                    var pick = events[i].picks[j];
                    if(pick.error === true){
                        hasError = true;
                        break;
                    }
                }
            }
            if(!hasError) status.error = false;
        }


        var addRemove = function(pick, event){
            var eventIndex = getEventIndex(event);
            if(eventIndex !== undefined){
                var pickIndex = events[eventIndex].picks.indexOf(pick);
                if(pickIndex === -1){
                    if(new Date(event.startTime) < new Date()) return;
                    pick.selected = !pick.selected;
                    addPick(pick, eventIndex);
                } else {
                    pick.selected = !pick.selected;
                    removePick(eventIndex, pickIndex);
                }
            } else {
                if(new Date(event.startTime) < new Date()) return;
                pick.selected = !pick.selected;
                addEvent(event);
                addPick(pick, events.length - 1);
            }
            calculatePickCount();
            if(status.error) checkIfErrors();
        };

        function removeAllSelected(){
            for(var i=0; i<events.length; i++){
                for(var j=0; j<events[i].picks.length; j++){
                    events[i].picks[j].selected = false;
                }
            }
        }

        function removeErrors(){
            for(var i=0; i<events.length; i++){
                events[i].error = false;
                for(var j=0; j<events[i].picks.length; j++){
                    events[i].picks[j].error = false;
                    events[i].picks[j].oddsChanged = false;
                }
            }
        }

        var submit = function(callback){
            removeErrors();
            Loading.isLoading.pickSubmit = true;

            function cbSuccess(results){
                removeAllSelected();
                Loading.isLoading.pickSubmit = false;
                status.submitted = true;
                Authentication.user = results.user;
                User.picks.pending.push(results.picks);
                events.length = 0;
                calculatePickCount();
                callback(null, results);
            }

            function cbError(response){
                Loading.isLoading.pickSubmit = false;
                callback(response.data);
            }

            ApiUserMakePicks.save(events, cbSuccess, cbError);
        };

        return {
            events:     events,
            stats:      stats,
            status:     status,
            addRemove:  addRemove,
            submit:     submit
        };
    }
]);
'use strict';

angular.module('fu').factory('Channels', ['ApiChannels', 'ApiChannelsContent', 'ApiChannelsEvents', 'User', '$filter',
    function(ApiChannels, ApiChannelsContent, ApiChannelsEvents, User, $filter) {

        var create = function(form, callback){

            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var channel = new ApiChannels(form);

            channel.$save(cbSuccess, cbError);
        };

        var update = function(channel, callback){

            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            channel.$update({_id: channel._id}, cbSuccess, cbError);

        };

        var get = function(channelID, callback){
            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiChannels.get({_id:channelID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(channels){
                callback(null, channels);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiChannels.query(cbSuccess, cbError);

        };

        var del = function(channel, callback){
            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }
            channel = new ApiChannels(channel);
            channel.$delete(cbSuccess, cbError);
        };

        var getContent = function(channelSlug, date, callback){
            function cbSuccess(channelContent){
                callback(null, channelContent);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiChannelsContent.get({slug: channelSlug, date: date}, cbSuccess, cbError);

        };

        var getEvents = function(channelSlug, date, callback){
            function cbSuccess(channelContent){
                callback(null, channelContent);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiChannelsEvents.query({slug: channelSlug, date:date}, cbSuccess, cbError);

        };

        var subscribe = function(channelId){
            function cbSuccess(channel){
                console.log(channel);
                User.info.channels.push(channel);
            }

            function cbError(response){
                console.log(response);
            }
            ApiChannels.subscribe({_id:channelId}, cbSuccess, cbError);
        };

        var unsubscribe = function(channelId){
            function cbSuccess(channel){
                var found = $filter('filter')(User.info.channels, {_id: channelId});
                if(found.length){
                    User.info.channels.splice(User.info.channels.indexOf(found[0]), 1);
                }
            }

            function cbError(response){
                console.log(response);
            }
            ApiChannels.unsubscribe({_id:channelId}, cbSuccess, cbError);

        };


        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getContent: getContent,
            getEvents: getEvents,

            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
]);
'use strict';

angular.module('fu').factory('Charts', [
    function() {
        var areaChartDefaults = {
            type: 'AreaChart',
            displayed: true,
            data: {
                cols: [
                    {id: 'date', label:'Date', type:'date', p:{}}
                ],
                rows: []
            },
            options: {
                curveType: 'function',
                isStacked: 'true',
                fill: 20,
                displayExactValues: true,
                legend:null,
                vAxis: {
                    title: 'Profit (Units)',
                    gridlines: {
                        count: -1,
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    gridlines:{
                        count:-1,
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    slantedText: false,
                    baselineColor: '#dfe5e9',
                    format:'MMM d, y',
                    textStyle:{ fontSize:12}
                },
                animation: {
                    duration: 500,
                    startup:true
                },
                chartArea:{
                    left:50,
                    top:10,
                    height:'80%',
                    width:'100%',
                    backgroundColor: {
                        stroke:'#dfe5e9',
                        strokeWidth:1
                    }
                },
                colors:['#21759B'],
                explorer:{
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                fontName: 'Lato'
            },
            formatters: {}

        };


        var createChart = function(type, data){
            switch(type){
                case 'area':
                    var chart = angular.copy(areaChartDefaults);
                    chart.data.cols = data.cols;
                    for(var i=0; i < data.rows.length; i++){
                        data.rows[i].c[0].v = new Date(data.rows[i].c[0].v);
                    }
                    chart.data.rows = data.rows;
                    return chart;
            }
        };

        return {
            createChart: createChart
        };
    }
]);
'use strict';

angular.module('fu').factory('CommentsPreviews', ['ApiCommentsPreviews',
    function(ApiCommentsPreviews) {

        var getPreviews = function(query, callback){
            function cbSuccess(previews){
                callback(null, previews);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiCommentsPreviews.query(query, cbSuccess, cbError);
        };

        return {
            getPreviews: getPreviews
        };
    }
]);
'use strict';

angular.module('fu').factory('Contestants', ['ApiContestants',
    function(ApiContestants) {

        var create = function(form, callback){

            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var contestant = new ApiContestants(form);

            contestant.$save(cbSuccess, cbError);
        };

        var update = function(contestant, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            contestant.$update({_id: contestant._id}, cbSuccess, cbError);

        };


        var get = function(contestantID, callback){
            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiContestants.get({_id:contestantID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiContestants.query(cbSuccess, cbError);

        };

        var del = function(contestant, callback){
            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }
            contestant = new ApiContestants(contestant);
            contestant.$delete(cbSuccess, cbError);
        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del
        };
    }
]);
'use strict';

angular.module('fu').factory('Loading',
    function() {

        var isLoading = {
            pickSubmit: false,
            formSubmit: false,
            pageLoading: false
        };

        return{
            isLoading: isLoading
        };
    }
);

'use strict';

angular.module('fu').factory('Modal', [ '$modal',
    function($modal) {
        var showModal = function (template, controllerName, resolveData, size) {
            if(!size){
                size = 'sm';
            }
            var modalInstance = $modal.open({
                templateUrl: template,
                size: size,
                controller: controllerName,
                backdrop: true,
                resolve: resolveData
            });
            return modalInstance;


        };

        var closeModal = function(modalInstance){
            modalInstance.dismiss();
        };

        return{
            showModal: showModal,
            closeModal: closeModal
        };
    }
]);
'use strict';

angular.module('fu').factory('Events', ['ApiEventsComments', 'ApiEvents', 'Authentication',
    function(ApiEventsComments, ApiEvents, Authentication) {

        var getComments = function(event, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiEventsComments.query({eventId:event._id}, cbSuccess, cbError);
        };

        var newComment = function(event, text, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var eventComment = new ApiEventsComments({event:event._id, text:text});

            eventComment.$save(cbSuccess, cbError);
        };

        var commentReply = function(event, comment, replyIndex, replyUser, text, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var commentReply = {
                _id: comment._id,
                event: event._id,
                text: text,
                replyIndex: replyIndex,
                replyUser: replyUser
            };

            commentReply = new ApiEventsComments(commentReply);
            commentReply.$update(cbSuccess, cbError);
        };

        var resolve = function(event, callback){

            function cbSuccess(event){
                callback(null, event);
            }

            function cbError(response){
                callback(response.data.message);
            }

            event = new ApiEvents(event);
            event.$resolve(cbSuccess, cbError);
        };

        var cancel = function(event, callback){
            function cbSuccess(event){
                callback(null, event);
            }

            function cbError(response){
                callback(response.data.message);
            }

            event = new ApiEvents(event);
            event.$cancel(cbSuccess, cbError);

        };

        var reResolve = function(event, callback){
            function cbSuccess(event){
                callback(null, event);
            }

            function cbError(response){
                callback(response.data.message);
            }

            event = new ApiEvents(event);
            event.$reresolve(cbSuccess, cbError);
        };

        var getPicks = function(event, callback){
            function cbSuccess(picks){
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiEvents.getPicks({_id: event._id}, cbSuccess, cbError);
        };


        var update = function(event, callback){

            function cbSuccess(event){
                callback(null, event);
            }

            function cbError(response){
                callback(response.data.message);
            }

            event = new ApiEvents(event);

            event.$update({_id: event._id}, cbSuccess, cbError);
        };


        return {
            getComments: getComments,
            newComment: newComment,
            commentReply: commentReply,
            getPicks: getPicks,

            resolve: resolve,
            cancel: cancel,
            reResolve: reResolve,
            update: update
        };
    }
]);
'use strict';

angular.module('fu').factory('Follow', ['Authentication', 'ApiUsersFollow', 'ApiUsersUnfollow', 'User', '$filter',
    function(Authentication, ApiUsersFollow, ApiUsersUnfollow, User, $filter) {

        var follow = function(userId){
            function cbSuccess(follow){
                User.info.following.push(follow);
            }

            function cbError(response){
                console.log(response);
            }

            ApiUsersFollow.save({userId:userId}, cbSuccess, cbError);
        };

        var unfollow = function(userId){

            function cbSuccess(follow){
                var found = $filter('filter')(User.info.following, {_id: userId});
                if(found.length){
                    User.info.following.splice(User.info.following.indexOf(found[0]), 1);
                }
            }

            function cbError(response){
                console.log(response);
            }

            ApiUsersUnfollow.save({userId:userId}, cbSuccess, cbError);
        };



        return {
            follow: follow,
            unfollow: unfollow
        };

    }
]);
'use strict';

angular.module('fu').factory('GaEcommerce', [
    function() {

        function sendTransaction(id, plan, amount){
            ga('ecommerce:addTransaction', {
                'id': id,
                'affiliation': 'FansUnite Pro Subscription',
                'revenue': amount
            });
            ga('ecommerce:addItem', {
                'id': id,
                'name': plan,
                'price': amount
            });

            ga('ecommerce:send');
            console.log(id, plan, amount);
            console.log('sent');
        }

        return {
            sendTransaction:   sendTransaction
        };
    }
]);
'use strict';

angular.module('fu').factory('Gamecenter', ['ApiGamecenter',
    function(ApiGamecenter) {

        var get = function(eventSlug, leagueSlug, callback){

            function cbSuccess(gamecenter){
                callback(null, gamecenter);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGamecenter.get({eventSlug:eventSlug, leagueSlug:leagueSlug}, cbSuccess, cbError);
        };


        return {
            get:  get
        };

    }
]);
'use strict';

angular.module('fu').factory('Groups', ['ApiGroups',
    function(ApiGroups) {

        var create = function(form, callback){

            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var group = new ApiGroups(form);

            group.$save(cbSuccess, cbError);
        };

        var update = function(group, callback){

            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            group.$update({_id: group._id}, cbSuccess, cbError);

        };

        var get = function(groupID, callback){
            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGroups.get({_id:groupID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(groups){
                callback(null, groups);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGroups.query(cbSuccess, cbError);

        };

        var del = function(group, callback){
            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }
            group = new ApiGroups(group);
            group.$delete(cbSuccess, cbError);
        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del
        };
    }
]);
'use strict';

angular.module('fu').factory('Hub', ['ApiHub', 'ApiHubPicks',
    function(ApiHub, ApiHubPicks) {

        var getHub = function(callback){
            function cbSuccess(hub){
                callback(null, hub);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiHub.get({}, cbSuccess, cbError);
        };

        var getPicks = function(query, callback){
            function cbSuccess(hub){
                callback(null, hub);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiHubPicks.query(query, cbSuccess, cbError);

        };


        return {
            getHub: getHub,
            getPicks: getPicks
        };
    }
]);
'use strict';

angular.module('fu').factory('Keywords', [
    function() {

        var getCapperText = function(sportName, capitalize){
            var capperText = 'tipsters';
            switch(sportName){
                case 'Baseball':
                case 'Basketball':
                case 'Hockey':
                case 'Football':
                case 'Curling':
                case 'Mixed Martial Arts':
                case 'Boxing':
                    capperText = 'handicappers';
                    break;
            }

            if(capitalize) capperText = capperText.charAt(0).toUpperCase() + capperText.slice(1);
            return capperText;

        };


        var getPicksText = function(sportName, capitalize){
            var picksText = 'tips';
            switch(sportName){
                case 'Baseball':
                case 'Basketball':
                case 'Hockey':
                case 'Football':
                case 'Curling':
                case 'Mixed Martial Arts':
                case 'Boxing':
                    picksText = 'picks';
                    break;
            }

            if(capitalize) picksText = picksText.charAt(0).toUpperCase() + picksText.slice(1);
            return picksText;

        };

        return {
            getCapperText: getCapperText,
            getPicksText: getPicksText
        };
    }
]);
'use strict';

angular.module('fu').factory('Leaderboard', ['ApiLeaderboard', 'ApiLeaderboardSports', 'ApiLeaderboardLeagues', 'ApiLeaderboardContestants',
    function(ApiLeaderboard, ApiLeaderboardSports, ApiLeaderboardLeagues, ApiLeaderboardContestants) {

        var getLeaderboard = function(query, callback){
            function cbSuccess(leaderboard){
                callback(null, leaderboard);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiLeaderboard.query(query, cbSuccess, cbError);
        };

        var getSports = function(callback){
            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardSports.query(cbSuccess, cbError);
        };

        var getLeagues = function(sportId, dateId, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardLeagues.query({sportId: sportId, dateId: dateId}, cbSuccess, cbError);
        };

        var getContestants = function(leagueId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardContestants.query({leagueId: leagueId}, cbSuccess, cbError);
        };



        return {
            getLeaderboard: getLeaderboard,
            getSports: getSports,
            getLeagues: getLeagues,
            getContestants: getContestants
        };
    }
]);
'use strict';

angular.module('fu').factory('Leagues', ['ApiLeagues',
    function(ApiLeagues) {

        var create = function(form, callback){

            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var league = new ApiLeagues(form);

            league.$save(cbSuccess, cbError);
        };

        var update = function(league, callback){

            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            league.$update({_id: league._id}, cbSuccess, cbError);

        };

        var get = function(leagueID, callback){
            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.get({_id:leagueID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.query(cbSuccess, cbError);

        };

        var del = function(league, callback){
            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }
            league = new ApiLeagues(league);
            league.$delete(cbSuccess, cbError);
        };

        var getContestants = function(leagueId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.getContestants({_id: leagueId}, cbSuccess, cbError);

        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getContestants: getContestants
        };
    }
]);
'use strict';

angular.module('fu').factory('Location', ['$resource', '$state',  function($resource, $state){
    var location = $resource('/api/location');
    var restrictedCountries = ['CA', 'US'];
    var currentLocation;

    var getCountry = function(callback){
        if(currentLocation){
            callback(currentLocation.country);
        } else {
            currentLocation = location.get(function(location){
                if(location){
                    callback(location.country);
                } else {
                    callback(null);
                }
            });
        }
    };

    var isRestricted = function(){
        var isRestricted;
        getCountry(function(country){
            if(country){
                isRestricted = restrictedCountries.indexOf(country) !== -1;
            } else {
                isRestricted =  false;
            }
        });
        return isRestricted;
    };

    var redirect = function(affiliateUrl){
        getCountry(function(country){
            if(country){
                if(restrictedCountries.indexOf(country) !== -1){
                    $state.go('static.offer-not-available');
                } else {
                    window.open(affiliateUrl, '_blank');
                }
            } else {
                window.open(affiliateUrl, '_blank');
            }
        });
    };

    return {
        isRestricted: isRestricted,
        redirect: redirect,
        getCountry: getCountry
    };
}]);
'use strict';

angular.module('fu').factory('MakePicks', ['ApiMakePicks', 'ApiMakePicksMenu',
    function(ApiMakePicks, ApiMakePicksMenu) {

        var getEvents = function(query, callback){

            function cbSuccess(picks){
                callback(null, picks);
            }

            function cbError(err){
                callback(err);
            }

            ApiMakePicks.get(query, cbSuccess, cbError);
        };

        var getMenu = function(callback){

            function cbSuccess(makePicksMenu){
                callback(null, makePicksMenu);
            }

            function cbError(err){
                callback(err);
            }

            ApiMakePicksMenu.query(cbSuccess, cbError);
        };

        var menu = [];
        var active = {};

        return {
            getEvents:  getEvents,
            getMenu:    getMenu,
            menu:       menu,
            active:     active
        };

    }
]);
'use strict';

angular.module('fu').factory('Mixpanel', [ 'Authentication',
    function(Authentication) {
        function updatePeopleProperties(user) {
            var values = {};

            values[prop.email] =  user.email;
            values[prop.name] = user.username;
            values[prop.following] = user.followingCount;
            values[prop.followers] = user.followerCount;
            values[prop.twitter] = user.twitterHandle;
            values[prop.loseStreak] = user.loseStreak;
            values[prop.winStreak] = user.winStreak;
            values[prop.firstName] = user.firstName;
            values[prop.lastName] = user.lastName;
            values[prop.premium] = user.premium;
            values[prop.premiumLifetime] = user.lifetimePremium;
            values[prop.trial] = user.trial;
            values[prop.units] = user.units;
            values[prop.verified] = user.verified;
            values[prop.oddsType] = user.oddsFormat;
            values[prop.active] = user.active;
            values[prop.pickMade] = user.pickMade;
            values[prop.accountType] = user.provider;
            values[prop.favoriteSport] = user.favoriteSportNew ? user.favoriteSportNew.name : user.favoriteSport;
            values[prop.joinDate] = user.created;
            mixpanel.people.set(values);
        }

        function minutesAgo(dateString) {
            var now = new Date();
            var past = new Date(dateString);
            var seconds = Math.abs(now - past)/1000;
            return Math.floor(seconds/60) % 60;
        }

        var eventSuper = {
            firstVisitOn: 'First Visit On',
            joinDate: 'Join Date',
            created: '$created',
            accountType: 'Account Type',
            favoriteSport: 'Favorite Sport'
        };

        var event = {
            pageViewed: "Viewed Page",
            joinClicked: 'Join Clicked',
            accountCreated: 'Create Account',
            accountVerified: 'Account Verified',
            login: 'Login',
            pickMade: 'Made Pick',
            hubFollowingTabClicked: 'Hub - Following Tab',
            hubProTabClicked: 'Hub - Pro Tab',
            getPremiumClicked: 'Get Premium Clicked'
        };

        var prop = {
            firstVisitOn: 'First Visit On',
            pagesViewedGuest: 'Pages Viewed: Guest',
            pagesViewedRegistered: 'Pages Viewed: Registered',
            joinClickFromFirstVisit: 'Join Click: Mins From First Visit',
            joinClickCount: 'Join Click: Count',
            joinClickFirstClicked: 'Join Click: First Clicked',
            joinFromFirstVisit: 'Join: Mins From First Visit',
            joinDate: 'Join: Date',
            getPremiumFirstCount: 'Get Premium: Count',
            getPremiumFirstClicked: 'Get Premium: First Clicked',
            getPremiumFromFirstVisit: 'Get Premium: Mins From First Visit',
            getPremiumFromJoin: 'Get Premium: Mins From Join',
            favoriteSport: 'Favorite Sport',
            accountVerifiedDate: 'Account Verified On',
            accountVerifiedFromJoin: 'Account Verified: Mins From Join',
            accountType: 'Account Type',
            email: '$email',
            name: '$name',
            created: '$created',
            following: 'Following',
            followers: 'Followers',
            twitter: 'Twitter Handle',
            loseStreak: 'Lose Streak',
            winStreak: 'Win Streak',
            firstName: 'First Name',
            lastName: 'Last Name',
            premium: 'Premium',
            premiumLifetime: 'Lifetime Premium',
            trial: 'Trial',
            units: 'Units',
            verified: 'Verified',
            oddsType: 'Odds Type',
            active: 'Active',
            pickMade: 'Pick Made'
        };

        var createAccount = function () {
            if(Authentication.user){
                var user = Authentication.user;
                var values = {};
                var supers = {};

                mixpanel.alias(user._id);

                values[prop.created] = user.created;
                values[prop.joinDate] = user.created;
                values[prop.joinFromFirstVisit] = minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn));
                mixpanel.people.set_once(values);

                updatePeopleProperties(user);

                // Add to the event supers to track
                supers[eventSuper.created] = user.created;
                supers[eventSuper.joinDate] = user.created;
                supers[eventSuper.accountType] = user.provider;
                supers[eventSuper.favoriteSport] = user.favoriteSportNew ? user.favoriteSportNew.name : user.favoriteSport;
                mixpanel.register(supers);

                // Track the Create Account event
                mixpanel.track(event.accountCreated, {
                    'Provider': user.provider,
                    'Odds Type': user.oddsFormat,
                    'Favorite Sport': user.favoriteSportNew ? user.favoriteSportNew : user.favoriteSport
                });
            }
        };

        var login = function(){
            if(Authentication.user){
                var user = Authentication.user;
                mixpanel.identify(user._id);
                updatePeopleProperties(user);
                mixpanel.track(event.login);
            }
        };

        var hubTabsClick = function(tab){
            var eventName;
            switch(tab){
                case 'following':
                    eventName = event.hubFollowingTabClicked;
                    break;
                case 'pro':
                    eventName = event.hubProTabClicked;
                    break;
            }
            if(eventName){
                mixpanel.track(eventName);
            }
        };

        var makePick = function(count, sports, leagues){
            mixpanel.track(event.pickMade, {
                'Sports': sports,
                'Leagues': leagues,
                'Count': count
            });
        };

        var joinClicked = function(page, cta) {
            mixpanel.track(event.joinClicked, {
                'Page': page,
                'CTA': cta
            });

            mixpanel.people.increment(prop.joinClickCount, 1);
            mixpanel.people.set_once(prop.joinClickFirstClicked, new Date());
            mixpanel.people.set_once(
                prop.joinClickFromFirstVisit,
                minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn))
            );
            //console.log("[MixPanel:joinClicked] First Visit On: " + mixpanel.get_property(eventSuper.firstVisitOn));
            //console.log("[MixPanel:joinClicked] Mins Ago: " + minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn)));
        };

        var getPremiumClicked = function(page, cta) {
            mixpanel.track(event.getPremiumClicked, {
                'Page': page,
                'CTA': cta
            });

            if (Authentication.user) {
                mixpanel.people.increment(prop.getPremiumCount, 1);
                mixpanel.people.set_once(prop.getPremiumFirstClicked, new Date());
                mixpanel.people.set_once(
                    prop.getPremiumFromFirstVisit,
                    minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn))
                );

                if (mixpanel.get_property(eventSuper.joinDate) && mixpanel.get_property(eventSuper.joinDate) !== "") {
                    mixpanel.people.set_once(
                        prop.getPremiumFromJoin,
                        minutesAgo(mixpanel.get_property(eventSuper.joinDate))
                    );
                }
            }
        };

        var accountVerified = function() {
            var now = new Date();
            var props = {};

            // Update the person
            props[prop.accountVerifiedDate] = now;
            props[prop.accountVerifiedFromJoin] = minutesAgo(mixpanel.get_property(prop.joinDate));
            mixpanel.people.set_once(props);

            // Track the event
            mixpanel.track(event.accountVerified, {});
        };

        var pageViewed = function(url, isGuest) {
            setTimeout(function() {
                var isFirstVisit = true;

                // If this is an authenticated user or the user already has a firstVisitOn date set, then
                // they are a returning user, so this isn't their first visit
                if (Authentication.user || mixpanel.get_property(eventSuper.firstVisitOn) ||  mixpanel.get_property(eventSuper.created)) {
                    isFirstVisit = false;
                }

                mixpanel.track(event.pageViewed, {
                    'Url': url,
                    'Guest': isGuest,
                    'First Visit': isFirstVisit,
                    'Viewed On': new Date().toISOString()
                }, function() {
                    var supers = {};
                    var createDate, firstVisitOn;

                    // only set firstVisitOn if this is in fact a returning visit
                    if (isFirstVisit) {
                        supers[eventSuper.firstVisitOn] = new Date().toISOString();
                    } else if (!isGuest || Authentication.user) {
                        /**
                         * FIX: October 1st Join Funnel Tracking Bug
                         *
                         * A bug was introduced on Oct 1st, 2015 when the Join Funnel Tracking update was made
                         * that gave existing users a First Visit On value of their most recent visit after
                         * Oct 1st, 2015, which isn't correct.
                         *
                         * These values will be corrected to be their created date instead as we don't know
                         * when they first visited the site.
                         */
                        createDate = new Date(Authentication.user.created);
                        firstVisitOn = mixpanel.get_property(eventSuper.firstVisitOn) ? new Date(mixpanel.get_property(eventSuper.firstVisitOn)) : new Date();

                        if (createDate.getTime() < firstVisitOn.getTime()) {
                            mixpanel.people.set(eventSuper.firstVisitOn, Authentication.user.created);
                            supers[eventSuper.firstVisitOn] = Authentication.user.created;
                        }
                    }

                    setTimeout(mixpanel.register(supers, 500));
                });

                // Increment the page view count for non-guests
                if (!isGuest) {
                    var pageViewed = isGuest ? prop.pagesViewedGuest : prop.pagesViewedRegistered;
                    mixpanel.people.increment(pageViewed, 1);
                }

                //console.debug("[MixPanel:pageViewed] Page: " + url + ", Is First Visit: " + isFirstVisit);
            }, 500);
        };

        return{
            createAccount: createAccount,
            login: login,
            makePick: makePick,
            hubTabsClick: hubTabsClick,
            joinClicked: joinClicked,
            pageViewed: pageViewed,
            accountVerified: accountVerified,
            getPremiumClicked: getPremiumClicked
        };
    }
]);
'use strict';

angular.module('fu').service('Page', ['$location', function($location) {
    var meta = {
        title: 'FansUnite | Sports Betting Social Network',
        description: 'Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'sports betting social network, sports betting community, bet tracking'
    };

    return {
        meta: meta
    };
}]);

'use strict';

angular.module('fu').factory('Picks', ['ApiPicksComments', 'ApiPicks',
    function(ApiPicksComments, ApiPicks) {

        var getComments = function(pick, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPicksComments.query({pick:pick._id}, cbSuccess, cbError);
        };

        var newComment = function(pick, text, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }


            var pickComment = new ApiPicksComments({pick:pick._id, text:text});

            pickComment.$save(cbSuccess, cbError);
        };

        var commentReply = function(pick, comment, replyIndex, replyUser, text, callback){
            function cbSuccess(comments){
                console.log(comments);
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }


            var commentReply = {
                _id: comment._id,
                pick: pick._id,
                text: text,
                replyIndex: replyIndex,
                replyUser: replyUser
            };
            console.log(commentReply);

            commentReply = new ApiPicksComments(commentReply);
            commentReply.$update(cbSuccess, cbError);
        };

        var resolve = function(pick, callback){
            function cbSuccess(pick){
                callback(null, pick);
            }

            function cbError(response){
                callback(response.data.message);
            }

            pick = new ApiPicks(pick);
            pick.$resolve(cbSuccess, cbError);
        };




        return {
            getComments: getComments,
            newComment: newComment,
            commentReply: commentReply,

            resolve: resolve
        };
    }
]);
'use strict';

angular.module('fu').factory('Propicks', ['ApiPropicksSport', 'ApiPropicksLeague', 'ApiPropicksAll', 'ApiPropicksSportTotals', 'ApiPropicksLeagueTotals',
    function(ApiPropicksSport, ApiPropicksLeague, ApiPropicksAll, ApiPropicksSportTotals, ApiPropicksLeagueTotals) {

        var getAll = function(callback){
            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksAll.query({}, cbSuccess, cbError);
        };

        var getBySport = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksSport.get({}, cbSuccess, cbError);

        };

        var getByLeague = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksLeague.get({}, cbSuccess, cbError);

        };


        var getTotalsBySport = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksSportTotals.query({}, cbSuccess, cbError);

        };

        var getTotalsByLeague = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksLeagueTotals.query({}, cbSuccess, cbError);

        };

        return {
            getAll:      getAll,
            getBySport:  getBySport,
            getByLeague: getByLeague,
            getTotalsBySport: getTotalsBySport,
            getTotalsByLeague: getTotalsByLeague
        };
    }
]);
'use strict';

angular.module('fu').factory('Search', ['ApiSearch',
    function(ApiSearch) {

        var search = function(text, callback){
            function cbSuccess(results){
                callback(null, results);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSearch.query({text:text}, cbSuccess, cbError);
        };

        return {
            search: search
        };
    }
]);
'use strict';

angular.module('fu').service('SocketChannel', ['$timeout', function($timeout) {

    this.connect = function () {
        this.socket = io.connect(location.host+'/channel');
    };

    this.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
}]);
'use strict';

angular.module('fu').service('SocketHub', ['$timeout', function($timeout) {

    this.connect = function () {
        this.socket = io.connect(location.host+'/hub');
    };

    this.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
}]);
'use strict';

angular.module('fu').service('SocketUser', ['$timeout', function($timeout) {

    this.connect = function () {
        this.socket = io.connect(location.host+'/user');
    };

    this.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
}]);
'use strict';

angular.module('fu').factory('Sports', ['ApiSports', 'ApiSportsResolvelist',
    function(ApiSports, ApiSportsResolvelist) {

        var create = function(form, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var sport = new ApiSports(form);

            sport.$save(cbSuccess, cbError);
        };

        var update = function(sport, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            sport.$update({_id: sport._id}, cbSuccess, cbError);

        };

        var get = function(sportID, callback){
            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.get({_id:sportID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.query(cbSuccess, cbError);

        };

        var del = function(sport, callback){
            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }
            sport = new ApiSports(sport);
            sport.$delete(cbSuccess, cbError);
        };

        var getLeagues = function(sportId, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getLeagues({_id: sportId}, cbSuccess, cbError);

        };

        var getContestants = function(sportId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getContestants({_id: sportId}, cbSuccess, cbError);

        };

        var getGroups = function(sportId, callback){
            function cbSuccess(groups){
                callback(null, groups);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getGroups({_id: sportId}, cbSuccess, cbError);

        };

        var getResolveList = function(callback){

            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSportsResolvelist.query(cbSuccess, cbError);

        };

        var getResolveEvents = function(sportId, callback){


            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            console.log(sportId);
            ApiSports.getResolveEvents({_id: sportId}, cbSuccess, cbError);

        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getLeagues: getLeagues,
            getContestants: getContestants,
            getGroups: getGroups,

            getResolveList: getResolveList,
            getResolveEvents: getResolveEvents
        };
    }
]);
'use strict';

angular.module('fu').factory('SportsbookService', ['$resource', '$sce', '$filter', 'Location',  function($resource, $sce, $filter, Location) {

    var defaultRank = [
        'Pinnacle', 'Bet365', '5Dimes', 'William Hill', 'Ladbrokes', 'BetCRIS', 'Sports Interaction', 'Bovada', 'Bookmaker','BetFair'
    ];

    var remainder = [
        'Bet365', 'William Hill', 'Ladbrokes', 'BetFair', 'Pinnacle'
    ];

    var countryRank = {
        'BR':['Ladbrokes', 'Bet365'], //Brazil
        //'AR':[], //Argentina
        //'MX':[], //Mexico
        'GB':['Bet365', 'Ladbrokes', 'William Hill'], //UK
        'AU':['Bet365'], //Australia
        'NZ':['Bet365'], //New Zealand
        'ES':['Bet365', 'William Hill', 'BetFair'], //Spain
        'SE':['Bet365'] //Sweden
    };

    var sportsbooks = [
        {
            name: '5Dimes',
            affiliateUrl: 'http://affiliates.5dimes.com/tracking/Affiliate.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000',
            depositMethods:[
                ['Credit Card', 'Neteller', 'Skrill'],
                ['Click2Pay', 'Money Order', 'Cheque']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Cheque', 'Click2Pay', 'Skrill'],
                ['Money Order', 'Neteller', 'Visa']
            ],
            bonus: true,
            newAccountBonus: '50% Match Bonus up to $200',
            bonuses: [
                {type:'New Account', bonus:'50% Match Bonus up to $200'}
            ],
            restricted: ['France'],
            grade: 'B+',
            banner: $sce.trustAsHtml('<a href="http://affiliates.5dimes.com/tracking/Affiliate.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000" target="_top">'+
                '<img src="http://affiliates.5dimes.com/tracking/banner.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000" hspace="0" vspace="0" border="0" alt="Bet at 5Dimes"></a>'),
            overview: '5 Dimes is another book that is amongst the best and is on the same level as Pinnacle Sports and Bet 365. 5 Dimes’ specialty and reputation lies in the extensive selections and alternate lines that it offers. 5 Dimes offers many options for many sporting events. They are a little light in their soccer offerings, but other than that it is absolutely first class. For our American friends, this is the top sports book that allows American users. It is an extremely reliable book that has been in business since 1999. They are financially stable, offering a huge selection of wagering options, and are reliable in their deposits and payouts. For the experienced and professional bettor, 5 Dimes is a wonderful option due to the sheer variety of betting options they have. Simply, they are one of the best in the industry and a great choice for all. The reason why we rate 5 Dimes a grade below the elite books is that their live betting options are quite substandard. Very few events allow for live betting on 5 Dimes, and often, live betting is only available during game breaks. ',
            interface: ' 5 Dimes philosophy for their interface is to keep it simple. There is a massive array of betting options, but they keep everything clean and straightforward. The site is well organized and easy to navigate. Further, there are drop down boxes to allow a user to buy points to have even more alternate lines. While their website interface is appealing for its simplicity, the mobile version is actually quite cumbersome to use. It is not very user friendly and requires a lot of zooming in and out in order to navigate to the wager selection that is desired. ',
            offerings: 'As stated previously, 5 dimes has the most variations in selections for a given event. Their alternate line options are superb, and they reduced juice on virtually all events. Obviously, this is extremely important for any serious bettor as the differences in price will accumulate quickly. 5 Dimes covers many events but is a little short in their soccer offerings. Additionally, their live betting offerings are quite poor. Anyone whose focus is on live betting should use 5 Dimes as one of their sports books as opposed to being their primary book. ',
            cashReview: 'Excellent. Importantly, 5 Dimes is one of the most financially stable sports books. This is important as it helps ensure that they will payout. 5 Dimes has many deposit and withdrawal methods that occur without issue. For American users, we have found that withdrawal by Cheque is the best method. There is a $40-$50 fee to get a cheque via courier, but the money will be received in about 3 business days. The cheque will be written by a payment company so your bank will have no idea that the cheque is from a sports book. ',
            customerService: 'Our only complaint with the customer service of 5 Dimes is that they do not have an online chat system in place. For quick questions, this would be much easier for the user. 5 Dime allows customer service inquiries via email, fax, and phone. When required, the user needs to visit the customer service page, which lists contact phone numbers for questions in different inquiry areas. ',
            depositReview: 'All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, but the minimum deposit amounts are either $50 or $100, dependent on the deposit method. ',
            withdrawalReview: 'This may be regionally dependent, but from what we find, all withdrawals are free.',
            languages: [['English', 'Spanish']],
            screenshot: false
        },
        {
            name: 'Bet365',
            affiliateUrl: 'http://imstore.bet365affiliates.com/Tracker.aspx?AffiliateId=73547&AffiliateCode=365_317245&CID=194&DID=211&TID=2&PID=149&LNG=1',
            depositMethods:[
                ['Bank Transfer', 'Bank Wire', 'Cheque', 'Click2Pay', 'EntroPay', 'Instadebit', 'Maestrocard'],
                ['Master Card', 'Money Bookers', 'Neteller', 'Paypal', 'Paysafe', 'U-kash', 'Visa']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Bank Wire', 'Cheque', 'Click2Pay', 'Instadebit', 'Maestro'],
                ['Mastercard', 'Moneybookers', 'Neteller', 'Paypal', 'Visa']

            ],
            bonus: true,
            newAccountBonus: '100% Initial Deposit Bonus (up to $200)',
            bonuses: [
                {type:'Reload', bonus:'None'},
                {type:'Loyalty', bonus:'Yes. Accounts are reviewed weekly. Most frequent is a $20 Loyalty Bonus every few weeks.'},
                {type:'New Account', bonus:'100% Initial Deposit Bonus (up to $200)'}],

            restricted: ['Belgium', 'France', 'USA'],
            grade: 'A',
            banner:  $sce.trustAsHtml(' <object type="application/x-shockwave-flash"'+
                'id="a136a6f7c68ab4a6dac1a77366a2374ae"'+
                'data="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=2&amp;PID=149&amp;LNG=1&amp;ClickTag=http%3a%2f%2fimstore.bet365affiliates.com%2fTracker.aspx%3fAffiliateId%3d73547%26AffiliateCode%3d365_317245%26CID%3d194%26DID%3d211%26TID%3d2%26PID%3d149%26LNG%3d1&amp;Popup=true"'+
                'width="765"'+
                'height="90">'+
                '<param name="movie" value="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=2&amp;PID=149&amp;LNG=1&amp;ClickTag=http%3a%2f%2fimstore.bet365affiliates.com%2fTracker.aspx%3fAffiliateId%3d73547%26AffiliateCode%3d365_317245%26CID%3d194%26DID%3d211%26TID%3d2%26PID%3d149%26LNG%3d1&amp;Popup=true" />'+
                '<param name="quality" value="high" />'+
                '<param name="wmode" value="transparent" />'+
                '<param name="allowScriptAccess" value="always" />'+
                '<param name="allowNetworking" value="external" />'+
                '<a href="http://imstore.bet365affiliates.com/Tracker.aspx?AffiliateId=73547&amp;AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=1&amp;PID=149&amp;LNG=1" target="_blank">'+
                '<img src="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=1&amp;PID=149&amp;LNG=1" style="border:0;" alt="bet365"></img></a>'+
                '</object>'),
            overview: 'Bet365 has quickly become an extremely popular sports book due to their sterling reputation regarding their service, support, and payout system. Bet365 offer more than just sports betting as well, with platforms existing for Bingo, Lottery, Poker, and Casino Games. As a result, their gaming platform can satisfy both recreational and serious players. Bet 365’s standout feature is their live (in-play) betting platform. They offer live betting on many matches across a variety of sports and leagues. Impressively, they also feature live streams of the matches where available. If there is not a live stream for the match, they have a fluid game center that allows bettors to follow the action. Their gaming operations are licensed and regulated by the government of Gibraltar.  For anyone considering live (in-play) betting, Bet 365 is the premier sports book.',
            interface: 'Bet 365 offers the most impressive interface in the sports betting world. The interface is extremely easy to use, with a constant betting menu along the left side and a betting slip along the right. The center of the screen is where players can select their wagers. The color scheme is aesthetically appealing, whilst remaining subdued enough that a user can spend hours on the site. The only drawback with Bet 365’s interface is that it is flash based. What this means is that users cannot complete a search on a page to find the match they are looking for. This can be an issue when browsing Europa League Qualifiers, wherein there can be 30 matches, and attempting to find the team you would like to back! Bet 365’s mobile experience is top notch. It is easy to navigate the various betting menu’s, as well as to make any wagers. Really, their mobile interface is almost as good as their full website experience.',
            offerings: 'Bet 365 does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Bet 365 has one of the more comprehensive sport offerings that we have seen. As stated above, platforms exist for Bingo, Lottery, Poker, and Casino Games as well. Again, Bet 365 have the premier live (in-play) betting platform amongst sports books. Their live high-definition stream of a variety of matches is a massive asset for players.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Bet 365 an Excellent Cashier rating. Bet 365 has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Bet 365 are subject to arbitration through the IBAS (Independent Betting Adjudication Service), who settle disputes between gaming companies.',
            customerService: 'Bet 365 offers customer support 24 hours a day, 7 days a week. Their customer support is reachable in a variety of ways. Bet 365 offers customer support via live chat, email, call back service, fax, and phone. In our experience, their agents reply quickly and efficiently, and address any concerns adequately. Bet 365 has an excellent customer service rating in our books.',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, save for Bank Transfers, which are only free if you deposit a minimum amount.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, all withdrawals are free. Bank Wire and Bank Transfers only allow one free withdrawal every 28 days.',
            languages: [
                ['Bulgarian','Chinese','Czech','Danish','English','German', 'Greek','Hungarian'],
                ['Italian', 'Norwegian','Polish','Portuguese','Romanian','Slovakian','Spanish','Swedish']
            ],
            screenshot: true
        },
        {
            name: 'BetCRIS',
            affiliateUrl: '',
            depositMethods:[
                ['Bank Draft', 'Bank Wire', 'Credit Card', 'Click2Pay'],
                ['Entropay', 'Neteller', 'P2P', 'Skrill']
            ],
            withdrawalMethods:[
                ['Bank Draft – Minimum $100 withdrawal; max $2,500 per transaction', 'Bank Wire', 'Click2Pay'],
                ['Skrill – Minimum $25 withdrawal; Max $10,000 per transaction; up to $50,000 weekly']
            ],
            bonus: true,
            newAccountBonus: '15% Welcome Bonus(up to $500)',
            bonuses: [
                {type:'Reload', bonus:'10% reload bonus up to $500'},
                {type:'New Account', bonus:'15% Welcome Bonus(up to $500)'}
            ],
            restricted: ['USA'],
            grade: 'B+',
            banner: '',
            overview: 'BetCRIS stands for Bet Costa Rica International Sports and have been in business since 1985, when they were established as the first offshore sports book. BetCRIS were either the first, or one of the first to be a part of the online sports book industry. As expected, since they have been around for so long, BetCRIS have optimized their product and are now amongst the best online sportsbooks available. Their betting market coverage is exceptional, and their customer service is top notch. BetCRIS have an extremely stable financial situation and have a part in a number of land based gaming business around the world, including in Dominican Republic, Ecuador, Peru, Honduras, Guatemala, Venezuela, and Mexico. Other companies under the BetCRIS umbrella are Bookmaker and Diamond Sportsbook. Some sports books will limit payouts to smaller sums, but BetCRIS offers a $50,000 weekly maximum payout upon signup. If you are looking for a dependable and easy to use sportsbook, then BetCRIS may be your best bet.',
            interface: 'BetCRIS employs an extremely intuitive and professional layout style for their interface. There is the constant betting menu on the left as well as the featured matches in the middle. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. It is a simple and effective platform and one that we can gladly recommend. We aren’t giant fans that BetCRIS requires the use of a drop down menu to access their live betting options, but that is a relatively minor issue. Importantly, their page is completely searchable in order to quickly find the exact event you are looking for. BetCRIS does not use many scripts, just static HTML, so their interface is quite responsive. ',
            offerings: 'BetCRIS does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Bet CRIS has one of the more comprehensive sport offerings that we have seen. Additionally, BetCRIS have a massive range of prop bets available for the major North American sports. If there is an event you want to wager on that is not available on BetCRIS, you can email them and they will consider releasing odds for you. Their live betting offerings are quite poor, however, and that is one reason we don’t rank them amongst the elite. ',
            cashReview: 'Excellent. BetCRIS have a terrific payout record and we have absolutely zero qualms about recommending them. Users have constantly provided positive feedback in regards to how easy it is to withdraw large sums from BetCRIS. As stated previously, all new players are automatically eligible to withdraw up to $50,000 a week. ',
            customerService: 'BetCRIS has a big bilingual staff and are known for their quick and clear service. They offer customer service through three methods – email support, toll-free phone support, and live chat. BetCRIS prides themselves on their great customer service. Most email inquiries will be addressed within 15 minutes. Moreover, hold time on phone inquiries are usually quite low. ',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, but most require a minimum deposit amount.',
            withdrawalReview: '',
            languages: [['English', 'French', 'Chinese', 'Portuguese', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Bovada',
            affiliateUrl: 'http://record.bettingpartners.com/_G1jpQTLp4eIUbyPgnoR23mNd7ZgqdRLk/1/',
            depositMethods:[
                ['Bank Wire', 'Credit Cards', 'Moneygram', 'Western Union']
            ],
            withdrawalMethods:[
                ['Bank Wire', 'Courier Cheque', 'Moneygram', 'Western Union']
            ],
            bonus: true,
            newAccountBonus: '50% Welcome Bonus (up to $250)',
            bonuses: [
                {type:'New Account', bonus:'50% Free play (up to $250)'}
            ],
            restricted: ['Canada', 'UK'],
            grade: 'B',
            banner: $sce.trustAsHtml('<script type="text/javascript" src="http://js.bettingpartners.com/javascript.php?prefix=G1jpQTLp4eKYLQPVBzQgNGNd7ZgqdRLk&amp;media=6378&amp;campaign=1"></script> <iframe allowtransparency="true" src="http://ff.connextra.com/BODOG/selector/client?client=BODOG&placement=Bodog_Sports_BetonSports_728x90&cxt_aff_id=G1jpQTLp4eJI6ooFPD8EIe51t5g1cLjN" width="728" height="90" scrolling="no" frameborder="0" style="border-width:0"></iframe>'),
            overview: 'On December 14th, 2011, Bodog changed their domain name for U.S. players to Bovada. Bovada features the same platform, customer service, and betting options that existing Bodog customers are accustomed to. The Bovada brand is exclusively for use by U.S. customers. From here on out, we are going to refer to Bovada/Bodog as Bovada, since they are the same thing. Bovada is a respectable company that is quick to realize their shortcomings. They always payout, but we really appreciate that they will be the first to admit if processing times in the U.S. are going to take longer, for whatever reason. They are reliable, and their transition from Bodog to Bovada was seamless. Bovada are quickly becoming a popular online sports book. Due to their issues in 2011, we can’t rank them as highly as others. That being said, they are a professional and appealing book. They cater more to recreational bettors and we would not recommend it as a staple book for more serious bettors. ',
            interface: 'Bovada have a simple stylistic approach, which allows new users to jump right in to the action. Anyone who has visited a betting site previously should be comfortable with Bovada’s layout. Bovada’s software was updated in 2011. Since the upgrade, everything works smoothly, functions well, and looks good on all platforms, including their mobile version. ',
            offerings: 'Bovada are a North American book that is, consequently, geared primarily towards North American sports. While they do cover many global sports, generally the leagues covered will only be the major ones. If you are only concerned with wagering on the top soccer leagues and major sporting events, then Bovada will work for you just fine. If you are looking for value in some more obscure regions, then Bovada will not be a fit. One of our major issues with Bovada is that they typically offer poor odds for favorites. Again, this is because they are geared mostly towards recreational bettors. ',
            cashReview: 'Excellent. Bovada are a financially stable book that has always paid out. Users should have little to no fear that Bovada will fail to pay out. They have consistently paid players in a timely manner and seem to genuinely resolve any potential issues. ',
            customerService: 'Bovada’s Customer Service platform is amongst the best in the industry. As stated previously, Bovada’s agents seem to genuinely care about the players issue and will fix the problem. Bovada’s Customer Service department is reachable by phone or email 24/7. ',
            depositReview: 'Bovada will only cover Western Union and MoneyGram fees for deposits of $300 or more. ',
            withdrawalReview: 'Withdrawal by MoneyGram or Western Union is only available if the user deposited through the same method. Bovada offers U.S. players one free check withdrawal per month. Checks generally take about one week to be received. ',
            languages: [['English']],
            screenshot: true
        },
        {
            name: 'BetFair',
            affiliateUrl: 'http://ads.betfair.com/redirect.aspx?pid=1260644&bid=8663',
            depositMethods:[
                ['Bank Wire', 'Cheques', 'Credit Card', 'Entropay'],
                ['E-Wallet', 'Moneybookers', 'Neteller']
            ],
            withdrawalMethods:[
                ['Bank Wire', 'Cheques', 'Credit Card', 'Entropay'],
                ['E-Wallet', 'Moneybookers', 'Neteller']
            ],
            bonus: true,
            newAccountBonus: '$50 Free Bet',
            bonuses: [
                {type:'New Account', bonus:'$50 Free Bet'}
            ],
            restricted: ['USA','France', 'Germany', 'Greece', 'China', 'Japan', 'Turkey'],
            grade: 'B',
            banner: $sce.trustAsHtml('<iframe allowtransparency="true" src="http://ads.betfair.com/ad.aspx?bid=9295&pid=1260644" width="728" height="90" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>'),
            overview: 'In 2011, BetFair decided to become a bookmaker. Prior to 2011, BetFair was a betting exchange, which linked players wanting to make a corresponding wager. It was a revolutionary idea that opened up a new market, but BetFair decided to take part in the fixed odds market. They still offer the betting exchange market, but their standard fixed odds platform is quite good. The BetFair Sports Book was launched in 2012 as a highly respected betting exchange. Their range of betting markets exceeds that of any other sports book in the industry and the ability to wager in a sports book or against other community members is an exciting option. Players have the ability to negotiate prices on bets when dealing with community members. ',
            interface: 'BetFair have a pretty simple interface that is responsive and stable. The menu bar at the top will be used for most navigation, whilst the center of the screen is taken up by most of the betting overview screens. The color scheme is aesthetically appealing, whilst remaining subdued enough that a user can spend hours on the site. The main way to find lines is to visit the game centers for the market you are looking for. It can be a bit cumbersome, but everything you need is available quickly. ',
            offerings: 'BetFair does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. BetFair has one of the more comprehensive sport offerings that we have seen, perhaps due to their exchange market encouraging the creation of ‘new’ markets. Their live betting platform has a lot of markets available for selection. They also offer BetFair TV, which allows for live streaming of select events. ',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows BetFair an Excellent Cashier rating. BetFair has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. BetFair’s security system is accredited with ISO 27001 Certification.',
            customerService: 'BetFair’s sports book is a little different than most, so they offer an extremely helpful help center, which has a repository of questions related to maximizing your BetFair experience. Their Customer Service department can be reached through email, telephone, or mail. ',
            depositReview: '',
            withdrawalReview: 'Withdrawals are performed through the same channel as the deposit was made. ',
            languages: [['English', 'Chinese', 'German', 'Italian', 'Finnish', 'Russian', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Bookmaker',
            affiliateUrl: '',
            depositMethods:[
                ['Credit Card', 'Bank Wire', 'Bank Draft', 'Click2Pay', 'Neteller'],
                ['ECO', 'Moneygram', 'Paysafecard', 'JCB', 'MoneyBookers']
            ],
            withdrawalMethods:[
                ['Bank Draft', 'Bank Wire', 'Click2Pay', 'Eco', 'Neteller', 'MoneyBookers']

            ],
            bonus: true,
            newAccountBonus: '15% Free Play',
            bonuses: [
                {type:'New Account', bonus:'15% Free Play'},
                {type:'Reload', bonus:'Yes, 10% Free Play'},
                {type:'Loyalty', bonus:'Yes, Bet point loyalty program which can be exchanged for free bets'},
            ],
            restricted: ['France'],
            grade: 'B',
            banner: '',
            overview: 'BookMaker could just as easily be ranked as the top sports book out there as it could be in ninth in our rankings. It really is up to personal preference and we understand why many have BookMaker amongst the top. BookMaker is regarded so highly by other sports books, that most books will not even release their lines unless they have checked to see that BookMaker have established their numbers. To that end, BookMaker is the first place that you will see lines posted each night. BookMaker also do not limit winnings. Many players have complained about sports books limiting their wagers if they are doing well. That will not happen at BookMaker, where they will payout $100 just as happily as $100,000. This is a very large and established operation that is geared towards a sophisticated player. We would not recommend this book for beginners. BookMaker are operated by the same management as BetCRIS, making them one of the more stable sports book groups. BookMaker has over 25 years of experience, a flawless payout history, and a respected reputation amongst players and fellow sports books. ',
            interface: 'Well, as we stated, BookMaker are geared to more sophisticated users and that sentiment rings through with their interface. With arguably the most rudimentary bare bones interface offering out there, BookMaker promotes a no frills look. That being said, BookMaker has absolutely everything you could possibly need present, it’s just a very simplistic design. There is not necessarily anything wrong with that, it is completely up to personal preference. As with many books, the sports navigation menu is a constant on the left hand side. ',
            offerings: 'BookMaker does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. BookMaker has one of the more comprehensive sport offerings that we have seen. They offer a great amount of prop bets, as well, if that’s your thing. BookMaker’s Live Betting offerings are amongst the best in the industry. Despite offering the standard updating lines for main plays, BookMaker also offers play-by-play betting lines on prop bets, such as Next Player to Score, Yards Gained, and many more! Their live-betting lines extend to the majority of televised sporting events, which is quite comprehensive. ',
            cashReview: ': Excellent. Quick withdrawals, without issue, and easy deposits allows BookMaker an Excellent Cashier rating. BookMaker has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. They have a flawless payout history, extending well over 25 years. Players should have zero hesitation in depositing with BookMaker.',
            customerService: 'BookMaker has an outstanding Customer Service department. Our only issue is that Customer Service is only available in English, Spanish, and Chinese. Communicating through email can lead to reply times of up to two days, but their phone service and live chat are excellent. Don’t bother emailing BookMaker’s customer service department. Use the Live Chat or call them!',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, most withdrawal methods have corresponding fees. ',
            languages: [['English', 'Chinese', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Ladbrokes',
            affiliateUrl: 'http://online.ladbrokes.com/promoRedirect?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4',
            depositMethods:[
                ['Credit Card', 'Bank Transfer', 'PayPal',  'ClickandBuy'],
                ['Neteller', 'Western Union', 'UKash', 'Moneybookers']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'ClickandBuy', 'Moneybookers'],
                ['Neteller', 'Paypal', 'UKash']
            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $100',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $100'}
            ],
            restricted: ['France', 'Turkey', 'USA'],
            grade: 'B+',
            banner: $sce.trustAsHtml(' <a href="http://online.ladbrokes.com/promoRedirect?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4"><img src="http://online.ladbrokes.com/promoLoadDisplay?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4" width="728" height="90"/></a>'),
            overview: 'Arguably, Ladbrokes is the biggest name in betting. Ladbrokes is listed on the London Stock Exchange, so a user can have confidence that the company is transparent and financially stable. In addition to their online services, Ladbrokes has over 2,400 betting shops in the United Kingdom and Ireland. Ladbrokes is an excellent choice for recreational and serious bettors. Thanks to their use of the Orbis Technology software, their platform runs flawlessly. Their mobile site is also very good. Ladbrokes offers a massive range of sports and events, as well as a comprehensive live betting suite. In our opinion, Ladbrokes is perfect for the recreational bettor. We would not recommend it for an experienced or professional bettor as we aren’t thrilled with many of the margins. Moreover, they just don’t have some of the added perks, like comprehensive live streaming, which we really appreciate in other books. That being said, they are a no nonsense company which covers all the events you could ask for. They are a mainstay in the betting company and will play a major role in the industry for years to come.',
            interface: 'Ladbrokes employs an extremely intuitive and professional layout style for their interface. There is the constant betting menu on the left as well as the featured matches in the middle. One issue we have with Ladbrokes is that there is almost too much presented at once and that amount of visual real estate is daunting. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. It is a simple and effective platform and one that we can gladly recommend.',
            offerings: 'We aren’t thrilled with the margins that Ladbrokes employs, and that leads us to recommend the company for a recreational bettor, more so than a professional. As any experienced bettor knows, the little margins can make a big difference in the long run. They do cover many leagues, but nothing that is extraordinary. Additionally, they only offer live streams for racing events. Their live betting coverage is very good.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Ladbrokes an Excellent Cashier rating. Ladbrokes has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Ladbrokes are subject to arbitration through the IBAS (Independent Betting Adjudication Service), who settle disputes between gaming companies.',
            customerService: ':  Ladbrokes have extremely impressive customer service. Their agents are known for being able to support in multiple languages. Ladbrokes offers 24/7 customer service via live chat, email, or phone. They usually respond to emails within one or two hours. Impressively, they recently added the live chat option and support in several languages (English, Spanish, Italian, German, Swedish, Norwegian, Finnish, Danish, Turkish, Greek, Portuguese, Thai, Bulgarian, Croatian, Romanian, Russian, Slovenian, Slovak, Czech, and Russian).',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, all withdrawals are free.',
            languages: [['English', 'Spanish', 'Italian', 'German', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Turkish']],
            screenshot: true
        },
        {
            name: 'Pinnacle',
            affiliateUrl: 'http://affiliates.pinnaclesports.com/processing/clickthrgh.asp?btag=a_11567b_6346&aid=',
            depositMethods:[
                ['Bank Transfer', 'Click & Buy', 'Entropay',  'Idebit'],
                ['Instadebit', 'MasterCard', 'Visa', 'Ukash']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Click & Buy', 'Entropay',  'E-cheque', 'Idebit'],
                ['Instadebit', 'MasterCard', 'Visa', 'Ukash']
            ],
            bonus: false,
            bonuses: [
                {type:'Reload', bonus:'None'},
                {type:'Loyalty', bonus:'None'},
                {type:'New Account', bonus:'None'}
            ],
            restricted: ['France', 'Netherlands', 'Turkey', 'USA'],
            grade: 'A',
            banner: $sce.trustAsHtml('<a onclick="window.open(this.href,"_blank");return false;" href="http://affiliates.pinnaclesports.com/processing/clickthrgh.asp?btag=a_11567b_1129&aid=" ><img src="http://affiliates.pinnaclesports.com/processing/impressions.asp?btag=a_11567b_1129&aid=" style="border:none;width:728px;height:90px;" border=""></a>'),
            overview: 'Pinnacle Sports was founded in 1998 and is headquartered in Curacao. Pinnacle has become one of the largest and most trusted sports books in the gaming industry. Despite voluntarily exiling themselves from the US market in 2007, Pinnacle Sports has had sustained positive growth. Pinnacle Sports are a sportsbook that every serious bettor should utilize. They offer the smallest margins in the industry, which often results in the best prices for bettors. Their interface is simple and professional, if not aesthetically appealing. We highly recommend Pinnacle Sports as the dependable and trustworthy industry standard. Due to their low juice lines, any serious bettor should have Pinnacle Sports as a part of their betting arsenal.',
            interface: 'Perhaps the only disappointing element of Pinnacle Sports is the betting interface. However, this critique is on an aesthetic level and is very much up to personal preference. Generally, the interface seems a little outdated and can be cumbersome to navigate. The sports navigation area consists of a two-column page with drop down menus to select sports and their corresponding sub-categories (leagues). Sports that have lines that are eligible to be played are given an orange triangle identifier for ease of navigation. The odds display is unspectacular but functional. The line overview for a given league takes up the width of the display and functions as a giant input form. This is contrasted with many other sports books that will allow the user to click on a bet which is then added to their betting slip. The maximum accepted wager amounts are displayed when you hover your mouse over a wager input form. The mobile experience is not much better, which makes it difficult to quickly find the game or games you are interested in playing.',
            offerings: 'Pinnacle does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Pinnacle also offers a wide variety of niche markets such as entertainment props, politics, e-sports, and poker. Our major complaint with Pinnacle’s offerings is their lack of a robust live betting offering. Pinnacle only has live betting for selected leagues. Additionally, Pinnacle does not continuously update their odds as the games are in play. For example, live betting baseball selections are suspended during the inning and are only available for betting at the half inning. We have seen recent improvements in their live betting offerings and are hopeful that they will continue to improve.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Pinnacle Sports an Excellent Cashier rating.',
            customerService: 'Pinnacle offers customer support 24 hours a day, seven days a week, 365 days a year. However, there is no live chat option or even a phone number to contact support. Instead, all inquiries and follow-up questions that could be handled in minutes via a live chat platform may take multiple email exchanges with Pinnacle. While they are generally good at answering questions comprehensively, it is still an annoyance having to wait for an email exchange. That being said, once contacted, customer service is excellent and the service department works diligently to make sure all of your needs are met. It is important to remember that customer service is done primarily through email in order to keep costs low. Pinnacle Sports is so efficient and well run that there rarely are customer service issues that need to be addressed.',
            depositReview: 'While deposit methods are not as numerous as with other sports books, all the options are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'For each of the deposit methods there is a corresponding withdrawal method on the same platform. Additionally, players may request an E-cheque as a withdrawal option. The first withdrawal each month is free, with subsequent withdrawals incurring a fee dependent on withdrawal method.',
            languages: [
                ['Chinese','English','Finnish','French','German', 'Hebrew','Italian', 'Japanese'],
                ['Norwegian','Polish','Portuguese','Russian','Spanish','Swedish', 'Thai']
            ],
            screenshot: true
        },
        {
            name: 'Sports Interaction',
            affiliateUrl: 'http://affiliate.sportsinteraction.com/processing/clickthrgh.asp?btag=a_7891b_334',
            depositMethods:[
                ['Credit Card', 'Instadebit', 'Instant Banking',  'Speedcard', 'MoneyBookers', 'Neteller', 'Ecocard'],
                ['Ukash', 'Swiff', 'UseMyFunds', 'Money Order', 'Certified Check', 'Cashier\'s Check']
            ],
            withdrawalMethods:[

            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $125',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $125'}
            ],
            restricted: ['Australia', 'France', 'USA'],
            grade: 'B',
            banner: $sce.trustAsHtml('<a href="http://affiliate.sportsinteraction.com/processing/clickthrgh.asp?btag=a_7891b_334"  ><img src="http://affiliate.sportsinteraction.com/processing/impressions.asp?btag=a_7891b_334" alt=“Sports Interaction”  style="border:none; width:728px;  height:90px; "/></a>'),
            overview: 'Sports Interaction is based out of Quebec, Canada and has been online since 1997. The first thing you will notice when you visit Sports Interaction is the professional and enticing platform that greets you. Sports Interaction is an online sports book that offers a clean and no frills platform for all your betting needs. It is commonly referred to as SIA and has an experienced team behind it. Although their live betting platform can be a little lacking at times, as well as odds that aren’t the most consumer friendly, Sports Interaction is a great starter book and one that you can grow with in the future. ',
            interface: 'Sports Interaction has one of our favorite betting interfaces in the market. They really utilize graphics well to add even more excitement for a user. While it may not be appealing for a professional, the entertainment factor is a plus in our books. Additionally, the bright blue color scheme, when contrasted with the orange text is quite aesthetically pleasing. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. One massive advantage they have over Bet 365 is that Sports Interaction’s pages are searchable and you can find the match you want quite quickly. The colors utilized allow the user to spend a long time on the platform without getting sick of the site. In regards to the interface, we would rank Sports Interaction as one of the best in the business. Sports Interaction has managed to cater to experienced bettors by supplying current news and matchup stats built into the platform. No more having to navigate to multiple sites. ',
            offerings: 'Perhaps because Sports Interaction is based in North America, it is the North American sports that are featured on the main pages. They have all major North American events, but actually have quite an impressive offering of many other global sports. Impressively, they also offer more obscure sports such as Gaelic Games, Lacrosse, and Cycling. Their soccer coverage is also quite extensive. There odds can be very hit or miss, but that is the norm for most books that aren’t Pinnacle. They do have good live betting coverage, but no streaming perks like William Hill or Bet 365. If you want a professional no frills setup, Sports Interaction is a great pick.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Sports Interaction an Excellent Cashier rating.',
            customerService: 'Sports Interaction have one of the best Customer Service modules in the industry. Live Chat can be accessed 24 hours a day where a customer service agent will answer any of your questions. Sports Interaction can also be reached via email, fax, or telephone. Additionally, they also have a search feature for their FAQs page to answer some of the more common questions.',
            depositReview: 'All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'One withdrawal per calendar month is free. Charges for additional withdrawals depend on the player’s location and the method used.',
            languages: [['English', 'French', 'Spanish']],
            screenshot: true
        },
        {
            name: 'William Hill',
            affiliateUrl: 'http://ads2.williamhill.com/redirect.aspx?pid=182612656&bid=1487410869&lpid=1470919664',
            depositMethods:[
                ['Credit Card', 'UK Debit Cards', 'Entropay',  'Paypal', 'UKash', 'Skrill', 'Neteller'],
                ['Click2Pay', 'Instadebit', 'William Hill Store', 'UseMyFunds', 'ClickandBuy', 'POLi', 'WebMoney']
            ],
            withdrawalMethods:[
                ['ClickandBuy', 'Maestrocard', 'Credit Card', 'Moneybookers', 'Neteller', 'UKash']

            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $100',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $100'}
            ],
            restricted: ['Belgium', 'France', 'Turkey', 'USA'],
            grade: 'B+',
            banner: $sce.trustAsHtml('<a href="http://ads2.williamhill.com/redirect.aspx?pid=182612656&bid=1487410869&lpid=1470919664"><img alt="" src="http://ads2.williamhill.com/renderimage.aspx?pid=182612656&bid=1487410869" border=0></img ></a>'),
            overview: 'William Hill is one of the most well known names in sports betting. Along with having a first class online offering, William Hill also has 624 betting outlets in the U.K., Ireland, and the Isle of Man. To further their reputation for financial stability and transparency, William Hill has been listed on the London Stock Exchange for 12 years. William Hill provides diverse offerings, covering most sporting events. William Hill can be described by one word: professionalism. William Hill are professional and above average in every category while not really excelling in anything. Their interface and customer service are amongst the best, however. In our opinion, William Hill is a great sports book for any user, professional or recreational. ',
            interface: ': In 2008, William Hill partnered with Playtech, who are one of the best gaming platform creators. As a result, there are now no problems around the William Hill software. It’s a very clean and straightforward production. The sports categories and wager options are clearly laid out. Helpfully, William Hill provides a bet slip on the right, a bet calculator, results, a customizable favorites tab, and a search bar to find the exact team or game you want to bet on. William Hill also provides live streaming for select events, which is ideal for in-play betting. William Hill also provides additional features that make it seem as if the platform is geared towards the recreational bettor. The platform features written content, radio, and podcasts. Their mobile website also deserves to be used as a blueprint, along with Bet 365, for how mobile sites should be built. We can only hope that the rest of the sports books on the net follow suit.',
            offerings: ': William Hill are amongst the biggest providers in regards to events to wager on. Their offerings cover more than 20 sports, and they are the most likely book to offer regional event coverage. Their odds are competitive, if not the best in the market for the user. There is plenty of variety and a wide range of options including results, scorers, time of score, exact score and number of points. William Hill has a robust and impressive live betting platform, but the events offered are geared towards soccer.',
            cashReview: 'Excellent. Any company that has been an industry leader since 1934 in an industry as volatile as sports betting is a reliable and financially stable corporation. Part of that is due to their excellent cashier system, where users rarely encounter any issues. William Hill has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Additionally, William Hill offers users the chance to wager in several currencies including, AUD, CAD, CHF, DKK, EUR, GBP, and USD.',
            customerService: 'William Hill provides excellent customer service, which is a requirement as a publically traded company. This helps ensure that there will rarely be any issues for the player as William Hill has a responsibility to their shareholders. There are hardly any issues that would require customer service, but that being said, the customer service phone number and live chat can be a bit difficult to find. It is easy to submit a written (e-mail) inquiry through the ‘contact us’ page, which will provide a reply in a timely manner. The easiest method to address any questions is via their extensive FAQs page, which is updated regularly and is likely to answer any inquiries. ',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits. Visa, Maestrocard, Mastercard, and Click and Buy require a minimum deposit of $10.',
            withdrawalReview: 'There are no surcharges for withdrawals. ',
            languages: [['English', 'French', 'German', 'Greek', 'Polish', 'Russian', 'Spanish']],
            screenshot: false
        }
    ];

    var getSportsbooks = function(callback){
        Location.getCountry(function(country){
            var sportsbooksOrdered = [];
            var rank = defaultRank;

            if(country in countryRank){
                rank = countryRank[country];
                while (rank.length < 10) {
                    for(var i=0; i< remainder.length; i++){
                        if(rank.indexOf(remainder[i]) === -1){
                            rank.push(remainder[i]);
                        }
                    }
                    for(var j=0; j<defaultRank.length; j++){
                        if(rank.indexOf(defaultRank[j]) === -1){
                            rank.push(defaultRank[j]);
                        }
                    }
                }
            }
            rank.forEach(function(key) {
                var found = false;
                sportsbooks.filter(function(sportsbook) {
                    if(!found && sportsbook.name === key) {
                        sportsbooksOrdered.push(sportsbook);
                        found = true;
                        return false;
                    } else
                        return true;
                });
            });
            callback(sportsbooksOrdered);
        });
    };

    var getSportsbook = function(sportsbookName){
        return $filter('filter')(sportsbooks, {name:sportsbookName})[0];
    };


    return {
        getSportsbooks: getSportsbooks,
        getSportsbook: getSportsbook
    };

}
]);
'use strict';

angular.module('fu').factory('StripeService', ['$resource', '$state', 'Authentication', '$http', 'Modal', 'User', 'GaEcommerce',
    function($resource, $state, Authentication, $http, Modal, User, GaEcommerce) {

        var key = 'pk_live_73Q2l4S0RJOJ2jKXtmBOeH45';
        //var key = 'pk_test_AkvAU2W7WvoGI5ehchaxF7sM';
        var image ='/modules/fu/client/img/stripe/fansunite-logo-square.png';


        //stripe resource
        var stripe = $resource('/pro/new', {
            save: {
                method:'POST',
                params:{stripeToken: '@_stripeToken', plan: '@_plan'}
            }
        });


        var newBaseSubscription = function(callback){
            newSubscription('Base Subscription', '30 day subscription - Auto Renew', 1000,  callback);
        };

        var newPremium1Subscription = function(callback){
            newSubscription('1 Month Premium', '30 day subscription - Auto Renew', 5000,  callback);
        };

        var newPremium6Subscription = function(callback){
            newSubscription('6 Months Premium', '6 month subscription - Auto Renew', 25000,  callback);
        };

        function sendGaTransaction(id, plan){
            var amount;
            switch(plan){
                case 'Base Subscription':
                    amount = '10.00';
                    break;
                case '1 Month Premium':
                    amount = '50.00';
                    break;
                case '6 Months Premium':
                    amount = '250.00';
                    break;
            }
            GaEcommerce.sendTransaction(id, plan, amount);
        }


        var newSubscription = function(plan, description, amount, callback){
            var handler = StripeCheckout.configure({
                key: key,
                image: image,
                token: function(stripeToken) {
                    stripe.save({stripeToken: stripeToken.id, plan: plan},
                        //success
                        function(user) {
                            Authentication.user = user;
                            if(user.subscriptionId) sendGaTransaction(user.subscriptionId, plan);
                            User.updateUserStatus();
                            callback(null);
                        },
                        //error
                        function(data){
                            callback(data);
                        });
                }
            });

            var name;
            switch(plan){
                case 'Base Subscription':
                    name = 'FansUnite Base';
                    break;
                case '1 Month Premium':
                    name = 'FansUnite Pro';
                    break;
                case '6 Months Premium':
                    name = 'FansUnite Pro';
                    break;
            }

            handler.open({
                name: name,
                description: description,
                amount: amount
            });
        };



        var resumeSubscription =  function(callback){
            if (confirm('Are you sure you want to renew your Pro subscription?')) {
                $http({method: 'GET', url: '/pro/resume'}).
                    success(function(user) {
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data) {
                        callback(data.message);
                    });
            }
        };

        var cancelSubscription = function(callback){
            if (confirm('Are you sure you want to cancel your subscription?')) {
                $http({method: 'GET', url: '/pro/cancel'}).
                    success(function (user, status) {
                        console.log(user);
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data, status) {
                        callback(data.message);
                    });
            }
        };


        var changeSubscription = function(plan, callback){
            if (confirm('Are you sure you want to upgrade to subscription?')) {
                $http({method: 'POST', url: '/pro/change', data: {plan:plan}}).
                    success(function (user, status) {
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data, status) {
                        callback(data.message);
                    });
            }
        };

        var showSubscriptionModal = function(){
            if(Authentication.user){
                Modal.showModal(
                    'modules/fu/client/views/subscription/modal/modal-subscription.client.view.html',
                    'ModalSubscriptionController',
                    null,
                    'stripe'
                );
            } else {
                $state.go('signup');
            }
        };




        //Plan ID - Pro, 6month, 1year
        /*
         var new1MonthSubscription = function(callback){
         newSubscription('Pro', '30 day subscription - Auto Renew', 2000,  callback);
         };

         var new6MonthSubscription = function(callback){
         newSubscription('6month', '6 month subscription - Auto Renew', 10000, callback);

         };

         var new12MonthSubscription = function(callback){
         newSubscription('1year', '1 year subscription - Auto Renew', 18000, callback);
         };
         */


        return {
            newSubscription: newSubscription,
            cancelSubscription: cancelSubscription,
            resumeSubscription: resumeSubscription,
            changeSubscription: changeSubscription,

            newBaseSubscription: newBaseSubscription,
            newPremium1Subscription: newPremium1Subscription,
            newPremium6Subscription: newPremium6Subscription,

            showSubscriptionModal: showSubscriptionModal
        };

    }
]);
'use strict';

angular.module('fu').factory('Trending', ['ApiTrending',
    function(ApiTrending) {

        var get = function(query, callback){
            function cbSuccess(trending){
                callback(null, trending);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiTrending.get(query, cbSuccess, cbError);
        };

        return {
            get: get
        };
    }
]);
'use strict';

angular.module('fu').factory('Trial', ['ApiTrialActivate', 'Authentication', 'User', 'GaEcommerce',
    function(ApiTrialActivate, Authentication, User, GaEcommerce) {

        var activate = function(callback){
            function cbSuccess(user){
                Authentication.user = user;
                GaEcommerce.sendTransaction(user._id, 'Trial', '0.00');
                User.updateUserStatus();
                callback(null);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiTrialActivate.get({}, cbSuccess, cbError);
        };

        return {
            activate: activate
        };
    }
]);
'use strict';

angular.module('fu').factory('UserPicks', ['$filter', 'Authentication', 'User',
    function($filter, Authentication, User){

        var pendingPicks = User.picks.pending;

        var isPicked = function(pick){
            var pickFound = $filter('filter')(pendingPicks, {bet: pick.bet});
            return pickFound.length > 0;
        };

        var isCopied = function(pick){
            var pickFound = $filter('filter')(pendingPicks, function(pendingPick){
                if('copiedFrom' in pendingPick){
                    return pendingPick.copiedFrom.pick === pick._id;
                } else {
                    return false;
                }
            });
            return pickFound.length > 0;
        };

        var isOwn = function(pick){
            return pick.user.ref._id === Authentication.user._id;
        };

        var hasStarted = function(event){
            return (new Date(event.startTime) < new Date());
        };

        return {
            isOwn: isOwn,
            isPicked: isPicked,
            isCopied: isCopied,
            hasStarted: hasStarted
        };
    }


]);

'use strict';

angular.module('fu').factory('User', ['Authentication', 'ApiUserPicksPending', 'ApiUserPicksCompleted', 'ApiUserFollowing', 'ApiUserInfo', 'ApiUserConversation', 'SocketUser', 'ApiUserNotification', 'ApiUserMessagecount', 'ApiUserStatus', 'ApiUserFollowingSettings',
    function(Authentication, ApiUserPicksPending, ApiUserPicksCompleted, ApiUserFollowing, ApiUserInfo, ApiUserConversation, SocketUser, ApiUserNotification, ApiUserMessagecount, ApiUserStatus, ApiUserFollowingSettings) {

        var getPendingPicks = function(callback){
            function cbSuccess(picks){
                picks.pending = picks;
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksPending.query({}, cbSuccess, cbError);
        };

        var getCompletedPicks = function(page, callback){
            function cbSuccess(picks){
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksCompleted.query({page:page}, cbSuccess, cbError);
        };

        var getFollowing = function(query, callback){
            function cbSuccess(following){
                callback(null, following);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserFollowing.query(query, cbSuccess, cbError);

        };

        var getConversations = function(callback){

            function cbSuccess(conversations){
                callback(null, conversations);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserConversation.query({}, cbSuccess, cbError);
        };

        var createConversation = function(conversation, callback){
            function cbSuccess(conversation){
                callback(null, conversation);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserConversation.save(conversation, cbSuccess, cbError);
        };


        function updateActiveUnits(){
            var unitCount = 0;
            for(var i=0; i<info.picks.pending.length; i++){
                unitCount =  unitCount + info.picks.pending[i].units;
            }
            info.stats.activeUnits = unitCount;
        }

        function updateActivePicks(){
            info.stats.activePicks = info.picks.pending.length;
        }

        function updateMessageCount(){
            function cbSuccess(count){
                info.messageCount = count.count;
            }

            function cbError(response){
                console.log(response);
            }

            ApiUserMessagecount.get({}, cbSuccess, cbError);
        }

        function updateUserStatus(){

            function cbSuccess(response){
                info.status = response.status;
            }

            function cbError(response){
                console.log(response);
            }

            ApiUserStatus.get({}, cbSuccess, cbError);
        }

        function initiliazeSocket(){

            SocketUser.connect();
            SocketUser.emit('user join', Authentication.user._id);

            SocketUser.on('new notification', function(notification){
                info.notifications.push(notification);
            });


            SocketUser.on('new message', function(){
                updateMessageCount();
            });
        }

        function readNotification(notification, callback){

            function cbSuccess(notification){
                callback(null, notification);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserNotification.update(notification, cbSuccess, cbError);
        }

        function getFollowingSettings(callback){

            function cbSuccess(followingSettings){
                callback(null, followingSettings);
            }

            function cbError(err){
                callback(err);
            }

            ApiUserFollowingSettings.query(cbSuccess, cbError);
        }

        function updateFollowingSettings(followingSettings, callback){

            function cbSuccess(followingSettings){
                callback(null, followingSettings);
            }

            function cbError(err){
                callback(err);
            }

            ApiUserFollowingSettings.update(followingSettings, cbSuccess, cbError);
        }

        var initialize = function(){
            function cbSuccess(userInfo){
                info.initialized = true;
                info.following = userInfo.following;
                info.picks.pending = userInfo.pendingPicks;
                info.channels = userInfo.channels;
                info.notifications = userInfo.notifications;
                info.messageCount = userInfo.messageCount;
                info.status = userInfo.status;
                updateActiveUnits();
                updateActivePicks();
                initiliazeSocket();

            }

            function cbError(response){

            }

            ApiUserInfo.get({}, cbSuccess, cbError);
        };

        var info = {initialized: false,
                    following: [],
                    channels: [],
                    messageCount: 0,
                    picks: {pending:[]},
                    notifications: [],
                    status: '',
                    stats: {activeUnits:null, activePicks:null}};

        var picks = {pending:[]};

        return {
            picks: picks,
            info: info,

            getPendingPicks: getPendingPicks,
            getCompletedPicks: getCompletedPicks,
            getConversations: getConversations,
            getFollowing: getFollowing,
            getFollowingSettings: getFollowingSettings,
            updateFollowingSettings: updateFollowingSettings,
            initialize: initialize,

            createConversation: createConversation,
            readNotification: readNotification,
            updateMessageCount: updateMessageCount,
            updateUserStatus: updateUserStatus
        };

    }
]);
'use strict';

angular.module('fu').factory('UserAuth', ['Authentication', 'ApiAuth', 'User',
    function(Authentication, ApiAuth, User) {

        var signup = function(form, callback){

            function cbSuccess(response){
                Authentication.user = response;
                User.initialize();
                callback(null);
            }

            function cbFailure(response){
                callback(response.data.message);
            }

            ApiAuth.signup(form, cbSuccess, cbFailure);
        };

        var login = function(form, callback){

            function cbSuccess(response){
                Authentication.user = response;
                User.initialize();
                callback(null);
            }

            function cbFailure(response){
                callback(response.data.message);
            }

            ApiAuth.login(form, cbSuccess, cbFailure);
        };

        return {
            signup: signup,
            login: login
        };

    }
]);
'use strict';

angular.module('fu').factory('Users', ['Authentication', 'ApiUserProfile',
    function(Authentication, ApiUserProfile) {

        var getProfile = function(username, callback){
            function cbSuccess(profile){
                callback(null, profile);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserProfile.get({username:username}, cbSuccess, cbError);
        };



        return {
            getProfile: getProfile
        };

    }
]);
'use strict';

angular.module('message').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
            state('messages', {
                url: '/messages',
                templateUrl: 'modules/message/client/views/messages.client.view.html',
                controller: 'MessagesController',
                title: 'Messages | FansUnite',
                description: '',
                keywords: '',
                abstract: true,
                data: {
                    roles: ['user']
                }
            })
            .state('messages.home', {
                url: '',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.new', {
                url: '/new',
                templateUrl: 'modules/message/client/views/new-message.client.view.html',
                controller: 'NewMessageController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.newWithUser', {
                url: '/new/:username',
                templateUrl: 'modules/message/client/views/new-message.client.view.html',
                controller: 'NewMessageController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.view', {
                url: '/:conversationId',
                templateUrl: 'modules/message/client/views/view-message.client.view.html',
                controller: 'ViewMessageController',
                data: {
                    roles: ['user']
                }
            });
    }
]);
'use strict';

angular.module('message').controller('MessagesController', ['$scope', '$filter', 'Authentication', 'User',
    function($scope, $filter, Authentication, User) {


        $scope.authentication = Authentication;

        $scope.getConversationList = function(){
            function cb(err, conversations){
                $scope.conversations = conversations;
            }

            User.getConversations(cb);
        };

        $scope.getConversationList();

        $scope.recipientList = function(message){
            var recipientList = '';
            for(var i=0; i<message.recipients.length; i++){
                if(recipientList.length > 20){
                    return recipientList.substring(0, recipientList.length - 2) + '...';
                }
                if(message.recipients[i].name !== $scope.authentication.user.username){
                    recipientList = recipientList+message.recipients[i].name+', ';
                }
            }
            return recipientList.substring(0, recipientList.length - 2);
        };

        $scope.isNew = function(message){
            var recipient = $filter('filter')(message.recipients,{ref: $scope.authentication.user._id});
            return recipient[0].new;
        };



        $scope.$on('menuSet', function() {
            $scope.getEvents();
        });

        $scope.$on('updateConversationList', function(){
            $scope.getConversationList();
            User.updateMessageCount();
        });

    }
]);
'use strict';

angular.module('message').controller('NewMessageController', ['$scope', '$state', '$stateParams', '$http', 'Authentication', 'SocketMessages', 'User', '$filter',
    function($scope, $state, $stateParams, $http, Authentication, SocketMessages, User, $filter) {
        $scope.authentication = Authentication;
        $scope.username = $stateParams.username;
        $scope.newRecipients = [];


        $scope.submitNewMessage = function() {

            if (!$scope.text) return;

            function cb(err, conversation){
                console.log(err);
                console.log(conversation);
                if(!err) $state.go('messages.view',{conversationId: conversation._id});
            }

            $scope.newRecipients.push({name:$scope.authentication.user.username, ref:$scope.authentication.user._id});
            var message = {message: $scope.text, user: {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}};
            var conversation = {
                recipients: $scope.newRecipients,
                message:    message
            };
            if($scope.subject) conversation.subject = $scope.subject;

            console.log(conversation);

            User.createConversation(conversation, cb);
        };

        $scope.getUsers = function(username){
            return $http.get('/api/search/users', {
                params: {
                    username: username
                }
            }).then(function(response){
                return response.data;
            });

        };


        $scope.removeSelected = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.newRecipients.length; i++){
                if($scope.newRecipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };

        $scope.addRecipient = function(){
            if($scope.selectedUser){
                $scope.newRecipients.push({name:$scope.selectedUser.username, ref:$scope.selectedUser._id});
                //PrivateChatSocket.emit('user added');
            }
            $scope.selectedUser = '';
        };


        $scope.removeRecipient = function(currentUser) {
            var index = -1;
            for (var i = 0; i < $scope.newRecipients.length; i++) {
                if ($scope.newRecipients[i].ref === currentUser.ref) {
                    index = i;
                    break;
                }
            }
            if(index !== -1) {
                $scope.newRecipients.splice(index, 1);
            }
        };



        if($scope.username){
            var users = $scope.getUsers($scope.username);
            users.then(function(response){
                if(response.length){
                    for(var i=0; i<response.length; i++){
                        if(response[i].username === $scope.username){
                            $scope.newRecipients.push({name:response[i].username, ref:response[i]._id});
                        }
                    }
                }
            });
        }



    }
]);
'use strict';

angular.module('message').controller('ViewMessageController', ['$scope', '$state', '$stateParams', '$rootScope', 'Authentication', 'Conversations', 'SocketMessages',
    function($scope, $state,  $stateParams, $rootScope, Authentication, Conversations, SocketMessages) {

        $scope.authentication = Authentication;
        $scope.conversationId = $stateParams.conversationId;

        $scope.text = '';
        $scope.newRecipients = [];

        function cb(err, conversation){
            $scope.conversation = conversation;
            $scope.joinRoom();
        }
        Conversations.get($scope.conversationId, cb);

        SocketMessages.connect();

        $scope.joinRoom = function(){
            var joinRoom = {conversationId: $scope.conversationId, userId: $scope.authentication.user._id };
            SocketMessages.emit('join room', joinRoom);
            $rootScope.$broadcast('updateConversationList');
        };

        $scope.leaveConversation = function(){
            if (confirm('Are you sure you want to leave this conversation?')) {
                var leaveConversation = {conversationId: $scope.conversationId, user: $scope.authentication.user};
                SocketMessages.emit('leave conversation', leaveConversation);
                $rootScope.$broadcast('updateConversationList');
                $state.go('messages.home');
            }
        };

        $scope.addNewRecipients = function(){
            if($scope.newRecipients.length > 0){
                var allRecipients = $scope.conversation.recipients.concat($scope.newRecipients);
                var newRecipients = {conversationId: $scope.conversationId, recipients: allRecipients};
                SocketMessages.emit('add recipients', newRecipients);
                $scope.newRecipients = [];
            }
        };

        $scope.replySubmit = function(){
            if ($scope.text) {
                var replyMessage = {
                    message:    $scope.text,
                    user:    {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}
                };
                var reply = {conversationId: $scope.conversationId,
                            message: replyMessage};

                SocketMessages.emit('message reply', reply);
                $scope.text = '';
            }
        };



        $scope.removeExisting = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.conversation.recipients.length; i++){
                if($scope.conversation.recipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };


        $scope.removeSelected = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.newRecipients.length; i++){
                if($scope.newRecipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };

        $scope.addRecipient = function(){
            if($scope.selectedUser){
                $scope.newRecipients.push({name:$scope.selectedUser.username, ref:$scope.selectedUser._id});
            }
            $scope.selectedUser = '';
        };


        $scope.removeRecipient = function(currentUser) {
            var index = -1;
            for (var i = 0; i < $scope.newRecipients.length; i++) {
                if ($scope.newRecipients[i].ref === currentUser.ref) {
                    index = i;
                    break;
                }
            }
            if(index !== -1) {
                $scope.newRecipients.splice(index, 1);
            }
        };


        /**
         * Socket
         */

        SocketMessages.on('message reply', function(message){
            console.log(message);
            $scope.conversation.messages.push(message);
            $rootScope.$broadcast('updateConversationList');
        });



        SocketMessages.on('add recipients', function(recipients){
            $scope.conversation.recipients = recipients;
            $rootScope.$broadcast('updateConversationList');
        });

        $scope.$on('$destroy', function (event) {
            if($scope.conversation){
                SocketMessages.emit('leave room', $scope.conversationId);
            }
        });


        /*
        Page.setTitle('Messages | FansUnite');
        Page.setDescription('Private messages.');

        $scope.list = [];
        $scope.usersList = Users.query();

        $scope.init = function(){

            $scope.authentication = Authentication;
            $scope.conversationId = $stateParams.conversationId;
            Conversation.getConversation($scope.conversationId, function(conversation){
                $scope.conversation = conversation;
                var found = $filter('filter')($scope.conversation.recipients, {'ref': $scope.authentication.user._id});
                if(found.length === 0){
                    $location.path('/messages');
                }
            });
            Message.query({conversationId: $scope.conversationId}, function(messages){
                $scope.messages = messages;
            });
            NotificationService.newMessageNotification();
            $scope.joinRoom();
        };

        //Filter to remove selected recipient from typeahead
        $scope.removeSelected = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.newRecipients.length; i++){
                if($scope.newRecipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };


        // Add recipient to message
        $scope.addRecipient = function(){
            if($scope.selectedUser){
                $scope.newRecipients.push({name:$scope.selectedUser.username, ref:$scope.selectedUser._id});
                //PrivateChatSocket.emit('user added');
            }
            $scope.selectedUser = '';
        };


        // Remove recipient from message
        $scope.removeRecipient = function(currentUser) {
            var index = -1;
            for (var i = 0; i < $scope.newRecipients.length; i++) {
                if ($scope.newRecipients[i].ref === currentUser.ref) {
                    index = i;
                    break;
                }
            }
            if(index !== -1) {
                $scope.newRecipients.splice(index, 1);
            }
        };

        $scope.submitNewMessage = function() {
            if ($scope.text) {

                $scope.newRecipients.push({name:$scope.authentication.user.username, ref:$scope.authentication.user._id});

                var message = {message: $scope.text, user: {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}};

                var newConversation = {
                    'recipients': $scope.newRecipients,
                    'message': message,
                    'owner':{name:$scope.authentication.user.username, ref:$scope.authentication.user._id},
                };
                if($scope.subject){
                    newConversation.subject = $scope.subject;
                }

                MessageSocket.emit('new conversation', newConversation);
                $scope.text = '';
            }
        };
        MessageSocket.on('new conversation', function(conversation){
            $location.path('/messages/' + conversation._id);
            Conversation.updateConversationList();
        });


        */


    }
]);
'use strict';

angular.module('message').factory('ApiConversations', ['$resource',
    function ($resource) {
        return $resource('api/conversations/:_id', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);

'use strict';

angular.module('message').factory('ApiUserConversation', ['$resource',
    function ($resource) {
        return $resource('api/user/conversations', {}, {
            update:       { method: 'PUT' }
        });
    }
]);
'use strict';

angular.module('message').factory('Conversations', ['ApiConversations',
    function(ApiConversations) {

        var get = function(conversationId, callback){
            function cbSuccess(converation){
                callback(null, converation);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiConversations.get({_id:conversationId}, cbSuccess, cbError);
        };

        return {
            get:    get
        };
    }
]);
'use strict';

angular.module('fu').service('SocketMessages', ['$timeout', function($timeout) {

    this.connect = function () {
        this.socket = io.connect(location.host+'/messages');
    };

    this.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
}]);
/**
 * Created by ryancimoszko on 15-12-30.
 */

/**
 * Created by ryancimoszko on 15-12-30.
 */

/**
 * Created by ryancimoszko on 15-12-30.
 */

/**
 * Created by ryancimoszko on 15-12-30.
 */

/**
 * Created by ryancimoszko on 15-12-30.
 */

/**
 * Created by ryancimoszko on 15-12-30.
 */

'use strict';

angular.module('pinnacle').factory('ApiPinnacleContestants', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/leagues/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);

'use strict';

angular.module('pinnacle').factory('ApiPinnacleLeagues', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/leagues/:_id/:get', { _id: '@__id' }, {
            update:          { method: 'PUT' },
            getContestants:  { method: 'GET', params: {get: 'contestants'}}
        });
    }
]);
'use strict';

angular.module('pinnacle').factory('ApiPinnacleSports', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/sports/:_id/:get', { _id: '@__id' }, {
            update:             { method: 'PUT' },
            getContestants:     { method: 'GET', params: {get: 'contestants'}},
            getLeagues:         { method: 'GET', params: {get: 'leagues'}}
        });
    }
]);

/**
 * Created by ryancimoszko on 15-12-30.
 */

'use strict';

angular.module('pinnacle').factory('PinnacleLeagues', ['ApiPinnacleLeagues',
    function(ApiPinnacleLeagues) {

        var getAll = function(callback){

            function cbSuccess(articles){
                callback(null, articles);
            }

            function cbError(err){
                callback(err);
            }

            ApiPinnacleLeagues.query(cbSuccess, cbError);
        };


        return {
            getAll: getAll
        };

    }
]);
'use strict';

angular.module('pinnacle').factory('PinnacleSports', ['ApiPinnacleSports',
    function(ApiPinnacleSports) {

        var getAll = function(callback){

            function cbSuccess(pinnacleSports){
                callback(null, pinnacleSports);
            }

            function cbError(err){
                callback(err);
            }

            ApiPinnacleSports.query(cbSuccess, cbError);
        };

        var update = function(callback){

        };


        return {
            getAll: getAll,
            update: update
        };

    }
]);
'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
        /*
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      */
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';
/*
angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);
*/

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('ApiUsers', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
