'use strict';

angular.module('fu').factory('BetSlip', [ '$filter', 'ApiUserMakePicks', 'Loading', 'Authentication',
    function($filter, ApiUserMakePicks, Loading, Authentication) {
        var events = [];
        var stats = {count:0};

        function addEvent(event){
            events.push({event:event, date: event.startTime, picks: []});
        }

        function addPick(pick, eventIndex){
            events[eventIndex].picks.push(pick);
        }

        function removePick(eventIndex, pickIndex){
            events[eventIndex].picks.splice(pickIndex, 1);
            if(events[eventIndex].picks.length === 0){
                events.splice(eventIndex, 1);
            }
        }

        function getEventIndex(event){
            var eventFound = $filter('filter')(events, function(e){
                return e.event === event;
            });
            if(eventFound.length) return events.indexOf(eventFound[0]);
        }

        function calculatePickCount(){
            if(events.length === 0){
                stats.count = 0;
                return;
            }
            for(var i=0; i<events.length; i++){
                if(i===0){
                    stats.count = events[i].picks.length;
                } else{
                    stats = stats.count + events[i].picks.length;
                }
            }
        }


        var addRemove = function(pick, event){
            var eventIndex = getEventIndex(event);
            if(eventIndex !== undefined){
                var pickIndex = events[eventIndex].picks.indexOf(pick);
                if(pickIndex === -1){
                    addPick(pick, eventIndex);
                } else {
                    removePick(eventIndex, pickIndex);
                }
            } else {
                addEvent(event);
                addPick(pick, events.length - 1);
            }
            calculatePickCount();
        };

        var submit = function(callback){
            Loading.isLoading.pickSubmit = true;

            function cbSuccess(results){
                Loading.isLoading.pickSubmit = false;
                Authentication.user = results.user;
                events.length = 0;
                callback(null, results);
            }

            function cbError(response){
                Loading.isLoading.pickSubmit = false;
                callback(response.data.message);
            }

            ApiUserMakePicks.save(events, cbSuccess, cbError);
        };

        return {
            events:     events,
            stats:      stats,
            addRemove:  addRemove,
            submit:     submit
        };
    }
]);