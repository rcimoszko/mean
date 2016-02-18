'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    EventBl = require('./event.server.bl'),
    m_Comment = mongoose.model('Comment');

var populate = [
    {path:'users', model: 'User', select: 'username avatarUrl'},
    {path:'user.ref', model: 'User', select:'username avatarUrl'},
    {path:'pick', model: 'Pick'},
    {path:'event', model: 'Event', select:'contestant1 contestant2 slug sport commentCount'}
];


function get(id, callback){

    function cb(err, comment){
        callback(err, comment);
    }

    m_Comment.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, comments){
        callback(err, comments);
    }

    m_Comment.find().exec(cb);

}

function update(data, comment, callback) {

    function cb(err){
        callback(err, comment);
    }

    comment = _.extend(comment, data);

    comment.save(cb);
}

function createEventComment(text, event, user, callback){
    var todo = [];
    var comment = {
        users: [user._id],
        text: text,
        preview: text,
        user: {name: user.username, ref: user._id},

        event: event._id,
        sport: event.sport.ref,
        league: event.league.ref
    };

    function createComment(callback){
        comment = new m_Comment(comment);
        function cb(err, comment){
            callback(err);
        }
        comment.save(cb);
    }

    function updateCommentCount(callback){
        event.commentCount++;
        function cb(err, event){
            callback(err);
        }
        event.save(cb);
    }

    function populateComment(callback){
        m_Comment.populate(comment, populate, callback);
    }

    todo.push(createComment);
    todo.push(updateCommentCount);
    todo.push(populateComment);

    function cb(err, comment){
        callback(err, comment);
    }

    async.waterfall(todo, cb);
}

function eventCommentReply(comment, event, user, text, replyIndex, callback){
    var todo = [];

    var reply = {
        user: {name: user.username, ref: user._id},
        timestamp: new Date(),
        text: text,
        replies:[]
    };

    function insertReply(callback){

        var path = replyIndex.split(',');
        var strPath = 'replies';
        if(path.length > 0) {
            for (var i = 0; i < path.length; i++) {
                if(i !== 0) strPath = strPath + '.' + path[i] + '.replies';
            }
        }

        var query = {_id: comment._id};
        var update = {preview: text, $push: {}};
        update.$push[strPath] = reply;


        function cb(err, comment){
            callback(err);
        }

        m_Comment.update(query, update, cb);
    }

    function updateCommentCount(callback){
        event.commentCount++;
        function cb(err, event){
            callback(err);
        }
        event.save(cb);
    }

    function updateUserList(callback){
        var query = {_id: comment._id};
        var update = {$addToSet: {users: user._id}};

        function cb(err, comment){
            console.log(comment);
            callback(err, comment);
        }

        m_Comment.findOneAndUpdate(query, update, cb);
    }

    function populateComment(comment, callback){
        m_Comment.populate(comment, populate, callback);
    }

    function cb(err, comment){
        var data = {
            comment: comment,
            reply: reply
        };
        callback(err, data);
    }

    todo.push(insertReply);
    todo.push(updateCommentCount);
    todo.push(updateUserList);
    todo.push(populateComment);

    async.waterfall(todo, cb);
}

function pickCommentReply(comment, pick, user, text, replyIndex, callback){
    var todo = [];

    var reply = {
        user: {name: user.username, ref: user._id},
        timestamp: new Date(),
        text: text,
        replies:[]
    };

    function insertReply(callback){

        var path = replyIndex.split(',');
        var strPath = 'replies';
        if(path.length > 0) {
            for (var i = 0; i < path.length; i++) {
                if(i !== 0) strPath = strPath + '.' + path[i] + '.replies';
            }
        }

        var query = {_id: comment._id};
        var update = {preview:text, $push: {}};
        update.$push[strPath] = reply;


        function cb(err, comment){
            callback(err);
        }

        m_Comment.update(query, update, cb);
    }

    function updatePickCommentCount(callback){
        pick.commentCount++;
        function cb(err, pick){
            callback(err);
        }
        pick.save(cb);
    }

    function updateEventCommentCount(callback){
        var query = {_id: pick.event};
        var update = {$inc: {commentCount:1}};
        function cb(err, event){
            callback(err);
        }
        EventBl.updateBy(query, update, cb);
    }

    function updateUserList(callback){
        var query = {_id: comment._id};
        var update = {$addToSet: {users: user._id}};

        function cb(err, comment){
            callback(err, comment);
        }

        m_Comment.findOneAndUpdate(query, update, cb);
    }

    function populateComment(comment, callback){
        m_Comment.populate(comment, populate, callback);
    }

    function cb(err, comment){
        var data = {
            comment: comment,
            reply: reply
        };
        callback(err, data);
    }

    todo.push(insertReply);
    todo.push(updatePickCommentCount);
    todo.push(updateEventCommentCount);
    todo.push(updateUserList);
    todo.push(populateComment);

    async.waterfall(todo, cb);
}

function createPickComment(text, pick, user, callback){
    var todo = [];
    var comment = {
        users: [user._id],
        text: text,
        preview: text,
        user: {name: user.username, ref: user._id},

        pick: pick._id,
        event: pick.event,
        sport: pick.sport,
        league: pick.league
    };

    function createComment(callback){
        comment = new m_Comment(comment);
        function cb(err, comment){
            callback(err);
        }
        comment.save(cb);
    }

    function updatePickCommentCount(callback){
        pick.commentCount++;
        function cb(err, pick){
            callback(err);
        }
        pick.save(cb);
    }


    function updateEventCommentCount(callback){
        var query = {_id: pick.event};
        var update = {$inc: {commentCount:1}};
        function cb(err, event){
            callback(err);
        }
        EventBl.updateBy(query, update, cb);
    }

    function populateComment(callback){
        m_Comment.populate(comment, populate, callback);
    }

    todo.push(createComment);
    todo.push(updatePickCommentCount);
    todo.push(updateEventCommentCount);
    todo.push(populateComment);


    async.waterfall(todo, callback);
}


function del(comment, callback){

    function cb(err){
        callback(err, comment);
    }

    comment.remove(cb);
}

function getByQuery(query, callback){
    m_Comment.find(query).populate(populate).exec(callback);
}

function getBySport(sport, callback){
    getByQuery({sport:sport}, callback);
}

function getByLeague(league, callback){
    getByQuery({league:league}, callback);
}

function getByEvent(event, callback){
    getByQuery({event:event}, callback);
}

function getByPick(pick, callback){
    getByQuery({pick:pick}, callback);
}


function populateBy(comments, populate, callback){
    m_Comment.populate(comments, populate, callback);
}

function getPreviews(query, count, callback){
    m_Comment.find(query).sort({timestamp:-1}).limit(count)
        .populate('sport', 'name')
        .populate('league', 'name slug')
        .populate('event', 'contestant1 contestant2 slug commentCount sport')
        .populate('pick')
        .exec(callback);
}

exports.getAll      = getAll;
exports.get         = get;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.populateBy  = populateBy;

exports.getPreviews  = getPreviews;

exports.getBySport   = getBySport;
exports.getByLeague  = getByLeague;
exports.getByEvent   = getByEvent;
exports.getByPick    = getByPick;

exports.createEventComment   = createEventComment;
exports.createPickComment    = createPickComment;
exports.eventCommentReply    = eventCommentReply;
exports.pickCommentReply      = pickCommentReply;

