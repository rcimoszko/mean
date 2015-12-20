'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CountrySchema = new Schema({
    name:           {type:String, trim: true, required:true},
    countryNames:   [String]
});

mongoose.model('Country', CountrySchema);