'use strict';

angular.module('fu').service('SocketMessages', ['$timeout', function($timeout) {

    this.connect = function () {
        this.socket = io.connect(location.host+'/messages');
    };

    this.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                $timeout(function () {
                    callback(data);
                });
            });
        }
    };

    this.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };

    this.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
}]);