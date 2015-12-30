'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;


var BetSchema = new Schema({
    event:          {type: Schema.ObjectId, ref: 'Event'},
    sportsbook:     {name: String, ref: {type: Schema.ObjectId, ref: 'Sportsbook'}},
    pinnacleId:     {type: Number},
    pinnacleAltId:  {type: Number},
    betType:        {type: String, required: true}, // enum: ['spread', 'total points', 'team totals', 'moneyline', 'sets'],
    betDuration:    {type: String, enum: ['match', 'matchups', 'game', 'fight', '1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'map 1'], required: true},
    otIncluded:     {type: Boolean}, //Hockey Only
    odds:           {type: Number},
    altLine:        {type: Boolean},
    altNumber:      {type: Number},
    cutOffTime:     {type: Date},
    spread:         {type: Number},
    contestant:     {name: String, ref: {type: Schema.ObjectId, ref: 'Contestant'}, number: {type: Number, min: 1, max: 2}},
    points:         {type: Number},
    overUnder:      {type: String, enum: ['over', 'under']},
    draw:           {type: Boolean},
    underdog:       {type: Boolean},

    openingOdds:    {type: Number},
    openingSpread:  {type: Number},
    openingPoints:  {type: Number}
});

mongoose.model('Bet', BetSchema);