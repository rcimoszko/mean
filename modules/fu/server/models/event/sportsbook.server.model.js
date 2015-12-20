'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var SportsbookSchema = new Schema({
    name:           {type: String, required: true, trim: true},
    url:            {type: String},
    feedUrl:        {type: String},
    last:           {type: Schema.Types.Mixed},
    sportsbookId:   {type:String}
});

SportsbookSchema.statics.getPinnacle = function(callback){
    this.findOne({name:'Pinnacle'}, function(err, sportsbook){
        if(err){
            console.log(err);
            callback(err, sportsbook);
        } else{
            callback(null, sportsbook);
        }
    });
};

SportsbookSchema.statics.getFiveDimes = function(callback){

    this.findOne({name:'5Dimes'}, function(err, sportsbook){
        if(err){
            console.log(err);
            callback(err, sportsbook);
        } else{
            callback(null, sportsbook);
        }
    });
};

mongoose.model('Sportsbook', SportsbookSchema);