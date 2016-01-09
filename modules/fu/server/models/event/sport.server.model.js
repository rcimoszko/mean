'use strict';

var mongoose = require('mongoose'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var SportSchema = new Schema({
    name:       {type: String, trim: true, required: 'Name cannot be blank'},
    iconUrl:    {type: String},
    active:     {type: Boolean},
    disabled:   {type: Boolean, default: false},
    main:       {type: Boolean},
    oldId:      {type: Number},  //to remove
    pickMade:   {type: Boolean},
    slug:       {type: String} // Added
});

SportSchema.pre('save', function(next) {
    if(this.name && this.isModified('name')){
        this.slug = slug(this.name);
    }
    next();
});


mongoose.model('Sport', SportSchema);