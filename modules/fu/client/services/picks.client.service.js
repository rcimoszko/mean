'use strict';

angular.module('fu').factory('Picks', ['ApiPicksComments',
    function(ApiPicksComments) {

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


        return {
            getComments: getComments,
            newComment: newComment,
            commentReply: commentReply
        };
    }
]);