'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var HistoricalValueSchema = new Schema({
    value:      {type: Number},
    timestamp:  {type: Date, default:Date.now}
}, { _id: false });


var HistoricalValuesSchema = new Schema({
    bet:    {type: Schema.ObjectId, ref: 'BetSchema'},
    type:   {type: String, enum: ['odds', 'spread', 'points']},
    values: [HistoricalValueSchema]
});

mongoose.model('HistoricalValues', HistoricalValuesSchema);
mongoose.model('HistoricalValue', HistoricalValueSchema);