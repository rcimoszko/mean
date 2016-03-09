'use strict';

angular.module('fu').service('Page', ['$location', function($location) {
    var meta = {
        title: 'FansUnite | Betting Tips, Free Picks, Odds and Scores',
        description: 'Sports betting community for handicappers looking to get free picks, practice their betting strategy and see where the top guys are actually putting their money',
        keywords: 'sports betting community, free sports picks, learn how to bet verified handicappers, fansunite'
    };

    var getDescription = function(){
        return meta.description;
    };

    return {
        meta: meta,
        getDescription: getDescription
    };
}]);
