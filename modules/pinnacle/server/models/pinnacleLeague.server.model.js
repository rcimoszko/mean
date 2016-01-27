'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinnacleLeagueSchema = new Schema({
    name:           {type:String},
    active:         {type:Boolean},
    leagueId:       {type: Schema.Types.Mixed},
    sportId:        {type: Schema.Types.Mixed},
    pinnacleSport:  {name: String, ref: {type: Schema.ObjectId, ref: 'PinnacleSport'}},
    last:           {type: String},

    league:         {name: String, ref: {type: Schema.ObjectId, ref: 'League'}},
    sport:          {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
    useScraper:     {type: Boolean, default: false}
});

mongoose.model('PinnacleLeague', PinnacleLeagueSchema);