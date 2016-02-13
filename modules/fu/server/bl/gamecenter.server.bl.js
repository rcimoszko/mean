'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PicksBl = require('./pick.server.bl'),
    EventConsensusBl = require('./event.consensus.server.bl'),
    CommentsBl = require('./comment.server.bl'),
    m_Event = mongoose.model('Event');


function get(event, league, user, callback){
    if(!league && String(event.league.ref) !== String(league._id)) callback(null, null);

    function getMenu(callback){
        callback(null);
    }

    function getHeader(callback){
        var header = {
            leagueName: league.name,
            startTime: event.startTime,
            contestant1Name: event.contestant2.name,
            contestant2Name: event.contestant1.name,
            contestant1Color: '#E9893A',
            contestant2Color: '#21759B'
        };
        if(event.contestant2.ref.lightColor) header.contestant1Color = event.contestant2.ref.lightColor;
        if(event.contestant2.ref.lightColor) header.contestant2Color = event.contestant1.ref.lightColor;

        callback(null, header);
    }

    function getPicks_todo(callback){
        var todo = [];
        var picks = {};

        function getPicks(callback){
            PicksBl.getByQuery({event:event._id}, callback);
        }
        function getProPicks(generalPicks, callback){
            picks = {general: generalPicks};
            var proPicks = _.filter(generalPicks, {premium: true});
            if(proPicks.length){
                if(!user.premium){
                    picks.pro.proCount = proPicks.length;
                    picks.pro.hidden = true;
                } else {
                    picks.pro = proPicks;
                }
            }
            callback();
        }

        todo.push(getPicks);
        todo.push(getProPicks);

        function cb(err){
            callback(err, picks);
        }
        async.waterfall(todo, cb);

    }

    function getConsensus_todo(callback){
        callback(null);
    }

    function getDiscussion_todo(callback){
        CommentsBl.getByEvent(event._id, callback);
    }

    var todo = {
        menu: getMenu,
        header: getHeader,
        picks: getPicks_todo,
        consensus: getConsensus_todo,
        discussion: getDiscussion_todo
    };

    async.parallel(todo, callback);
}

function getBySlug(slug, callback){

    function cb(err, event){
        callback(err, event);
    }
    var populate = [{path: 'contestant1.ref', model: 'Contestant'}, {path:'contestant2.ref', model:'Contestant'}];
    m_Event.findOne({slug:slug}).populate(populate).exec(cb);
}

exports.get         = get;
exports.getBySlug   = getBySlug;