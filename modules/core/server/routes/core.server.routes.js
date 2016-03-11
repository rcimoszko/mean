'use strict';

module.exports = function (app) {
    // Root routing
    var core = require('../controllers/core.server.controller');


    app.route('/hub').get(core.hub);
    app.route('/channel/:channelSlug').get(core.channel);
    app.route('/profile/:username').get(core.profile);
    app.route('/game/:eventSlug/:leagueSlug').get(core.gamecenter);
    app.route('/my-following').get(core.myFollowing);
    app.route('/blog').get(core.blog);
    app.route('/blog/:articleSlug').get(core.article);
    app.route('/discover').get(core.discover);
    app.route('/discover/:sportSlug').get(core.discoverSport);
    app.route('/discover/:sportSlug/:leagueSlug').get(core.discoverLeague);
    app.route('/discover/:sportSlug/:leagueSlug/:contestantSlug').get(core.discoverContestant);
    app.route('/make-picks').get(core.makePicks);
    app.route('/make-picks/:sportSlug/:leagueSlug').get(core.makePicksLeague);
    app.route('/messages').get(core.messages);

    //static
    app.route('/about').get(core.about);
    app.route('/faq').get(core.faq);
    app.route('/user-guide').get(core.userGuide);
    app.route('/why-go-pro').get(core.whyGoPro);
    app.route('/monthly-revenue-share').get(core.monthlyRevenueShare);
    app.route('/how-picks-are-graded').get(core.howPicksAreGraded);
    app.route('/betting101').get(core.betting101);
    app.route('/glossary').get(core.glossary);
    app.route('/top-10-sportsbooks').get(core.top10SportsBooks);
    app.route('/sportsbook-review/:sportsbookName').get(core.sportsbookReview);
    app.route('/press').get(core.press);
    app.route('/contact').get(core.contact);
    app.route('/privacy').get(core.privacy);
    app.route('/rules').get(core.rules);
    app.route('/terms').get(core.terms);

    app.route('/contests').get(core.contestRedirect);
    app.route('/contests/*').get(core.contestRedirect);

    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Return a 404 for all undefined api, module or lib routes
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

    // Define application route
    app.route('/*').get(core.renderIndex);
};
