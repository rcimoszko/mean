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

    contestant1OTScore:         {type: Number},
    contestant2OTScore:         {type: Number},

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

    // Esports
    contestant1Map1Score:       {type: Number},
    contestant2Map1Score:       {type: Number},
    contestant1Map2Score:       {type: Number},
    contestant2Map2Score:       {type: Number},
    contestant1Map3Score:       {type: Number},
    contestant2Map3Score:       {type: Number},
    contestant1Map4Score:       {type: Number},
    contestant2Map4Score:       {type: Number},
    contestant1Map5Score:       {type: Number},
    contestant2Map5Score:       {type: Number},
    contestant1Map6Score:       {type: Number},
    contestant2Map6Score:       {type: Number},
    contestant1Map7Score:       {type: Number},
    contestant2Map7Score:       {type: Number},

    contestant1Map1Winner:       {type: Number},
    contestant2Map1Winner:       {type: Number},
    contestant1Map2Winner:       {type: Number},
    contestant2Map2Winner:       {type: Number},
    contestant1Map3Winner:       {type: Number},
    contestant2Map3Winner:       {type: Number},
    contestant1Map4Winner:       {type: Number},
    contestant2Map4Winner:       {type: Number},
    contestant1Map5Winner:       {type: Number},
    contestant2Map5Winner:       {type: Number},
    contestant1Map6Winner:       {type: Number},
    contestant2Map6Winner:       {type: Number},
    contestant1Map7Winner:       {type: Number},
    contestant2Map7Winner:       {type: Number},

    contestant1KillsFirst:      {type: Number},
    contestant2KillsFirst:      {type: Number},
    contestant1Map1KillsFirst:  {type: Number},
    contestant2Map1KillsFirst:  {type: Number},
    contestant1Map2KillsFirst:  {type: Number},
    contestant2Map2KillsFirst:  {type: Number},
    contestant1Map3KillsFirst:  {type: Number},
    contestant2Map3KillsFirst:  {type: Number},
    contestant1Map4KillsFirst:  {type: Number},
    contestant2Map4KillsFirst:  {type: Number},
    contestant1Map5KillsFirst:  {type: Number},
    contestant2Map5KillsFirst:  {type: Number},

    contestant1FirstBlood:  {type: Number},
    contestant2FirstBlood:  {type: Number},
    contestant1Map1FirstBlood:  {type: Number},
    contestant2Map1FirstBlood:  {type: Number},
    contestant1Map2FirstBlood:  {type: Number},
    contestant2Map2FirstBlood:  {type: Number},
    contestant1Map3FirstBlood:  {type: Number},
    contestant2Map3FirstBlood:  {type: Number},
    contestant1Map4FirstBlood:  {type: Number},
    contestant2Map4FirstBlood:  {type: Number},
    contestant1Map5FirstBlood:  {type: Number},
    contestant2Map5FirstBlood:  {type: Number},

    contestant1Map1FirstTo5Rds:  {type: Number},
    contestant2Map1FirstTo5Rds:  {type: Number},
    contestant1Map2FirstTo5Rds:  {type: Number},
    contestant2Map2FirstTo5Rds:  {type: Number},
    contestant1Map3FirstTo5Rds:  {type: Number},
    contestant2Map3FirstTo5Rds:  {type: Number},
    contestant1Map4FirstTo5Rds:  {type: Number},
    contestant2Map4FirstTo5Rds:  {type: Number},
    contestant1Map5FirstTo5Rds:  {type: Number},
    contestant2Map5FirstTo5Rds:  {type: Number},
    contestant1OverpassFirstTo5Rds: {type: Number},
    contestant2OverpassFirstTo5Rds: {type: Number},
    contestant1InfernoFirstTo5Rds: {type: Number},
    contestant2InfernoFirstTo5Rds: {type: Number},
    contestant1MirageFirstTo5Rds: {type: Number},
    contestant2MirageFirstTo5Rds: {type: Number},
    contestant1Dust2FirstTo5Rds: {type: Number},
    contestant2Dust2FirstTo5Rds: {type: Number},
    contestant1CobbleFirstTo5Rds: {type: Number},
    contestant2CobbleFirstTo5Rds: {type: Number},
    contestant1CacheFirstTo5Rds: {type: Number},
    contestant2CacheFirstTo5Rds: {type: Number},
    contestant1TrainFirstTo5Rds: {type: Number},
    contestant2TrainFirstTo5Rds: {type: Number},

    contestant1Map1FirstRd:  {type: Number},
    contestant2Map1FirstRd:  {type: Number},
    contestant1Map2FirstRd:  {type: Number},
    contestant2Map2FirstRd:  {type: Number},
    contestant1Map3FirstRd:  {type: Number},
    contestant2Map3FirstRd:  {type: Number},
    contestant1Map4FirstRd:  {type: Number},
    contestant2Map4FirstRd:  {type: Number},
    contestant1Map5FirstRd:  {type: Number},
    contestant2Map5FirstRd:  {type: Number},
    contestant1OverpassFirstRd:  {type: Number},
    contestant2OverpassFirstRd:  {type: Number},
    contestant1InfernoFirstRd:  {type: Number},
    contestant2InfernoFirstRd:  {type: Number},
    contestant1MirageFirstRd:  {type: Number},
    contestant2MirageFirstRd:  {type: Number},
    contestant1Dust2FirstRd:  {type: Number},
    contestant2Dust2FirstRd:  {type: Number},
    contestant1CacheFirstRd:  {type: Number},
    contestant2CacheFirstRd:  {type: Number},
    contestant1TrainFirstRd:  {type: Number},
    contestant2TrainFirstRd:  {type: Number},

    contestant1MapsWon:         {type: Number},
    contestant2MapsWon:         {type: Number},

    //CS:GO
    contestant1OverpassScore:   {type: Number},
    contestant2OverpassScore:   {type: Number},
    contestant1InfernoScore:   {type: Number},
    contestant2InfernoScore:   {type: Number},
    contestant1MirageScore:   {type: Number},
    contestant2MirageScore:   {type: Number},
    contestant1Dust2Score:   {type: Number},
    contestant2Dust2Score:   {type: Number},
    contestant1CobbleScore:   {type: Number},
    contestant2CobbleScore:   {type: Number},
    contestant1CacheScore:   {type: Number},
    contestant2CacheScore:   {type: Number},
    contestant1TrainScore:   {type: Number},
    contestant2TrainScore:   {type: Number},

    //Starcraft
    contestant1AceWinner:  {type: Number},
    contestant2AceWinner:  {type: Number},


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