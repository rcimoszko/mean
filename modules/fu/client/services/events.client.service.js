'use strict';

angular.module('fu').factory('Events', ['ApiEventsComments', 'Authentication',
    function(ApiEventsComments, Authentication) {

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

        return {
            getComments: getComments,
            newComment: newComment,
            commentReply: commentReply
        };
    }
]);