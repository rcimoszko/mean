'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FollowSchema = new Schema({
    follower:   {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    following:  {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    startDate:  {type: Date, default:Date.now},
    endDate:    {type: Date, default:null},
    notify: {type: Boolean, default:true}
});

mongoose.model('Follow', FollowSchema);