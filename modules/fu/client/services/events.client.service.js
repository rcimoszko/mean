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