'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var HotPickSchema = new Schema({
    bet:                {type: Schema.ObjectId, ref: 'Bet', required: true},
    event:              {type: Schema.ObjectId, ref: 'Event', required: true},
    sport:              {name: String, 'ref': {type: Schema.ObjectId, ref: 'Sport'}},
    league:             {name: String, 'ref': {type: Schema.ObjectId, ref: 'League'}},
    proCount:           {type:Number},
    proPicks:           [{type: Schema.ObjectId, ref: 'Pick'}],
    createdTime:        {type:Date, default: Date.now }
});

mongoose.model('HotPick', HotPickSchema);