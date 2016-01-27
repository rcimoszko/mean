'use strict';

var betDurations = {
    'Badminton':{
        0: 'match',
        1: '1st game',
        2: '2nd game',
        3: '3rd game'
    },
    'Bandy':{
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Baseball': {
        0: 'game',
        1: '1st 5 innings',
        2: '2nd half'
    },
    'Basketball': {
        0: 'game',
        1: '1st half',
        2: '2nd half',
        3: '1st quarter',
        4: '2nd quarter',
        5: '3rd quarter',
        6: '4th quarter'
    },
    'Beach Volleyball': {
        0: 'match',
        1: '1st set',
        2: '2nd set',
        3: '3rd set'
    },
    'Boxing':{
        0: 'match'
    },
    'Chess':{
        0: 'match'
    },
    'Cricket': {
        0: 'match',
        1: '1st inning',
        2: '2nd inning'
    },
    'Curling': {
        0: 'game',
        1: '1st end'
    },
    'Darts': {
        0: 'match',
        1: '1st set',
        2: '2nd set',
        3: '3rd set',
        4: '4th set',
        5: '5th set'
    },
    'Darts (Legs)': {
        0: 'match',
        1: '1st leg',
        2: '2nd leg',
        3: '3rd leg',
        4: '4th leg',
        5: '5th leg',
        6: '6th leg'
    },
    'E Sports': {
        0: 'match',
        1: '1st map'
    },
    'Field Hockey': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Floorball': {
        0: 'match',
        1: '1st period',
        2: '2nd period',
        3: '3rd period'
    },
    'Football': {
        0: 'game',
        1: '1st half',
        2: '2nd half',
        3: '1st quarter',
        4: '2nd quarter',
        5: '3rd quarter',
        6: '4th quarter'
    },
    'Futsal': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Golf': {
        0: 'matchups'
    },
    'Handball': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Hockey': {
        0: 'game',
        1: '1st period',
        2: '2nd period',
        3: '3rd period'
    },
    'Horse Racing': {
        0: 'race'
    },
    'Lacrosse': {
        0: 'match',
        1: '1st half',
        2: '2nd half',
        3: '1st quarter',
        4: '2nd quarter',
        5: '3rd quarter',
        6: '4th quarter'
    },
    'Mixed Martial Arts': {
        0: 'fight',
        1: 'round 1',
        2: 'round 2',
        3: 'round 3',
        4: 'round 4',
        5: 'round 5'
    },
    'Other Sports': {
        0: 'game'
    },
    'Politics': {
        0: 'election'
    },
    'Rink Hockey': {
        0: 'match',
        1: '1st period',
        2: '2nd period'
    },
    'Rugby League': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Rugby Union': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Snooker': {
        0: 'match',
        1: '1st frame'
    },
    'Soccer': {
        0: 'match',
        1: '1st half',
        2: '2nd half'
    },
    'Softball': {
        0: 'game',
        1: '1st half',
        2: '2nd half'
    },
    'Squash': {
        0: 'match',
        1: '1st game',
        2: '2nd game',
        3: '3rd game',
        4: '4th game',
        5: '5th game'
    },
    'Table Tennis': {
        0: 'match',
        1: '1st game',
        2: '2nd game',
        3: '3rd game',
        4: '4th game',
        5: '5th game',
        6: '6th game'
    },
    'Tennis': {
        0: 'match',
        1: '1st set winner',
        2: '2nd set winner',
        3: '3rd set winner',
        4: '4th set winner',
        5: '5th set winner'
    },
    'Volleyball':{
        0: 'match',
        1: '1st set',
        2: '2nd set',
        3: '3rd set',
        4: '4th set',
        5: '5th set'
    },
    'Volleyball (Points)':{
        0: 'match',
        1: '1st set',
        2: '2nd set',
        3: '3rd set',
        4: '4th set',
        5: '5th set'
    },
    'Water Polo': {
        0: 'match',
        1: '1st period',
        2: '2nd period',
        3: '3rd period',
        4: '4th period'
    },
    'Padel Tennis': {
        0: 'match',
        1: '1st set winner',
        2: '2nd set winner',
        3: '3rd set winner'
    },
    'Aussie Rules Football':{
        0: 'game',
        1: '1st half',
        2: '2nd half',
        3: '1st quarter',
        4: '2nd quarter',
        5: '3rd quarter',
        6: '4th quarter'
    },
    'Alpine Skiing':{
        0: 'matchups'
    },
    'Biathlon':{
        0: 'matchups'
    },
    'Ski Jumping':{
        0: 'matchups'
    },
    'Cross Country':{
        0: 'matchups'
    },
    'Formula 1':{
        0: 'matchups'
    },
    'Cycling':{
        0: 'matchups'
    },
    'Bobsleigh':{
        0: 'matchups'
    },
    'Figure Skating':{
        0: 'matchups'
    },
    'Freestyle Skiing':{
        0: 'matchups'
    },
    'Luge':{
        0: 'matchups'
    },
    'Nordic Combined':{
        0: 'matchups'
    },
    'Short Track':{
        0: 'matchups'
    },
    'Skeleton':{
        0: 'matchups'
    },
    'Snow Boarding':{
        0: 'matchups'
    },
    'Speed Skating':{
        0: 'matchups'
    }
};

function getBetDuration(sportName, betNum){
    if(sportName in betDurations && betNum in betDurations[sportName]){
        return betDurations[sportName][betNum];
    }
}

exports.getBetDuration = getBetDuration;