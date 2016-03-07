'use strict';

angular.module('fu').directive('chat', function() {
    return {
        restrict: 'E',
        scope: {
            socket: '=',
            messages: '=',
            channel: '='
        },
        templateUrl: 'modules/fu/client/templates/chat/chat.client.template.html',
        controller: ['$scope', 'Authentication', function($scope, Authentication) {
            
            $scope.authentication = Authentication;
            $scope.showFullChat = false;

            $scope.sendMessage = function () {
                var chat = {
                    message: this.text,
                    user: {name: $scope.authentication.user.username, ref: $scope.authentication.user._id}
                };
                if($scope.channel) chat.channel = {name: $scope.channel.name, ref: $scope.channel._id};
                $scope.socket.emit('new message', chat);
                this.text = '';


            };

            $scope.socket.on('new message', function(messages){
                $scope.messages = $scope.messages.concat(messages);
            });

            $scope.goToBottom = function() {
                 var chatBox = document.getElementById('chat-box');
                 chatBox.scrollTop = 99999;
            };


            $scope.$on('$destroy', function () {
                $scope.socket.removeListener('chatMessage');
            });

        }]
    };
});
