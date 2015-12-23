'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChannelSchema = new Schema({
    name:   {type:String, trim: true, required:true},
    type:   {type: String, enum: ['sport', 'league', 'group'], required: true},
    sport:  {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
    league: {name: String, ref: {type: Schema.ObjectId, ref: 'League'}},
    group:  {name: String, ref: {type: Schema.ObjectId, ref: 'Group'}}
});

mongoose.model('Channel', ChannelSchema);