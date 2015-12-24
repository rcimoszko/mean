'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    user:           {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    type:           {type: String, enum:['activity', 'achievement', 'copy']},
    activity:       {name: String, ref: {type: Schema.ObjectId, ref: 'Activity'}},
    achievement:    {name: String, ref: {type: Schema.ObjectId,ref: 'Achievement'}},
    pick:           {type: Schema.ObjectId,ref: 'Pick'},
    new:            {type: Boolean, default:true},
    timestamp:      {type:Date, default: Date.now}
});

mongoose.model('Notification', NotificationSchema);