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