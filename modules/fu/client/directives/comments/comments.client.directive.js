'use strict';

angular.module('fu').directive('comments', function() {
    return {
        restrict: 'E',
        scope: {
            comments: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/comments.client.template.html',
        controller: ['$scope', 'Authentication',  function($scope, Authentication) {
            console.log($scope.comments);

            $scope.authentication = Authentication;
            $scope.newComment = '';
            $scope.showReply = false;

            $scope.toggleReply = function(){
                $scope.showReply = !$scope.showReply;
            };

            /*
            //Join Room
            CommentSocket.emit('join discussion', $scope.discussionId);

            //Get all comments
            Comments.query({discussionId: $scope.discussionId}, function(comments){
                $scope.comments = comments;
            });

            $scope.newPost = function(){
                if($scope.text){
                    var comment = {discussion: $scope.discussionId, user:{name: $scope.authentication.user.username, ref: $scope.authentication.user._id}, text: $scope.text, users: [$scope.authentication.user._id]};
                    var newPost = {type: $scope.type, comment:comment};
                    CommentSocket.emit('new post', newPost);
                    $scope.text = '';
                }
            };

            $scope.commentReply = function(comment, text){
                if(text){
                    var parentComment = {user: comment.user, text: comment.text};
                    var newComment = {user:{name: $scope.authentication.user.username, ref: $scope.authentication.user._id}, text: text};
                    var commentReply = {path:[], commentId: comment._id, comment: newComment, parentComment: parentComment, discussionId: $scope.discussionId, type:$scope.type};

                    CommentSocket.emit('comment reply', commentReply);
                    $scope.text = '';
                }
            };

            CommentSocket.on('new post', function(newPost){
                $scope.comments.unshift(newPost);
            });

            CommentSocket.on('new reply', function(comment){
                for(var i=0; i<$scope.comments.length; i++){
                    if(comment._id === $scope.comments[i]._id){
                        $scope.comments[i] = comment;
                    }
                }
            });
            */
        }]
    };
});
