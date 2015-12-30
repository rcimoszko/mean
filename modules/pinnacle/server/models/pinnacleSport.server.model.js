'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinnacleSportSchema = new Schema({
    name:       {type:String},
    sportId:    {type: Schema.Types.Mixed},
    active:     {type: Boolean, default: false},

    sport:      {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}}
});

mongoose.model('PinnacleSport', PinnacleSportSchema);