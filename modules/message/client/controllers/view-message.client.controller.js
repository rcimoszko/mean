'use strict';

angular.module('message').controller('ViewMessageController', ['$scope', '$state', '$stateParams', '$rootScope', 'Authentication', 'Conversations', 'SocketMessages',
    function($scope, $state,  $stateParams, $rootScope, Authentication, Conversations, SocketMessages) {

        $scope.authentication = Authentication;
        $scope.conversationId = $stateParams.conversationId;

        $scope.text = '';
        $scope.newRecipients = [];

        function cb(err, conversation){
            $scope.conversation = conversation;
            $scope.joinRoom();
        }
        Conversations.get($scope.conversationId, cb);

        SocketMessages.connect();

        $scope.joinRoom = function(){
            var joinRoom = {conversationId: $scope.conversationId, userId: $scope.authentication.user._id };
            SocketMessages.emit('join room', joinRoom);
            $rootScope.$broadcast('updateConversationList');
        };

        $scope.leaveConversation = function(){
            if (confirm('Are you sure you want to leave this conversation?')) {
                var leaveConversation = {conversationId: $scope.conversationId, user: $scope.authentication.user};
                SocketMessages.emit('leave conversation', leaveConversation);
                $rootScope.$broadcast('updateConversationList');
                $state.go('messages.home');
            }
        };

        $scope.addNewRecipients = function(){
            if($scope.newRecipients.length > 0){
                var allRecipients = $scope.conversation.recipients.concat($scope.newRecipients);
                var newRecipients = {conversationId: $scope.conversationId, recipients: allRecipients};
                SocketMessages.emit('add recipients', newRecipients);
                $scope.newRecipients = [];
            }
        };

        $scope.replySubmit = function(){
            if ($scope.text) {
                var replyMessage = {
                    message:    $scope.text,
                    user:    {name:$scope.authentication.user.username, ref:$scope.authentication.user._id}
                };
                var reply = {conversationId: $scope.conversationId,
                            message: replyMessage};

                console.log(reply);
                SocketMessages.emit('message reply', reply);
                $scope.text = '';
            }
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


        /**
         * Socket
         */

        SocketMessages.on('message reply', function(message){
            console.log(message);
            $scope.conversation.messages.push(message);
            $rootScope.$broadcast('updateConversationList');
        });



        SocketMessages.on('add recipients', function(recipients){
            $scope.conversation.recipients = recipients;
            $rootScope.$broadcast('updateConversationList');
        });

        $scope.$on('$destroy', function (event) {
            if($scope.conversation){
                SocketMessages.emit('leave room', $scope.conversationId);
            }
        });


        /*
        Page.setTitle('Messages | FansUnite');
        Page.setDescription('Private messages.');

        $scope.list = [];
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


        */


    }
]);