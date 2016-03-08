'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var HotPickSchema = new Schema({
    bet:                {type: Schema.ObjectId, ref: 'Bet', required: true},
    event:              {type: Schema.ObjectId, ref: 'Event', required: true},
    sport:              {type: Schema.ObjectId, ref: 'Sport', required: true},
    league:             {type: Schema.ObjectId, ref: 'League', required: true},
    proCount:           {type:Number, default:0},
    proPicks:           [{type: Schema.ObjectId, ref: 'Pick'}],
    createdTime:        {type:Date, default: Date.now },
    updatedTime:        {type:Date, default: Date.now }
});

mongoose.model('HotPick', HotPickSchema);