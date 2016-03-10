'use strict';

var EventBl = require('../../../fu/server/bl/event.server.bl');


exports.hub = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Hub | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.channel = function (req, res) {
    var channel = req.channel;
    res.render('modules/core/server/views/index', {
        title: channel.name + ' Betting Community | FansUnite',
        description: 'Daily '+channel.name+' betting discussions, pro picks, free tips, odds and community consensus.',
        keywords: channel.name +' betting, '+channel.name+' pro picks, '+channel.name+' free tips, '+channel.name+' odds, '+channel.name+' consensus',
        user: req.user || null
    });
};

exports.profile = function (req, res) {
    var userProfile = req.userProfile;

    res.render('modules/core/server/views/index', {
        title: userProfile.username + ' Picks & Verified Record | FansUnite',
        description: 'Get access to '+userProfile.username+"'s sportsbetting picks with 100% verified and transparent results.",
        keywords: 'free picks, free tips, pro picks, pro tips',
        user: req.user || null
    });
};

exports.myFollowing = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'My Handicappers | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.gamecenter = function (req, res) {

    var event = req.event;
    var populate = [{path:'contestant1.ref', model: 'Contestant'},{path:'contestant2.ref', model: 'Contestant'}];

    EventBl.populateBy(event, populate, function(err, event){
        var separator = ' at ';
        var homeTeam;
        var awayTeam;
        if(event.neutral) separator = ' vs. ';
        if(event.contestant1.ref.name2){
            homeTeam = event.contestant1.ref.name2;
        } else {
            homeTeam = event.contestant1.name;
        }
        if(event.contestant2.ref.name2){
            awayTeam = event.contestant2.ref.name2;
        } else {
            awayTeam = event.contestant2.name;
        }
        var date = new Date(event.startTime);
        date.setHours(date.getHours() - 7);
        date = date.toDateString();
        date = date.substr(date.indexOf(" ") + 1);
        console.log(date);
        var title = homeTeam + separator + awayTeam + ' Odds, Picks, Consensus & Discussion - '+ date +' | FansUnite';
        var description = 'Up-to-date odds, free picks, community consensus and betting discussion for '+event.contestant2.name+' vs. '+event.contestant1.name+' ('+ date + ').';
        var keywords = event.contestant1.name+', '+event.contestant2.name+', odds, betting discussion, free tips, pro picks, consensus';

        res.render('modules/core/server/views/index', {
            title: title,
            description: description,
            keywords: keywords,
            user: req.user || null
        });
    });

};

exports.makePicks = function (req, res) {

    res.render('modules/core/server/views/index', {
        title: '',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.makePicksLeague = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: '',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.blog = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Sports Betting Blog | FansUnite',
        description: 'Betting predictions, previews, analysis and advice for upcoming NBA, NHL, MLB and NFL games.',
        keywords: 'betting, predictions, previews, analysis, advice',
        user: req.user || null
    });
};

exports.article = function (req, res) {
    var article = req.article;
    var content = article.content ? String(article.content).replace(/<[^>]+>/gm, '') : '';
    content = content.substring(0,200);
    res.render('modules/core/server/views/index', {
        title: article.title + ' | FansUnite Blog',
        description: content,
        keywords: article.keywords,
        user: req.user || null
    });
};

exports.discover = function (req, res) {
    res.render('modules/core/server/views/index', {
        title:  'Top Handicappers | FansUnite',
        description: 'Find handicappers with 100% verified and transparent results to follow, track and copy their predictions. ',
        keywords: 'top handicappers, best tipsters, fansunite leaderboard',
        user: req.user || null
    });
};

exports.discoverSport = function (req, res) {
    var sport = req.sport;
    res.render('modules/core/server/views/index', {
        title:  'Top '+sport.name+' Handicappers | FansUnite',
        description: 'Find the best '+sport.name+' handicappers with 100% verified and transparent results to follow, track and copy their predictions.',
        keywords: '',
        user: req.user || null
    });
};

exports.discoverLeague = function (req, res) {
    var league = req.league;
    res.render('modules/core/server/views/index', {
        title:  'Top '+league.name+' Handicappers | FansUnite',
        description: 'Find the best '+league.name+' handicappers with 100% verified and transparent results to follow, track and copy their predictions.',
        keywords: '',
        user: req.user || null
    });
};

exports.discoverContestant = function (req, res) {
    var contestant = req.contestant;
    res.render('modules/core/server/views/index', {
        title:  '',
        description: '',
        keywords: '',
        user: req.user || null
    });
};


