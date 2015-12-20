'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SportSchema = new Schema({
    name:       {type: String, trim: true, required: 'Name cannot be blank'},
    iconUrl:    {type: String},
    active:     {type: Boolean},
    disabled:   {type: Boolean, default: false},
    main:       {type: Boolean},
    oldId:      {type: Number},
    pickMade:   {type: Boolean}
});

mongoose.model('Sport', SportSchema);