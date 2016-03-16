'use strict';

var EventBl = require('../../../fu/server/bl/event.server.bl');

function cappertText(sportName, capitalize){
    var capperText = 'tipsters';
    switch(sportName){
        case 'Baseball':
        case 'Basketball':
        case 'Hockey':
        case 'Football':
        case 'Curling':
        case 'Mixed Martial Arts':
        case 'Boxing':
            capperText = 'handicappers';
            break;
    }

    if(capitalize) capperText = capperText.charAt(0).toUpperCase() + capperText.slice(1);
    return capperText;
}


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
        description: 'Get access to '+userProfile.username+"'s sports betting picks with 100% verified and transparent results.",
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
    var capperText = cappertText(sport.name);
    var capperTextCap = cappertText(sport.name, true);

    res.render('modules/core/server/views/index', {
        title:  'Top '+sport.name+' '+capperTextCap+' | FansUnite',
        description: 'Find the best '+sport.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.',
        keywords: 'top '+sport.name+' '+capperText+', best '+sport.name+' '+capperText+', fansunite '+sport.name+' leaderboard',
        user: req.user || null
    });
};

exports.discoverLeague = function (req, res) {
    var league = req.league;
    var sport = req.sport;

    var capperText = cappertText(sport.name);
    var capperTextCap = cappertText(sport.name, true);

    res.render('modules/core/server/views/index', {
        title:  'Top '+league.name+' '+capperTextCap+' | FansUnite',
        description: 'Find the best '+league.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.',
        keywords: 'top '+league.name+' '+capperText+', best '+league.name+' '+capperText+', fansunite '+league.name+' leaderboard',
        user: req.user || null
    });
};

exports.discoverContestant = function (req, res) {
    var contestant = req.contestant;
    var sport = req.sport;

    var capperText = cappertText(sport.name);
    var capperTextCap = cappertText(sport.name, true);

    res.render('modules/core/server/views/index', {
        title:  'Top '+contestant.name+' '+capperTextCap+' | FansUnite',
        description: 'Find the best '+contestant.name+' '+capperText+' with 100% verified and transparent results to follow, track and copy their predictions.',
        keywords: 'top '+contestant.name+' '+capperText+', best '+contestant.name+' '+capperText+', fansunite '+contestant.name+' leaderboard',
        user: req.user || null
    });
};

exports.makePicks = function (req, res) {

    res.render('modules/core/server/views/index', {
        title: 'Free Online Sportsbook | FansUnite',
        description: 'Track your bets on our free online sportsbook with up-to-date odds for every sport and league.',
        keywords: 'free online sportsbook, free online sports betting, latest odds',
        user: req.user || null
    });
};

exports.makePicksLeague = function (req, res) {
    var league = req.league;
    var sport = req.sport;

    res.render('modules/core/server/views/index', {
        title: 'Free '+sport.name+ ' - '+league.name+' Online Sportsbook | FansUnite',
        description: 'Track your bets on our free online sportsbook with up-to-date '+league.name+' odds.',
        keywords: 'free '+league.name+' online sportsbook, free online '+league.name+' betting, latest odds',
        user: req.user || null
    });
};

exports.messages = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Messages | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.login = function(req, res){
    res.render('modules/core/server/views/index', {
        title: 'Login | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.signup = function(req, res){
    res.render('modules/core/server/views/index', {
        title: 'Sign Up | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};

exports.settings = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Settings | FansUnite',
        description: '',
        keywords: '',
        user: req.user || null
    });
};


/**
 * Static Pages
 */
exports.userGuide = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite User Guide | Sports Betting Social Network',
        description: 'Learn how to use FansUnite, a social sports betting platform. Follow the top handicappers and become more profitable.',
        keywords: 'user guide, profitable, sports betting',
        user: req.user || null,
        index: true
    });
};
exports.betting101 = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Learn the Basics of Sports Betting | FansUnite',
        description: 'Learn how to bet moneylines, point spreads, total points and team totals. Understand the different odds formats and bet types.',
        keywords: 'moneyline, spreads, totals, team totals, learn beting',
        user: req.user || null,
        index: true
    });
};
exports.faq = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FAQ at FansUnite | Sports Betting Social Network',
        description: 'FansUnite is a unique Sports Betting platform where you can collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'faq, sports betting, social network, community',
        user: req.user || null,
        index: true
    });
};
exports.glossary = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Betting Glossary | FansUnite',
        description: 'Find the most common betting terms that every sports bettor amateur to professional needs to know.',
        keywords: 'glossary, learn sports betting, teach sports betting',
        user: req.user || null,
        index: true
    });
};
exports.howPicksAreGraded = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Learn How Picks are Graded at FansUnite | Sports Betting Social Network',
        description: 'Track your bets on FansUnite and have our platform automatically grade each wager. Learn more about how each bet is graded.',
        keywords: 'bet tracking, pick tracker',
        user: req.user || null,
        index: true
    });
};
exports.about = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'About FansUnite | Sports Betting Social Network',
        description: 'FansUnite is a Sports Betting Social Network. Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'sports betting, social network, community',
        user: req.user || null,
        index: true
    });
};
exports.monthlyRevenueShare = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Monthly Revenue Share | FansUnite',
        description: "FansUnite rewards it's top handicappers with a monthly revenue share. Eligible members receive a portion of our revenue each month.",
        keywords: 'revenue share, top handicappers, rewards',
        user: req.user || null,
        index: true
    });
};
exports.privacy = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite Privacy Policy | Sports Betting Social Network',
        description: '',
        keywords: '',
        user: req.user || null
    });
};
exports.terms = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite Terms | Sports Betting Social Network',
        description: '',
        keywords: '',
        user: req.user || null
    });
};
exports.rules = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite Rules | Sports Betting Social Network',
        description: '',
        keywords: '',
        user: req.user || null,
        index: true
    });
};
exports.contact = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Contact FansUnite | Sports Betting Social Network',
        description: 'FansUnite is always open to feedback. Contact us with any questions, comments and suggestions.',
        keywords: 'contact us, feedback, suggestions',
        user: req.user || null,
        index: true
    });
};
exports.whyGoPro = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite Pro Membership | Sports Betting Social Network',
        description: 'Join FansUnite Pro subscription to get access to our pro picks, email notifications and weekly betting progress reports.',
        keywords: 'pro picks, email notifications, progress reports',
        user: req.user || null,
        index: true
    });
};
exports.top10SportsBooks = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'Top 10 Sportsbooks | Unbiased Reviews | FansUnite',
        description: 'Unbiased sportsbook reviews from FansUnite. Find the best online sportsbook.',
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
    res.render('modules/core/server/views/index', {
        title: sportsbookName+' Review | FansUnite',
        description: 'Unbiased review of '+sportsbookName+' from FansUnite.',
        keywords: sportsbookName+' review, '+sportsbookName+' betting offers, '+sportsbookName+' free bets',
        user: req.user || null,
        index: true
    });
};

exports.press = function(req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite Press | Sports Betting Social Network',
        description: 'News and press about FansUnite, the sports betting social network.',
        keywords: 'press release, fansunite news, fansunite articles',
        user: req.user || null,
        index: true
    });
};


exports.renderIndex = function (req, res) {
    res.render('modules/core/server/views/index', {
        title: 'FansUnite | Sports Betting Social Network',
        description: 'Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
        keywords: 'sports betting social network, sports betting community, bet tracking',
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


exports.contestRedirect = function(req, res){
    res.redirect(301, '/monthly-revenue-share');
};