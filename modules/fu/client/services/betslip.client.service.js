'use strict';

angular.module('fu').factory('BetSlip', [ '$filter', 'ApiUserMakePicks', 'Loading', 'Authentication', 'User',
    function($filter, ApiUserMakePicks, Loading, Authentication, User) {
        var events = [];
        var stats = {count:0};
        var status = {submitted: false, error: false};

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
                    stats.count = stats.count + events[i].picks.length;
                }
            }
        }

        function checkIfErrors(){
            var hasError = false;
            for(var i=0; i<events.length; i++){
                for(var j=0; j<events[i].picks.length; j++){
                    var pick = events[i].picks[j];
                    if(pick.error === true){
                        hasError = true;
                        break;
                    }
                }
            }
            if(!hasError) status.error = false;
        }


        var addRemove = function(pick, event){
            pick.selected = !pick.selected;
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
            if(status.error) checkIfErrors();
        };

        function removeAllSelected(){
            for(var i=0; i<events.length; i++){
                for(var j=0; j<events[i].picks.length; j++){
                    events[i].picks[j].selected = false;
                }
            }
        }

        function removeErrors(){
            for(var i=0; i<events.length; i++){
                events[i].error = false;
                for(var j=0; j<events[i].picks.length; j++){
                    events[i].picks[j].error = false;
                    events[i].picks[j].oddsChanged = false;
                }
            }
        }

        var submit = function(callback){
            removeErrors();
            Loading.isLoading.pickSubmit = true;

            function cbSuccess(results){
                removeAllSelected();
                Loading.isLoading.pickSubmit = false;
                status.submitted = true;
                Authentication.user = results.user;
                User.picks.pending.push(results.picks);
                events.length = 0;
                calculatePickCount();
                callback(null, results);
            }

            function cbError(response){
                Loading.isLoading.pickSubmit = false;
                callback(response.data);
            }

            ApiUserMakePicks.save(events, cbSuccess, cbError);
        };

        return {
            events:     events,
            stats:      stats,
            status:     status,
            addRemove:  addRemove,
            submit:     submit
        };
    }
]);