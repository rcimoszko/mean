'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var ContestantLogoSchema = new Schema({
    name:           {type: String, trim: true, required: true},
    abbrName:       {type: String, trim: true},
    logoUrl:        {type: String, trim: true}
});

mongoose.model('ContestantLogo', ContestantLogoSchema);