'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
    timestamp:    {type: Date, default: Date.now},
    message:      {type: String, default: '', trim: true},
    user:         {name: String, ref: {type: Schema.ObjectId,ref: 'User'}},
    channel:      {name: String, ref: {type: Schema.ObjectId,ref: 'Channel'}}

});

mongoose.model('Chat', ChatSchema);