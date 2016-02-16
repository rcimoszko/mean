'use strict';

angular.module('fu').factory('Channels', ['ApiChannels', 'ApiChannelsContent', 'ApiChannelsEvents', 'User', '$filter',
    function(ApiChannels, ApiChannelsContent, ApiChannelsEvents, User, $filter) {

        var create = function(form, callback){

            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var channel = new ApiChannels(form);

            channel.$save(cbSuccess, cbError);
        };

        var update = function(channel, callback){

            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            channel.$update({_id: channel._id}, cbSuccess, cbError);

        };

        var get = function(channelID, callback){
            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiChannels.get({_id:channelID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(channels){
                callback(null, channels);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiChannels.query(cbSuccess, cbError);

        };

        var del = function(channel, callback){
            function cbSuccess(channel){
                callback(null, channel);
            }

            function cbError(response){
                callback(response.data.message);
            }
            channel = new ApiChannels(channel);
            channel.$delete(cbSuccess, cbError);
        };

        var getContent = function(channelSlug, date, callback){
            function cbSuccess(channelContent){
                callback(null, channelContent);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiChannelsContent.get({slug: channelSlug, date: date}, cbSuccess, cbError);

        };

        var getEvents = function(channelSlug, date, callback){
            function cbSuccess(channelContent){
                callback(null, channelContent);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiChannelsEvents.query({slug: channelSlug, date:date}, cbSuccess, cbError);

        };

        var subscribe = function(channelId){
            function cbSuccess(channel){
                console.log(channel);
                User.info.channels.push(channel);
            }

            function cbError(response){
                console.log(response);
            }
            ApiChannels.subscribe({_id:channelId}, cbSuccess, cbError);
        };

        var unsubscribe = function(channelId){
            function cbSuccess(channel){
                var found = $filter('filter')(User.info.channels, {_id: channelId});
                if(found.length){
                    User.info.channels.splice(User.info.channels.indexOf(found[0]), 1);
                }
            }

            function cbError(response){
                console.log(response);
            }
            ApiChannels.unsubscribe({_id:channelId}, cbSuccess, cbError);

        };


        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getContent: getContent,
            getEvents: getEvents,

            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
]);