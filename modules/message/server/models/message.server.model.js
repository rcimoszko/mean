
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    conversation:   {type: Schema.ObjectId, ref: 'Conversation'},
    timestamp:      {type: Date, default: Date.now},
    message:        {type: String, default: '', trim: true},
    user:           {name: String, ref: {type: Schema.ObjectId,ref: 'User'}}
});

MessageSchema.pre('save', function (next) {
    this.timestamp = Date.now();
    return next();
});

mongoose.model('Message', MessageSchema);