'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    CommentBl = require('./comment.server.bl');



function getPreviews(query, callback){
    var sportId = query.sportId;
    var leagueId = query.leagueId;
    var eventId = query.eventId;
    var pickId = query.pickId;

    function getComments(){

    }


}