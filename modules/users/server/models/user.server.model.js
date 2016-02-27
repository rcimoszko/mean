'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  pbkdf2 = require('pbkdf2-sha256'),
  config = require('../../../../config/config'),
  _ = require('lodash'),
  MailChimpAPI = require('mailchimp').MailChimpAPI,
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');


var stripe = require('stripe')(config.stripe.secretKey);

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};


/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};



function unique(modelName, field, caseSensitive) {
    return function(value, respond) {
        if(value && value.length) {
            var query = mongoose.model(modelName).where(field, new RegExp('^'+value+'$', caseSensitive ? 'i' : undefined));
            if(this.isNew) {
                query = query.where('_id').ne(this._id);
                query.count(function (err, n) {
                    respond(n < 1);
                });
            } else {
                respond(true);
            }
        } else if(typeof value === 'undefined'){
            respond(true);
        }
        else if(field === 'email' && value === ''){
            respond(true);
        }
        else{
            respond(false);
        }
    };
}

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
      type: String,
      trim: true,
      validate: [unique('User', 'email'), 'Email already exists'],
      match: [/.+\@.+\..+/, 'Please fill a valid address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password must be greater than 6 characters.']
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },

    verified:               {type: Boolean,default: false},
    base:                   {type: Boolean,default: false},
    premium:                {type: Boolean,default: false},
    lifetimePremium:        {type: Boolean,default: false},
    trial:                  {type: Boolean,default: false},
    cancelledPremium:       {type: Boolean},
    premiumEndDate:         {type: Date},
    premiumRenewDate:       {type: Date},
    birthday:               {type: Date},

    units:                  {type: Number,default: 150},

    oddsFormat:             {type: String, enum: ['American', 'Decimal', 'Fractional'],default: 'Decimal'},
    favoriteSport:          {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
    favoriteSportNew:       {name: String, ref: {type: Schema.ObjectId, ref: 'Sport'}},
    profileUrl:             {type: String,default: 'https://res.cloudinary.com/hltkmtrz5/image/upload/v1408811714/profile-default.png'},
    avatarUrl:              {type: String,default: 'https://res.cloudinary.com/hltkmtrz5/image/upload/c_fill,w_50/v1408811714/profile-default.png'},
    twitterHandle:          {type: String },
    usernameSet:            {type: Boolean,default: false},


    stripeId:               {type: String},
    subscriptionId:         {type: String},
    oldId:                  {type: Number},
    updatePassword:         {type: Boolean},
    active:                 {type: Boolean, default: true},

    dailyBet:               {type: Number, default: 0 },
    winStreak:              {type: Number,default: 0},
    loseStreak:             {type: Number,default: 0},
    points:                 {type: Number,default: 0},
    referral:               {type: String },

    followingCount:         {type: Number, default: 0},
    followerCount:          {type: Number,default: 0},

    copyCount:              {type: Number,default: 0},
    copiedCount:            {type: Number, default: 0},

    pickMade:               {type: Boolean,default: false},
    userReferred:           {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},

    description:            {type: String, trim:true}
});

UserSchema.path('description').validate(function (v) {
    return v.length <= 140;
}, 'The maximum length is 140.');


/**
 * Hook a pre validate method to test the local password
 */
/*
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};*/


//Pres save to check password
UserSchema.pre('save', function(next) {
    if(!this.updatePassword){
        if (this.password && this.password.length > 6 && this.password.length !== 88) {
            this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            this.password = this.hashPassword(this.password);
        }
    }
    next();
});

//Post save to subscribe to mailchimp email list
UserSchema.post('save', function(user){
    var now = new Date();
    var dateDiff = now - user.created;
    if(dateDiff < 1000 && user.email && process.env.NODE_ENV === 'production'){
        try {
            var api = new MailChimpAPI(config.mailchimp.apiKey, { version : '2.0' });
            api.lists_list(function(err, lists){
                if(err){
                    console.log(err);
                } else {
                    _.each(lists.data, function(list){
                        if(list.name === config.mailchimp.listName){
                            api.lists_subscribe({id: list.id, email: {email: user.email}, merge_vars: {'FNAME': user.firstName, 'LNAME': user.lastName, 'UNAME': user.username }, double_optin: false}, function(err, response){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }
});

//Create instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

//Validdate Old Passtword
UserSchema.methods.validateOldPassword = function (key, string) {
    var parts = string.split('$');
    var iterations = parts[1];
    var salt = parts[2];
    return pbkdf2(key, new Buffer(salt), iterations, 32).toString('base64') === parts[3];
};

//Create instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
    if(this.updatePassword){
        try {
            return this.validateOldPassword(password, this.password);
        }
        catch(err) {
            console.log(err);
            return false;
        }

    } else {
        return this.password === this.hashPassword(password);
    }
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
* Generates a random passphrase that passes the owasp test.
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase.
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters.
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

UserSchema.methods.checkPremium = function(callback) {
    var _this = this;
    if(_this.stripeId && _this.subscriptionId){
        stripe.customers.retrieveSubscription(this.stripeId, this.subscriptionId, function(err, subscription) {
            if(subscription){
                var plan = subscription.plan;
                var endDate = new Date(subscription.current_period_end*1000);
                var now = Date();
                if(endDate < now) {
                    switch(plan.id){
                        case 'Base Subscription':
                            _this.base = false;
                            break;
                        case '1 Month Premium':
                        case '6 Months Premium':
                        case '1year':
                        case '6month':
                        case 'Pro':
                            _this.premium = false;
                            break;
                    }
                    _this.save(function(err, user){
                        callback();
                    });
                } else {
                    callback();
                }
            } else {
                //cancel subscription
                _this.premium = false;
                _this.base = false;
                _this.save(function(err, user){
                    callback();
                });
            }
        });
    } else {
        callback();
    }
};

mongoose.model('User', UserSchema);
