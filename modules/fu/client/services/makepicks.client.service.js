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

            ApiMakePicks.query(query, cbSuccess, cbError);
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


        return {
            getEvents:   getEvents,
            getMenu:    getMenu,
            menu:       menu
        };

    }
]);