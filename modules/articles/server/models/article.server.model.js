'use strict';

var mongoose = require('mongoose'),
    slug = require('speakingurl'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    datePublished:  {type: Date, default: Date.now},
    imageUrl:       {type: String, trim:true},
    title:          {type: String, default: '', trim: true,required: 'Title cannot be blank'},
    content:        {type: String, default: '', trim: true},
    user:           {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    author:         {type: String, trim: true},
    keywords:       [String],
    sport:          [{type: Schema.ObjectId, ref: 'User'}],
    league:         [{type: Schema.ObjectId, ref: 'League'}],
    slug:           {type: String},
    published:      {type: Boolean, default:false}
});

ArticleSchema.pre('save', function(next) {
    if(this.name && this.isModified('title')){
        this.slug = slug(this.title);
    }
    next();
});

mongoose.model('Article', ArticleSchema);
