'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    user:           {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    userFrom:       {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    type:           {type: String, enum:['follow', 'copy pick', 'pick comment', 'comment reply']},
    comment:        {type: Schema.ObjectId,ref: 'Comment'},
    pick:           {type: Schema.ObjectId,ref: 'Pick'},
    new:            {type: Boolean, default:true},
    timestamp:      {type:Date, default: Date.now}
});

mongoose.model('Notification', NotificationSchema);
