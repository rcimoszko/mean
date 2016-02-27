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