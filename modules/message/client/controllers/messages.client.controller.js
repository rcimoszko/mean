'use strict';

angular.module('message').controller('MessagesController', ['$scope', '$filter', 'Authentication', 'User', 'SocketMessages',
    function($scope, $filter, Authentication, User, SocketMessages) {


        $scope.authentication = Authentication;

        $scope.getConversationList = function(){
            function cb(err, conversations){
                $scope.conversations = conversations;
            }

            User.getConversations(cb);
        };

        $scope.getConversationList();

        $scope.recipientList = function(message){
            var recipientList = '';
            for(var i=0; i<message.recipients.length; i++){
                if(recipientList.length > 20){
                    return recipientList.substring(0, recipientList.length - 2) + '...';
                }
                if(message.recipients[i].name !== $scope.authentication.user.username){
                    recipientList = recipientList+message.recipients[i].name+', ';
                }
            }
            return recipientList.substring(0, recipientList.length - 2);
        };

        $scope.isNew = function(message){
            var recipient = $filter('filter')(message.recipients,{ref: $scope.authentication.user._id});
            return recipient[0].new;
        };



        $scope.$on('menuSet', function() {
            $scope.getEvents();
        });

        $scope.$on('updateConversationList', function(){
            console.log('test');
            $scope.getConversationList();
        });

    }
]);