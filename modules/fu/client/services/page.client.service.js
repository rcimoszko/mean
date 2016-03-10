'use strict';

angular.module('fu').service('Page', ['$location', function($location) {
    var meta = {
        title: 'FansUnite | Sportsbetting Social Network',
        description: 'Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'sportsbetting social network, sportsbetting community, bet tracking'
    };

    return {
        meta: meta
    };
}]);
