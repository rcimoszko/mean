'use strict';

angular.module('fu').directive('replies', function(RecursionHelper) {
    return {
        restrict: 'E',
        scope: {
            replies: '=',
            commentId: '=',
            replyIndex: '=',
            discussionId: '=',
            users: '=',
            type: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        templateUrl: 'modules/fu/client/templates/comments/replies.client.template.html',
        controller: ['$scope', '$filter', function($scope, $filter) {

            $scope.getAvatarUrl = function(user){
                var userFound = $filter('filter')($scope.users, {_id: user.ref});
                return userFound.ref.avatarUrl;
            };


            /*
             $scope.authentication = Authentication;
            $scope.commentReply = function(comment, text, commentIndex){
                if(text){
                    var path = [];
                    if($scope.replyIndex === '0'){
                        path.push(commentIndex);
                    } else {
                        path = $scope.replyIndex.split(',');
                        path.push(commentIndex);
                        path.shift();
                    }
                    var parentComment = {user: {name: comment.user.name, ref: comment.user.ref}, text: comment.text};
                    var newComment = {user:{name: $scope.authentication.user.username, ref: $scope.authentication.user._id}, text: text};
                    var commentReply = {path:path, commentId: $scope.commentId, comment: newComment, parentComment: parentComment, discussionId: $scope.discussionId, type:$scope.type};

                    CommentSocket.emit('comment reply', commentReply);
                    $scope.text = '';
                }
            };

            */
        }]
    };
});