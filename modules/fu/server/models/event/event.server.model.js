'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;


var EventSchema = new Schema({
    sport:                      {name: String, 'ref': {type: Schema.ObjectId, ref: 'Sport'}},
    league:                     {name: String, 'ref': {type: Schema.ObjectId, ref: 'League'}},
    neutral:                    {type:Boolean, default:false},

    contestant1:                {name: String, 'ref': {type: Schema.ObjectId, ref: 'Contestant'}, 'rotNum': Number},
    contestant2:                {name: String, 'ref': {type: Schema.ObjectId, ref: 'Contestant'}, 'rotNum': Number},
    drawRotNum:                 {type: Number},

    startTime:                  {type: Date},
    endTime:                    {type: Date},
    over:                       {type: Boolean},

    pinnacleId:                 {type: Number}, // To remove prolly
    pinnacleIds:                [Number],
    pinnacleEventType:          {type: Schema.Types.Mixed},

    pinnacleBets:               [{type: Schema.ObjectId, ref: 'Bet'}],
    betsAvailable:              [Schema.Types.Mixed], // To remove after migration

    contestant1Pitcher:         {type: String},
    contestant2Pitcher:         {type: String},
    gameNo:                     {type: Number, enum: [1, 2]},

    //Scores
    contestant1CurrentScore:    {type: Number},
    contestant2CurrentScore:    {type: Number},
    contestant1RegulationScore: {type: Number},
    contestant2RegulationScore: {type: Number},
    contestant1FinalScore:      {type: Number},
    contestant2FinalScore:      {type: Number},
    contestant1SetsWon:         {type: Number},
    contestant2SetsWon:         {type: Number},

    contestant1H1Score:         {type: Number},
    contestant1H2Score:         {type: Number},
    contestant2H1Score:         {type: Number},
    contestant2H2Score:         {type: Number},

    contestant1Q1Score:         {type: Number},
    contestant1Q2Score:         {type: Number},
    contestant1Q3Score:         {type: Number},
    contestant1Q4Score:         {type: Number},

    contestant2Q1Score:         {type: Number},
    contestant2Q2Score:         {type: Number},
    contestant2Q3Score:         {type: Number},
    contestant2Q4Score:         {type: Number},

    //Hockey
    contestant1P1Score:         {type: Number},
    contestant2P1Score:         {type: Number},
    contestant1P2Score:         {type: Number},
    contestant2P2Score:         {type: Number},
    contestant1P3Score:         {type: Number},
    contestant2P3Score:         {type: Number},

    //Tennis
    contestant1Set1Score:       {type: Number},
    contestant2Set1Score:       {type: Number},
    contestant1Set2Score:       {type: Number},
    contestant2Set2Score:       {type: Number},
    contestant1Set3Score:       {type: Number},
    contestant2Set3Score:       {type: Number},
    contestant1Set4Score:       {type: Number},
    contestant2Set4Score:       {type: Number},
    contestant1Set5Score:       {type: Number},
    contestant2Set5Score:       {type: Number},
    contestant1Set6Score:       {type: Number},
    contestant2Set6Score:       {type: Number},

    contestant1OTScore:         {type: Number},
    contestant2OTScore:         {type: Number},

    contestant1Set1KillsFirst:  {type: Number},
    contestant2Set1KillsFirst:  {type: Number},
    contestant1Set2KillsFirst:  {type: Number},
    contestant2Set2KillsFirst:  {type: Number},
    contestant1Set3KillsFirst:  {type: Number},
    contestant2Set3KillsFirst:  {type: Number},
    contestant1Set1FirstBlood:  {type: Number},
    contestant2Set1FirstBlood:  {type: Number},
    contestant1Set2FirstBlood:  {type: Number},
    contestant2Set2FirstBlood:  {type: Number},
    contestant1Set3FirstBlood:  {type: Number},
    contestant2Set3FirstBlood:  {type: Number},


    contestantWinner:           {name: String, ref: {type: Schema.ObjectId, ref: 'Contestant'}},

    boxingMethodOfVictory:      {type: String, enum: ['Decision', 'Knockout', 'Draw', 'Disqualification', 'No Contest']},
    mmaMethodOfVictory:         {type: String, enum: ['Decision', 'Knockout', 'Submission', 'Draw', 'Disqualification', 'No Contest']},
    draw:                       {type: Boolean},
    noContest:                  {type: Boolean},
    round:                      {type: Number},
    time:                       {minutes: {type:Number}, seconds: {type:Number}},

    cancelled:                  {type: Boolean},
    overtime:                   {type: Boolean},

    commentCount:               {type:Number, default:0},

    oldId:                      {type:Number},
    slug:                       {type: String},
    scores:                     {type: Boolean, default: false},
    resolved:                   {type: Boolean, default: false}

});

EventSchema.methods.getBet = function(betData, fields, callback){

    var betDb = _.find(this.betsAvailable, function(bet){
        var found = true;
        _.forEach(fields, function(field){
            if(typeof field === 'object'){
                for(var objField in field){
                    if(betData[objField][field[objField]] !== bet[objField][field[objField]]){
                        found = false;
                    }
                }
            } else {
                if (betData[field] !== bet[field]) {
                    found = false;
                }
            }
        });
        if(found) {
            return bet;
        }
    });
    callback(betDb);
};

mongoose.model('Event', EventSchema);