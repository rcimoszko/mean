'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var SeasonSchema = new Schema({
        startDate:  {type: Date},
        endDate:    {type: Date},
        name:       {type:String}
    },
    { _id: false }
);

var LeagueSchema = new Schema({
    name:               {type: String, trim: true, required: 'Name cannot be blank'},
    sport:              {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
    country:            {type: String}, //to remove and change to group
    active:             {type: Boolean},
    disabled:           {type: Boolean, default: false},
    neutral:            {type: Boolean, default: false},
    primarySportsbook:  {type: Schema.ObjectId, ref: 'Sportsbook'},
    main:               {type: Boolean, default: false},
    oldId:              {type: Number},  //to remove
    type:               {type: String},
    pickMade:           {type: Boolean, default:false},
    leaderboardActive: {
        last7Days: {type: Boolean, default: false},
        last30Days: {type: Boolean, default: false},
        last60Days: {type: Boolean, default: false},
        last90Days: {type: Boolean, default: false},
        last6Months: {type: Boolean, default: false},
        lastYear: {type: Boolean, default: false},
        allTime: {type: Boolean, default: false}
    },
    seasons: [SeasonSchema],

    group:        {name: String, ref: {type: Schema.ObjectId, ref: 'Group'}} ,//To Populate
    slug:         {type: String} // Added
});

LeagueSchema.pre('save', function(next) {
    if(this.name && this.isModified('name')){
        this.slug = slug(this.name);
    }
    next();
});


LeagueSchema.statics.updateActive = function(leagueId, active){
    this.update({_id: leagueId},{$set:{active:active}}).exec(function(err){
        if(err){
            console.log(err);
        }
    });
};

LeagueSchema.methods.updateLeagueNames = function(callback){
    var _this = this;
    async.parallel([
        //update Event
        function(callback){
            _this.model('Event').update({'league.ref':_this._id}, {'league.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                console.log('Event - '+numAffected);
                callback(err);
            });
        },
        //update Contestant
        function(callback){
            _this.model('Contestant').update({'leagues.ref':_this._id}, {'leagues.$.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                console.log('Contestant - '+numAffected);
                callback(err);
            });
        },
        //update Pinnacle League
        function(callback){
            _this.model('PinnacleLeague').update({'league.ref':_this._id}, {'league.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                console.log('PinnacleLeague - '+numAffected);
                callback(err);
            });
        },
        //update 5Dimes Category
        function(callback){
            _this.model('FiveDimesCategory').update({'league.ref':_this._id}, {'league.name':_this.name}, { multi: true }).exec(function(err, numAffected){
                console.log('FiveDimesCateogry - '+numAffected);
                callback(err);
            });
        }
    ], function(err){
        callback(err);
    });
};


mongoose.model('League', LeagueSchema);