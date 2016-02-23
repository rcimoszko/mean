'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ArticleBl = require('../bl/article.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Article Id is invalid'
        });
    }

    function cb (err, article){
        if (err) return next(err);
        if (!article) {
            return res.status(404).send({
                message: 'Article not found'
            });
        }
        req.article = article;
        next();
    }

    ArticleBl.get(id, cb);
}


function bySlug(req, res, next, slug){

    function cb (err, article){
        if (err) return next(err);
        if (!article) {
            return res.status(404).send({
                message: 'Article not found'
            });
        }
        req.article = article;
        next();
    }

    ArticleBl.getBySlug(slug, cb);
}

function getAll(req, res, next){

    function cb (err, articles){
        if (err) return next(err);
        if (!articles) {
            return res.status(404).send({
                message: 'Articles not found'
            });
        }
        res.json(articles);
    }


    ArticleBl.getAll(cb);

}

function get(req, res, next){
    res.json(req.article);
}

function update(req, res, next){
    function cb (err,article){
        if (err) return next(err);
        if (!article) {
            return res.status(500).send({
                message: 'Failed to update Article'
            });
        }
        res.json(article);

    }

    var article = req.article;
    var data = req.body;
    ArticleBl.update(data, article, cb);
}

function create(req, res, next){
    function cb (err,article){
        if (err) return next(err);
        if (!article) {
            return res.status(500).send({
                message: 'Failed to create Article'
            });
        }
        res.json(article);

    }
    var data = req.body;
    var user = req.user;
    ArticleBl.create(data, user, cb);
}

function del(req, res, next){

    function cb (err, article){
        if (err) return next(err);
        if (!article) {
            return res.status(500).send({
                message: 'Failed to delete Article'
            });
        }
        res.json(article);
    }

    var article = req.article;
    ArticleBl.delete(article, cb);

}

exports.byId    = byId;
exports.bySlug  = bySlug;
exports.getAll  = getAll;
exports.get     = get;
exports.create  = create;
exports.update  = update;
exports.delete  = del;

/*
'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  ArticleBl = require('')
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};
exports.read = function (req, res) {
  res.json(req.article);
};

exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
*/
