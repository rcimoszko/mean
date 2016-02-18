'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    users:                  [{type: Schema.ObjectId, ref: 'User'}],
    discussion:             {type: Schema.ObjectId}, //userid, eventid, pickid
    timestamp:              {type: Date, default: Date.now},
    text:                   {type: String, default: '', trim: true},
    user:                   {name: String, ref: {type: Schema.ObjectId,ref: 'User'}},
    replies:                [Schema.Types.Mixed],

    preview:                {type: String, default: '', trim: true},

    profile_boardpost_id:   {type: Number}, //to remove
    picks_eventcomment_id:  {type: Number}, //to remove
    picks_pickcomment_id:   {type: Number},  //to remove

    league:                 {type: Schema.ObjectId, ref: 'League'}, //TO POPULATE
    event:                  {type: Schema.ObjectId, ref: 'Event'},  //TO POPULATE
    sport:                  {type: Schema.ObjectId, ref: 'Sport'},  //TO POPULATE
    pick:                   {type: Schema.ObjectId, ref: 'Pick'}    //TO POPULATE
});

mongoose.model('Comment', CommentSchema);