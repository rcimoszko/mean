'use strict';

angular.module('message').controller('NewMessageController', ['$scope', '$state', '$stateParams', '$http', 'Authentication', 'SocketMessages', 'User', '$filter',
    function($scope, $state, $stateParams, $http, Authentication, SocketMessages, User, $filter) {
        $scope.authentication = Authentication;
        $scope.username = $stateParams.username;
        $scope.newRecipients = [];


        $scope.submitNewMessage = function() {

            if (!$scope.text) return;

            function cb(err, conversation){
                console.log(err);
                console.log(conversation);
                if(!err) $state.go('messages.view',{conversationId: conversation._id});
            }

            $scope.newRecipients.push({name:$scope.authentication.user.username, ref:$scope.authentication.user._id});
            var message = {message: $scope.text, user: {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}};
            var conversation = {
                recipients: $scope.newRecipients,
                message:    message
            };
            if($scope.subject) conversation.subject = $scope.subject;

            console.log(conversation);

            User.createConversation(conversation, cb);
        };

        $scope.getUsers = function(username){
            return $http.get('/api/search/users', {
                params: {
                    username: username
                }
            }).then(function(response){
                return response.data;
            });

        };


        $scope.removeSelected = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.newRecipients.length; i++){
                if($scope.newRecipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };

        $scope.addRecipient = function(){
            if($scope.selectedUser){
                $scope.newRecipients.push({name:$scope.selectedUser.username, ref:$scope.selectedUser._id});
                //PrivateChatSocket.emit('user added');
            }
            $scope.selectedUser = '';
        };


        $scope.removeRecipient = function(currentUser) {
            var index = -1;
            for (var i = 0; i < $scope.newRecipients.length; i++) {
                if ($scope.newRecipients[i].ref === currentUser.ref) {
                    index = i;
                    break;
                }
            }
            if(index !== -1) {
                $scope.newRecipients.splice(index, 1);
            }
        };



        if($scope.username){
            var users = $scope.getUsers($scope.username);
            users.then(function(response){
                if(response.length){
                    for(var i=0; i<response.length; i++){
                        if(response[i].username === $scope.username){
                            $scope.newRecipients.push({name:response[i].username, ref:response[i]._id});
                        }
                    }
                }
            });
        }



    }
]);