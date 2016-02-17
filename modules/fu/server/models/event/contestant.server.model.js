'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var ContestantSchema = new Schema({
    name:           {type: String, trim: true, required: true},
    sport:          {name: String, 'ref': {type: Schema.ObjectId, ref: 'Sport'}},
    league:         {type: String}, //to remove
    leagues:        [{name: String, 'ref': {type: Schema.ObjectId, ref: 'League'},  _id : false }],
    pinnacleId:     [String], //to remove
    fiveDimesId:    [String], //to remove
    darkColor:      {type: String, trim: true},
    lightColor:     {type: String, trim: true},
    city:           {type: String, trim: true},
    stadium:        {type: String, trim: true},
    name1:          {type: String, trim: true},
    name2:          {type: String, trim: true},
    abbrName:       {type: String, trim: true},
    main:           {type: Boolean},
    auto:           {type: Boolean},
    origin:         {name: String, 'ref': {type: Schema.ObjectId, ref: 'Sportsbook'}},
    oldIds:         [{type: Schema.ObjectId, ref: 'Contestant'}], //to remove
    otherNames:     [String],
    record:         [{year:{type:Number}, wins:{type:Number}, losses:{type:Number}}],
    slug:           {type: String, trim: true},
    scraperId:      {type: Number},
    logoUrl:        {type: String, trim: true}
});

ContestantSchema.pre('save', function(next) {
    if(this.name && this.isModified('name')){
        this.slug = slug(this.name);
    }
    next();
});

ContestantSchema.statics.includeLeague = function(sportName){
    switch(sportName){
        case 'Mixed Martial Arts':
        case 'Golf':
        case 'Tennis':
        case 'Boxing':
        case 'Darts':
        case 'Cycling':
        case 'E Sports':
            return false;
        default:
            return true;
    }
};

ContestantSchema.methods.updateContestantNames = function(callback){
    var _this = this;
    async.parallel([
        //update event contestant1
        function(callback){
            _this.model('Event').update({'contestant1.ref':_this._id}, {'contestant1.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                callback(err);
            });
        },
        //update event contestant2
        function(callback){
            _this.model('Event').update({'contestant2.ref':_this._id}, {'contestant2.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                callback(err);
            });
        },
        //update bets
        function(callback){
            _this.model('Event').find({$or:[{'contestant1.ref': _this._id}, {'contestant2.ref': _this._id}]}).exec(function(err, events){
                async.eachSeries(events, function(event, callback){
                    async.eachSeries(event.betsAvailable, function(bet, callback){
                        if(String(bet.contestant.ref) === String(_this._id)){
                            bet.contestant.name = _this.name;
                        }
                        callback();
                    }, function(err){
                        event.save(function(err){
                            callback(err);
                        });
                    });
                }, function(err){
                    callback(err);
                });
            });
        },
        //update picks
        function(callback){
            _this.model('Pick').update({'contestant.ref':_this._id}, {'contestant.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                callback(err);
            });
        },
        //update picks
        function(callback){
            _this.model('PinnacleContestant').update({'contestant.ref':_this._id}, {'contestant.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                callback(err);
            });
        },
        //update picks
        function(callback){
            _this.model('FiveDimesContestant').update({'contestant.ref':_this._id}, {'contestant.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                callback(err);
            });
        }
    ], function(err){
        callback(err);
    });
};

mongoose.model('Contestant', ContestantSchema);