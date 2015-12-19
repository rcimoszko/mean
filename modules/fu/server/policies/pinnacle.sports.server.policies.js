'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Pinnacle Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/pinnacle/sports',
            permissions: ['GET']
        }, {
            resources: '/api/pinnacle/sports/:pinSportId',
            permissions: ['GET', 'PUT']
        }, {
            resources: '/api/pinnacle/sports/:pinSportId/leagues',
            permissions: ['GET']
        }, {
            resources: '/api/pinnacle/sports/:pinSportId/leagues/:pinLeagueId',
            permissions: ['GET', 'PUT']
        }, {
            resources: '/api/pinnacle/sports/:pinSportId/leagues/:pinLeagueId/contestants',
            permissions: ['GET']
        }, {
            resources: '/api/pinnacle/sports/:pinSportId/leagues/:pinLeagueId/contestants/:pinContestantId',
            permissions: ['GET', 'PUT']
        }]
    }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an article is being processed and the current user created it then allow any manipulation
    if (req.article && req.user && req.article.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
