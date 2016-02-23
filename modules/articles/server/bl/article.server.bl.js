'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article');

function get(id, callback){

    function cb(err, article){
        callback(err, article);
    }

    Article.findById(id).exec(cb);
}

function getBySlug(slug, callback){

    function cb(err, article){
        callback(err, article);
    }

    Article.findOne({slug:slug}).exec(cb);
}

function getAll(callback){

    function cb(err, articles){
        callback(err, articles);
    }

    Article.find().exec(cb);

}

function update(data, article, callback) {

    function cb(err){
        callback(err, article);
    }

    article = _.extend(article, data);

    article.save(cb);
}

function create(data, user, callback) {

    function cb(err){
        callback(err, article);
    }
    data.user = {name:user.username, ref: user._id};
    var article = new Article(data);

    article.save(cb);
}

function del(article, callback){

    function cb(err){
        callback(err, article);
    }

    article.remove(cb);
}

function getByQuery(query, callback){
    Article.find(query, callback);
}
function getOneByQuery(query, callback){
    Article.findOne(query, callback);
}

function getBySport(sport, callback){
    getByQuery({'sport.ref':sport}, callback);
}

function getByLeague(league, callback){
    getByQuery({'league.ref':league}, callback);
}



exports.getAll      = getAll;
exports.get         = get;
exports.getBySlug   = getBySlug;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery   = getOneByQuery;

exports.getBySport   = getBySport;
exports.getByLeague  = getByLeague;