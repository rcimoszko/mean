'use strict';

var mongoose = require('mongoose'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
        name:   {type:String},
        sport:  {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
        slug:   {type: String}
    }
);

GroupSchema.pre('save', function(next) {
    if(this.name && this.isModified('name')){
        this.slug = slug(this.name);
    }
    next();
});

mongoose.model('Group', GroupSchema);