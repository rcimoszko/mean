'use strict';

var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;

var VerificationTokenSchema = new Schema({
    _userId:    {type: Schema.ObjectId, required: true, ref: 'User'},
    token:      {type: String, required: true},
    createdAt:  {type: Date, required: true, default: Date.now, expires: '4h'}
});

VerificationTokenSchema.methods.createVerificationToken = function(callback) {
    var verificationToken = this;
    var token = uuid.v4();
    verificationToken.set('token', token);
    verificationToken.save( function (err) {
        if (err) return callback(err);
        return callback(null, token);
    });
};

mongoose.model('VerificationToken', VerificationTokenSchema);
