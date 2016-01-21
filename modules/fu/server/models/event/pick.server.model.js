'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var PickSchema = new Schema({
    bet:                {type: Schema.ObjectId, ref: 'Bet', required: true},
    event:              {type: Schema.ObjectId, ref: 'Event', required: true},
    sport:              {type: Schema.ObjectId, ref: 'Sport', required: true},
    league:             {type: Schema.ObjectId, ref: 'League', required: true},
    user:               {name: String, 'ref': {type: Schema.ObjectId, ref: 'User'}},

    betType:            {type: String, required: true}, // enum: ['spread', 'total points', 'team totals', 'moneyline', 'sets'],
    otIncluded:         {type: Boolean}, //Hockey Only
    betDuration:        {type: String, required: true}, // enum: ['match', 'matchups', 'game', 'fight', '1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'map 1'],
    altLine:            {type: Boolean},

    odds:               {type: Number},
    units:              {type: Number},
    profit:             {type: Number, default: 0},
    roi:                {type: Number, default: 0},

    result:             {type: String, enum: ['Pending', 'Win', 'Loss', 'Push', 'Cancelled', 'Half-Win', 'Half-Loss'], default: 'Pending', required: true},

    premium:            {type: Boolean, default:false},
    premiumTypes:       [{type: String, enum:['AllTime', 'Last30Days']}],
    premiumStats:       {
                            AllTime: {profit: Number, roi: Number, win: Number, loss: Number},
                            Last30Days: {profit: Number, roi: Number, win: Number, loss: Number}
                        },
    timeSubmitted:      {type: Date, default: Date.now},
    timeResolved:       {type: Date},
    eventStartTime:     {type: Date},


    spread:             {type: Number},
    contestant:         {name: String, ref: {type: Schema.ObjectId, ref: 'Contestant'}, number: {type: Number, min: 1, max: 2}, homeAway: {type: String}},
    points:             {type: Number},
    overUnder:          {type: String, enum: ['over', 'under']},
    draw:               {type: Boolean},

    commentCount:       {type:Number, default:0},
    slug:               {type: String},

    oldPickId:          {type: Number},  //to remove
    oldRecordedLineId:  {type: Number},  //to remove
    underdog:           {type: Boolean},

    copiedOrigin:       {user: {name: String, ref: {type: Schema.ObjectId, ref: 'User'}}, pick: {type: Schema.ObjectId, ref: 'Pick'}},
    copiedFrom:         {user: {name: String, ref: {type: Schema.ObjectId, ref: 'User'}}, pick: {type: Schema.ObjectId, ref: 'Pick'}},
    copied:             [{name: String, ref: {type: Schema.ObjectId, ref: 'User'}, _id: false }],

    userStats:          {type: Schema.Types.Mixed}
});

mongoose.model('Pick', PickSchema);