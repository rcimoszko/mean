'use strict';

angular.module('fu').factory('Channels', ['ApiChannels',
    function(ApiChannels) {

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

        var getContestants = function(channelId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiChannels.getContestants({_id: channelId}, cbSuccess, cbError);

        };



        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getContestants: getContestants
        };
    }
]);