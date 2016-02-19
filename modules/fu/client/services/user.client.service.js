'use strict';

angular.module('fu').factory('User', ['Authentication', 'ApiUserPicksPending', 'ApiUserPicksCompleted', 'ApiUserFollowing', 'ApiUserInfo', 'ApiUserConversation', 'SocketUser', 'ApiUserNotification',
    function(Authentication, ApiUserPicksPending, ApiUserPicksCompleted, ApiUserFollowing, ApiUserInfo, ApiUserConversation, SocketUser, ApiUserNotification) {

        var getPendingPicks = function(callback){
            function cbSuccess(picks){
                picks.pending = picks;
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksPending.query({}, cbSuccess, cbError);
        };

        var getCompletedPicks = function(page, callback){
            function cbSuccess(picks){
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksCompleted.query({page:page}, cbSuccess, cbError);
        };

        var getFollowing = function(query, callback){
            function cbSuccess(following){
                callback(null, following);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserFollowing.query(query, cbSuccess, cbError);

        };

        var getConversations = function(callback){

            function cbSuccess(conversations){
                callback(null, conversations);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserConversation.query({}, cbSuccess, cbError);
        };

        var createConversation = function(conversation, callback){
            function cbSuccess(conversation){
                callback(null, conversation);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserConversation.save(conversation, cbSuccess, cbError);
        };


        function updateActiveUnits(){
            var unitCount = 0;
            for(var i=0; i<info.picks.pending.length; i++){
                unitCount =  unitCount + info.picks.pending[i].units;
            }
            info.stats.activeUnits = unitCount;
        }

        function updateActivePicks(){
            info.stats.activePicks = info.picks.pending.length;
        }

        function initiliazeSocket(){

            SocketUser.connect();
            SocketUser.emit('user join', Authentication.user._id);

            SocketUser.on('new notification', function(notification){
                info.notifications.push(notification);
            });
        }

        function readNotification(notification, callback){

            function cbSuccess(notification){
                console.log(notification);
                callback(null, notification);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserNotification.update(notification, cbSuccess, cbError);
        }

        var initialize = function(){
            function cbSuccess(userInfo){
                console.log(userInfo);
                info.initialized = true;
                info.following = userInfo.following;
                info.picks.pending = userInfo.pendingPicks;
                info.channels = userInfo.channels;
                info.notifications = userInfo.notifications;
                info.messageCount = userInfo.messageCount;
                updateActiveUnits();
                updateActivePicks();
                initiliazeSocket();

            }

            function cbError(response){

            }

            ApiUserInfo.get({}, cbSuccess, cbError);
        };

        var info = {initialized: false,
                    following: [],
                    channels: [],
                    messageCount: 0,
                    picks: {pending:[]},
                    notifications: [],
                    stats: {activeUnits:null, activePicks:null}};

        var picks = {pending:[]};

        return {
            picks: picks,
            info: info,

            getPendingPicks: getPendingPicks,
            getCompletedPicks: getCompletedPicks,
            getConversations: getConversations,
            getFollowing: getFollowing,
            initialize: initialize,

            createConversation: createConversation,
            readNotification: readNotification
        };

    }
]);