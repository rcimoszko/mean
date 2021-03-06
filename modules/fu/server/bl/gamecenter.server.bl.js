'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PicksBl = require('./pick.server.bl'),
    MakePicksBl = require('./makepicks.server.bl'),
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
            contestant2Color: '#21759B',
            contestant1LogoUrl: event.contestant2.ref.logoUrl,
            contestant2LogoUrl: event.contestant1.ref.logoUrl,
            contestant2FinalScore: event.contestant1FinalScore,
            contestant1FinalScore: event.contestant2FinalScore
        };
        if(event.contestant2.ref.lightColor) header.contestant1Color = event.contestant2.ref.darkColor;
        if(event.contestant1.ref.lightColor) header.contestant2Color = event.contestant1.ref.darkColor;
        if(typeof event.contestant1FinalScore !== 'undefined') header.hasScores = true;
        if(event.contestantWinner){
            if(String(event.contestantWinner.ref) === String(event.contestant1.ref._id)){
                header.winner = 2;
            } else if(String(event.contestantWinner.ref) === String(event.contestant2.ref._id)) {
                header.winner = 1;
            }
        }

        callback(null, header);
    }

    function getPicks_todo(callback){
        var todo = [];
        var picks = {};

        function getPicks(callback){
            PicksBl.getByQuery({event:event._id}, callback);
        }

        function getProPicks(generalPicks, callback){
            var proPicks = _.remove(generalPicks, {premium: true});
            picks = {general: generalPicks, pro:[]};
            picks.proCount = 0;
            if(proPicks.length){
                if(!user || (!user.premium && !user.trial)){
                    picks.proCount = proPicks.length;
                    picks.proHidden = true;
                    for(var i=0; i<proPicks.length; i++){
                        picks.pro.push({hidden:true, user:proPicks[i].user});
                    }
                } else {
                    picks.proCount = proPicks.length;
                    picks.pro = proPicks;
                }
            }
            if(!user){
                picks.general = [];
                picks.generalCount = generalPicks.length;
                picks.generalHidden = true;
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
        EventConsensusBl.getGamecenterConsensus(event, callback);
    }

    function getDiscussion_todo(callback){
        CommentsBl.getByEvent(event._id, callback);
    }

    function getBets_todo(callback){
        MakePicksBl.getEventBets(event._id, callback);
    }

    function getEvent(callback){
        var populate = [{path: 'sport.ref', model:'Sport'},{path: 'league.ref', model:'League'}];
        m_Event.populate(event, populate, callback);
    }

    var todo = {
        menu: getMenu,
        header: getHeader,
        picks: getPicks_todo,
        consensus: getConsensus_todo,
        discussion: getDiscussion_todo,
        bets: getBets_todo,
        event: getEvent
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