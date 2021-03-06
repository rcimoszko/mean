'use strict';

var _ = require('lodash');

module.exports = _.extend(
    require('./event/sportsbook.server.model'),

    require('./event/sport.server.model'),
    require('./event/league.server.model'),
    require('./event/event.server.model'),
    require('./event/bet.server.model'),
    require('./event/group.server.model'),

    require('./event/contestant.server.model'),
    require('./event/country.server.model'),
    require('./event/historicalvalues.server.model'),
    require('./event/pick.server.model'),
    require('./event/hotpick.server.model'),

    require('./event/contestantLogo.server.model')
);
