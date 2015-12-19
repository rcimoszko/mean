'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema;


var PinnacleContestantSchema = new Schema({
    name:           {type: String},
    pinnacleSport:  {name: String, ref: {type: Schema.ObjectId, ref: 'PinnacleSport'}},
    pinnacleLeague: {name: String, ref: {type: Schema.ObjectId, ref: 'PinnacleLeague'}},

    contestant:     {name: String, ref: {type: Schema.ObjectId, ref: 'Contestant'}},
    autoMatched:    {type: Boolean}
});

PinnacleContestantSchema.statics.getContestant = function(name, pinnacleLeague, callback){
    this.findOne({name: { $regex: new RegExp('^'+name+'$', 'i')}, 'pinnacleLeague.ref': pinnacleLeague._id }).exec(function(err, pinnacleContestant){
        callback(err, pinnacleContestant);
    });
};

PinnacleContestantSchema.statics.createContestant = function(name, pinnacleLeague, isPrimarySportsbook, callback){
    var _this = this;

    async.waterfall([

        //get pinnacle sport
        function(callback){
            _this.model('PinnacleSport').findOne({sportId: pinnacleLeague.sportId}).exec(function(err, pinnacleSport){
                callback(err, pinnacleSport);
            });
        },

        //try to get contestant
        function(pinnacleSport, callback){
            //find contestant based on other names OR name and sport
            _this.model('Contestant').findOne({$or:[{otherNames:{ $regex: new RegExp('^'+name+'$', 'i')}}, {name: { $regex: new RegExp('^'+name+'$', 'i')}}], 'sport.ref': pinnacleSport.sport.ref}).exec(function(err, contestant){
                callback(err, pinnacleSport, contestant);
            });
        },

        //create pinnacle contestant
        function(pinnacleSport, contestant, callback){

            var pinnacleContestant = {
                name: name,
                pinnacleSport: {name: pinnacleSport.name, ref: pinnacleSport._id},
                pinnacleLeague: {name: pinnacleLeague.name, ref: pinnacleLeague._id}
            };


            if(contestant){
                pinnacleContestant.contestant = {name: contestant.name, ref: contestant._id};
                pinnacleContestant.autoMatched = true;
                callback(null, pinnacleContestant);

            } else if(isPrimarySportsbook){

                //If a matching contestant wasn't found and it's the primary sportsbook, than create a contestant
                _this.model('Sportsbook').getPinnacle(function(err, pinnacle){

                    var contestant = {
                        name: name,
                        sport: {name: pinnacleLeague.sport.name, ref: pinnacleLeague.sport.ref},
                        auto: true,
                        origin: {name: pinnacle.name, ref: pinnacle._id}
                    };

                    if(pinnacleLeague.league){
                        contestant.leagues = [{name: pinnacleLeague.league.name, ref: pinnacleLeague.league.ref}];
                    }

                    _this.model('Contestant').create(contestant, function(err, contestant){
                        pinnacleContestant.contestant = {name: contestant.name, ref: contestant._id};
                        callback(err, pinnacleContestant);
                    });
                });
            }
        }
    ], function(err, pinnacleContestant){
        _this.create(pinnacleContestant, function(err, pinnacleContestant){
            callback(err, pinnacleContestant);
        });
    });
};


mongoose.model('PinnacleContestant', PinnacleContestantSchema);