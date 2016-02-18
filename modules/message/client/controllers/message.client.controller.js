'use strict';

angular.module('message').controller('MessageController', ['$scope', 'Authentication',
    function($scope, Authentication) {

        /*
        Page.setTitle('Messages | FansUnite');
        Page.setDescription('Private messages.');

        $scope.list = [];
        $scope.text = '';
        $scope.newRecipients = [];
        $scope.usersList = Users.query();

        $scope.init = function(){

            $scope.authentication = Authentication;
            $scope.conversationId = $stateParams.conversationId;
            Conversation.getConversation($scope.conversationId, function(conversation){
                $scope.conversation = conversation;
                var found = $filter('filter')($scope.conversation.recipients, {'ref': $scope.authentication.user._id});
                if(found.length === 0){
                    $location.path('/messages');
                }
            });
            Message.query({conversationId: $scope.conversationId}, function(messages){
                $scope.messages = messages;
            });
            NotificationService.newMessageNotification();
            $scope.joinRoom();
        };

        //Filter to remove selected recipient from typeahead
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

        $scope.removeExisting = function(currentUser){
            var index = -1;
            for(var i=0; i<$scope.conversation.recipients.length; i++){
                if($scope.conversation.recipients[i].ref === currentUser._id){
                    index = i;
                    break;
                }
            }
            return index === -1;
        };

        // Add recipient to message
        $scope.addRecipient = function(){
            if($scope.selectedUser){
                $scope.newRecipients.push({name:$scope.selectedUser.username, ref:$scope.selectedUser._id});
                //PrivateChatSocket.emit('user added');
            }
            $scope.selectedUser = '';
        };


        // Remove recipient from message
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

        $scope.submitNewMessage = function() {
            if ($scope.text) {

                $scope.newRecipients.push({name:$scope.authentication.user.username, ref:$scope.authentication.user._id});

                var message = {message: $scope.text, user: {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}};

                var newConversation = {
                    'recipients': $scope.newRecipients,
                    'message': message,
                    'owner':{name:$scope.authentication.user.username, ref:$scope.authentication.user._id},
                };
                if($scope.subject){
                    newConversation.subject = $scope.subject;
                }

                MessageSocket.emit('new conversation', newConversation);
                $scope.text = '';
            }
        };
        MessageSocket.on('new conversation', function(conversation){
            $location.path('/messages/' + conversation._id);
            Conversation.updateConversationList();
        });


        $scope.joinRoom = function(){
            var joinRoom = {conversationId: $scope.conversationId, userId: $scope.authentication.user._id };
            MessageSocket.emit('join room', joinRoom);
            Conversation.updateConversationList();
        };

        $scope.replySubmit = function(){
            if ($scope.text) {
                var replyMessage = {message: $scope.text, user: {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}};
                var reply = {conversationId: $scope.conversationId, message: replyMessage};

                MessageSocket.emit('message reply', reply);
                $scope.text = '';
            }
        };
        MessageSocket.on('message reply', function(newMessage){
            console.log(newMessage);
            $scope.messages.push(newMessage);
            Conversation.updateConversationList();
        });


        $scope.addNewRecipients = function(){
            if($scope.newRecipients.length>0){
                var allRecipients = $scope.conversation.recipients.concat($scope.newRecipients);
                var newRecipients = {conversationId: $scope.conversationId, recipients: allRecipients};
                console.log(newRecipients);
                MessageSocket.emit('add recipients', newRecipients);
                $scope.newRecipients = [];
            }
        };
        MessageSocket.on('add recipients', function(recipients){
            $scope.conversation.recipients = recipients;
            Conversation.updateConversationList();
        });

        $scope.leaveConversation = function(){

            if (confirm('Are you sure you want to leave this conversation?')) {
                var leaveConversation = {conversationId: $scope.conversationId, user: $scope.authentication.user};
                MessageSocket.emit('leave conversation', leaveConversation);
                Conversation.updateConversationList();
                $location.path('/messages');
            }
        };

        $scope.$on('$destroy', function (event) {
            if($scope.conversation){
                MessageSocket.emit('leave room', $scope.conversationId);
                MessageSocket.getSocket().removeAllListeners();
            }
        });

        */


    }
]);