/**
 * Static Pages
 */
exports.userGuide = function(req, res) {
    res.render('index', {
        title: 'User Guide | FansUnite',
        description: 'FansUnite user guide.',
        keywords: 'how fansunite works, fansunite user guide',
        user: req.user || null,
        index: true
    });
};
exports.betting101 = function(req, res) {
    res.render('index', {
        title: 'Betting 101 | Learn How to Bet on Sports',
        description: 'Learn the basics of how to bet on sports. You will learn how to bet the moneyline, against the spread and totals.',
        keywords: 'learn how to bet on sports, bet against the spread, bet on totals',
        user: req.user || null,
        index: true
    });
};
exports.faq = function(req, res) {
    res.render('index', {
        title: 'FAQ | FansUnite',
        description: 'Find answers to frequently asked questions.',
        keywords: 'fansunite faq',
        user: req.user || null,
        index: true
    });
};
exports.glossary = function(req, res) {
    res.render('index', {
        title: 'Betting Terms: Spread, Over/Under and Moneyline | FansUnite',
        description: 'Find the most common betting terms that every sports bettor amateur to professional needs to know.',
        keywords: 'sports betting terms, spread betting, learn how to bet, sports betting basics',
        user: req.user || null,
        index: true
    });
};
exports.howPicksAreGraded = function(req, res) {
    res.render('index', {
        title: 'How Wagers are Graded | FansUnite',
        description: 'How FansUnite resolves all of its wagers.',
        keywords: 'sports betting rules, how bets are graded',
        user: req.user || null,
        index: true
    });
};
exports.about = function(req, res) {
    res.render('index', {
        title: 'About Us | FansUnite',
        description: 'About FansUnite.',
        keywords: 'what is fansunite',
        user: req.user || null,
        index: true
    });
};
exports.monthlyRevenueShare = function(req, res) {
    res.render('index', {
        title: 'Monthly Revenue Share | FansUnite',
        description: 'About FansUnite monthly revenue share.',
        keywords: 'make money betting on sports',
        user: req.user || null,
        index: true
    });
};
exports.privacy = function(req, res) {
    res.render('index', {
        title: 'Privacy Policy | FansUnite',
        description: 'Privacy policy.',
        keywords: 'privacy policy',
        user: req.user || null
    });
};
exports.terms = function(req, res) {
    res.render('index', {
        title: 'Terms of Use | FansUnite',
        description: 'Terms of use.',
        keywords: 'terms of use',
        user: req.user || null
    });
};
exports.rules = function(req, res) {
    res.render('index', {
        title: 'Rules | FansUnite',
        description: 'FansUnite rules.',
        keywords: 'fansunite rules',
        user: req.user || null,
        index: true
    });
};
exports.contact = function(req, res) {
    res.render('index', {
        title: 'Contact Us | FansUnite',
        description: 'Contact information for FansUnite.',
        keywords: 'contact fansunite',
        user: req.user || null,
        index: true
    });
};
exports.whyGoPro = function(req, res) {
    res.render('index', {
        title: 'Why Go Pro | FansUnite',
        description: 'About FansUnite pro account.',
        keywords: 'handicapping service',
        user: req.user || null,
        index: true
    });
};
exports.top10SportsBooks = function(req, res) {
    res.render('index', {
        title: 'Top 10 Sportsbooks | FansUnite',
        description: 'Top 10 Sportsbooks.',
        keywords: 'best online sportsbook, betting offers, free bets',
        user: req.user || null,
        index: true
    });
};
exports.sportsbookReview = function(req, res) {
    var sportsbookName = req.params.sportsbookName;
    if(sportsbookName){
        sportsbookName = sportsbookName.replace('-', ' ');
    }
    res.render('index', {
        title: sportsbookName+' Review | FansUnite',
        description: sportsbookName+' review from FansUnite.',
        keywords: sportsbookName+' review, '+sportsbookName+' betting offers, '+sportsbookName+' free bets',
        user: req.user || null,
        index: true
    });
};


exports.renderIndex = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite | Sportsbetting Social Network',
        description: 'Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'sportsbetting social network, sportsbetting community, bet tracking',
        user: req.user || null
    });
};

exports.renderServerError = function (req, res) {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

exports.renderNotFound = function (req, res) {

    res.status(404).format({
        'text/html': function () {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': function () {
            res.json({
                error: 'Path not found'
            });
        },
        'default': function () {
            res.send('Path not found');
        }
    });
};
