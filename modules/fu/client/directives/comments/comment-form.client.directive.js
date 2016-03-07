'use strict';

angular.module('fu').directive('commentForm', function() {
    return {
        restrict: 'E',
        scope: {
            text: '=',
            pick: '=',
            event: '=',
            comment: '=',
            replyIndex: '=',
            showReply: '=',
            reply: '=',
            comments: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/comment-form.client.template.html',
        controller: ['$scope', 'Events', 'Picks', function($scope, Events, Picks) {
            $scope.toolbarOptions = [
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage','insertLink', 'insertVideo']
            ];

            function newPickComment(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.comments.push(comment);
                }

                Picks.newComment($scope.pick, $scope.text, cb);
            }

            function newEventComment(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.comments.push(comment);
                }

                Events.newComment($scope.event, $scope.text, cb);
            }

            function pickCommentReply(){
                function cb(err, comment){
                    console.log(comment);
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.reply.replies.push(comment.reply);
                    $scope.comment = comment.comment;
                }
                Picks.commentReply($scope.pick, $scope.comment, $scope.replyIndex, $scope.reply.user, $scope.text, cb);
            }

            function eventCommentReply(){
                function cb(err, comment){
                    $scope.showReply = false;
                    $scope.text = '';
                    $scope.reply.replies.push(comment.reply);
                    $scope.comment = comment.comment;
                    console.log(comment);
                }
                Events.commentReply($scope.event, $scope.comment, $scope.replyIndex, $scope.reply.user, $scope.text, cb);
            }

            $scope.submit = function(){
                $scope.error = null;
                if($scope.text === '' || !$scope.text) {
                    $scope.error = 'Nothing to comment' ;
                    return;
                }
                if($scope.pick){
                    if($scope.comment){
                        pickCommentReply();
                    } else {
                        newPickComment();
                    }
                } else if($scope.event){
                    if($scope.comment){
                        eventCommentReply();
                    } else {
                        newEventComment();
                    }
                }
            };
        }]
    };
});