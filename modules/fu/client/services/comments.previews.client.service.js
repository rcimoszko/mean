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