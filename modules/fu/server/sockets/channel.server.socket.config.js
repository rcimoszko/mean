'use strict';

module.exports = function (io, socket) {

    var nsp = io.of('/channel');
    /*
    io.emit('chatMessage', {
        type: 'status',
        text: 'Is now connected',
        created: Date.now(),
        profileImageURL: socket.request.user.profileImageURL,
        username: socket.request.user.username
    });

    socket.on('chatMessage', function (message) {
        message.type = 'message';
        message.created = Date.now();
        message.profileImageURL = socket.request.user.profileImageURL;
        message.username = socket.request.user.username;

        // Emit the 'chatMessage' event
        io.emit('chatMessage', message);
    });

    socket.on('disconnect', function () {
        io.emit('chatMessage', {
            type: 'status',
            text: 'disconnected',
            created: Date.now(),
            username: socket.request.user.username
        });
    });
    */
};
