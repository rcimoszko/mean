'use strict';

angular.module('fu').service('Page', ['$location', function($location) {
    var title = 'FansUnite | Betting Tips, Free Picks, Odds and Scores';
    var description = 'Sports betting community for handicappers looking to get free picks, practice their betting strategy and see where the top guys are actually putting their money';
    var keywords = 'sports betting community, free sports picks, learn how to bet verified handicappers, fansunite';

    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle;
        },
        description: function(){
            return description;
        },
        setDescription: function(newDescription){
            description = newDescription;
        },
        keywords: function(){
            return keywords;
        },
        setKeywords: function(newKeywords){
            keywords = newKeywords;
        },
        getUrl: function(){
            return $location.path();
        }
    };
}]);
