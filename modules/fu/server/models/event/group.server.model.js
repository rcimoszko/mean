'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
        name:   {type:String},
        sport:  {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}}
    }
);

mongoose.model('Group', GroupSchema);