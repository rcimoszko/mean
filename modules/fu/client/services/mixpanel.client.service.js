'use strict';

angular.module('fu').factory('Mixpanel', [ 'Authentication',
    function(Authentication) {
        function updatePeopleProperties(user) {
            var values = {};

            values[prop.email] =  user.email;
            values[prop.name] = user.username;
            values[prop.following] = user.followingCount;
            values[prop.followers] = user.followerCount;
            values[prop.twitter] = user.twitterHandle;
            values[prop.loseStreak] = user.loseStreak;
            values[prop.winStreak] = user.winStreak;
            values[prop.firstName] = user.firstName;
            values[prop.lastName] = user.lastName;
            values[prop.premium] = user.premium;
            values[prop.premiumLifetime] = user.lifetimePremium;
            values[prop.trial] = user.trial;
            values[prop.units] = user.units;
            values[prop.verified] = user.verified;
            values[prop.oddsType] = user.oddsFormat;
            values[prop.active] = user.active;
            values[prop.pickMade] = user.pickMade;
            values[prop.accountType] = user.provider;
            values[prop.favoriteSport] = user.favoriteSportNew ? user.favoriteSportNew.name : user.favoriteSport;
            values[prop.joinDate] = user.created;
            mixpanel.people.set(values);
        }

        function minutesAgo(dateString) {
            var now = new Date();
            var past = new Date(dateString);
            var seconds = Math.abs(now - past)/1000;
            return Math.floor(seconds/60) % 60;
        }

        var eventSuper = {
            firstVisitOn: 'First Visit On',
            joinDate: 'Join Date',
            created: '$created',
            accountType: 'Account Type',
            favoriteSport: 'Favorite Sport'
        };

        var event = {
            pageViewed: "Viewed Page",
            joinClicked: 'Join Clicked',
            accountCreated: 'Create Account',
            accountVerified: 'Account Verified',
            login: 'Login',
            pickMade: 'Made Pick',
            hubFollowingTabClicked: 'Hub - Following Tab',
            hubProTabClicked: 'Hub - Pro Tab',
            getPremiumClicked: 'Get Premium Clicked'
        };

        var prop = {
            firstVisitOn: 'First Visit On',
            pagesViewedGuest: 'Pages Viewed: Guest',
            pagesViewedRegistered: 'Pages Viewed: Registered',
            joinClickFromFirstVisit: 'Join Click: Mins From First Visit',
            joinClickCount: 'Join Click: Count',
            joinClickFirstClicked: 'Join Click: First Clicked',
            joinFromFirstVisit: 'Join: Mins From First Visit',
            joinDate: 'Join: Date',
            getPremiumFirstCount: 'Get Premium: Count',
            getPremiumFirstClicked: 'Get Premium: First Clicked',
            getPremiumFromFirstVisit: 'Get Premium: Mins From First Visit',
            getPremiumFromJoin: 'Get Premium: Mins From Join',
            favoriteSport: 'Favorite Sport',
            accountVerifiedDate: 'Account Verified On',
            accountVerifiedFromJoin: 'Account Verified: Mins From Join',
            accountType: 'Account Type',
            email: '$email',
            name: '$name',
            created: '$created',
            following: 'Following',
            followers: 'Followers',
            twitter: 'Twitter Handle',
            loseStreak: 'Lose Streak',
            winStreak: 'Win Streak',
            firstName: 'First Name',
            lastName: 'Last Name',
            premium: 'Premium',
            premiumLifetime: 'Lifetime Premium',
            trial: 'Trial',
            units: 'Units',
            verified: 'Verified',
            oddsType: 'Odds Type',
            active: 'Active',
            pickMade: 'Pick Made'
        };

        var createAccount = function () {
            if(Authentication.user){
                var user = Authentication.user;
                var values = {};
                var supers = {};

                mixpanel.alias(user._id);

                values[prop.created] = user.created;
                values[prop.joinDate] = user.created;
                values[prop.joinFromFirstVisit] = minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn));
                mixpanel.people.set_once(values);

                updatePeopleProperties(user);

                // Add to the event supers to track
                supers[eventSuper.created] = user.created;
                supers[eventSuper.joinDate] = user.created;
                supers[eventSuper.accountType] = user.provider;
                supers[eventSuper.favoriteSport] = user.favoriteSportNew ? user.favoriteSportNew.name : user.favoriteSport;
                mixpanel.register(supers);

                // Track the Create Account event
                mixpanel.track(event.accountCreated, {
                    'Provider': user.provider,
                    'Odds Type': user.oddsFormat,
                    'Favorite Sport': user.favoriteSportNew ? user.favoriteSportNew : user.favoriteSport
                });
            }
        };

        var login = function(){
            if(Authentication.user){
                var user = Authentication.user;
                mixpanel.identify(user._id);
                updatePeopleProperties(user);
                mixpanel.track(event.login);
            }
        };


        var makePick = function(count){
            mixpanel.track(event.pickMade, {
                'Count': count
            });
        };

        var joinClicked = function(page, cta) {
            mixpanel.track(event.joinClicked, {
                'Page': page,
                'CTA': cta
            });

            mixpanel.people.increment(prop.joinClickCount, 1);
            mixpanel.people.set_once(prop.joinClickFirstClicked, new Date());
            mixpanel.people.set_once(
                prop.joinClickFromFirstVisit,
                minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn))
            );
            //console.log("[MixPanel:joinClicked] First Visit On: " + mixpanel.get_property(eventSuper.firstVisitOn));
            //console.log("[MixPanel:joinClicked] Mins Ago: " + minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn)));
        };

        var getPremiumClicked = function(page, cta) {
            mixpanel.track(event.getPremiumClicked, {
                'Page': page,
                'CTA': cta
            });

            if (Authentication.user) {
                mixpanel.people.increment(prop.getPremiumCount, 1);
                mixpanel.people.set_once(prop.getPremiumFirstClicked, new Date());
                mixpanel.people.set_once(
                    prop.getPremiumFromFirstVisit,
                    minutesAgo(mixpanel.get_property(eventSuper.firstVisitOn))
                );

                if (mixpanel.get_property(eventSuper.joinDate) && mixpanel.get_property(eventSuper.joinDate) !== "") {
                    mixpanel.people.set_once(
                        prop.getPremiumFromJoin,
                        minutesAgo(mixpanel.get_property(eventSuper.joinDate))
                    );
                }
            }
        };

        var accountVerified = function() {
            var now = new Date();
            var props = {};

            // Update the person
            props[prop.accountVerifiedDate] = now;
            props[prop.accountVerifiedFromJoin] = minutesAgo(mixpanel.get_property(prop.joinDate));
            mixpanel.people.set_once(props);

            // Track the event
            mixpanel.track(event.accountVerified, {});
        };

        var pageViewed = function(url, isGuest) {
            setTimeout(function() {
                var isFirstVisit = true;

                // If this is an authenticated user or the user already has a firstVisitOn date set, then
                // they are a returning user, so this isn't their first visit
                if (Authentication.user || mixpanel.get_property(eventSuper.firstVisitOn) ||  mixpanel.get_property(eventSuper.created)) {
                    isFirstVisit = false;
                }

                mixpanel.track(event.pageViewed, {
                    'Url': url,
                    'Guest': isGuest,
                    'First Visit': isFirstVisit,
                    'Viewed On': new Date().toISOString()
                }, function() {
                    var supers = {};
                    var createDate, firstVisitOn;

                    // only set firstVisitOn if this is in fact a returning visit
                    if (isFirstVisit) {
                        supers[eventSuper.firstVisitOn] = new Date().toISOString();
                    } else if (!isGuest || Authentication.user) {
                        /**
                         * FIX: October 1st Join Funnel Tracking Bug
                         *
                         * A bug was introduced on Oct 1st, 2015 when the Join Funnel Tracking update was made
                         * that gave existing users a First Visit On value of their most recent visit after
                         * Oct 1st, 2015, which isn't correct.
                         *
                         * These values will be corrected to be their created date instead as we don't know
                         * when they first visited the site.
                         */
                        createDate = new Date(Authentication.user.created);
                        firstVisitOn = mixpanel.get_property(eventSuper.firstVisitOn) ? new Date(mixpanel.get_property(eventSuper.firstVisitOn)) : new Date();

                        if (createDate.getTime() < firstVisitOn.getTime()) {
                            mixpanel.people.set(eventSuper.firstVisitOn, Authentication.user.created);
                            supers[eventSuper.firstVisitOn] = Authentication.user.created;
                        }
                    }

                    setTimeout(mixpanel.register(supers, 500));
                });

                // Increment the page view count for non-guests
                if (!isGuest) {
                    var pageViewed = isGuest ? prop.pagesViewedGuest : prop.pagesViewedRegistered;
                    mixpanel.people.increment(pageViewed, 1);
                }

                //console.debug("[MixPanel:pageViewed] Page: " + url + ", Is First Visit: " + isFirstVisit);
            }, 500);
        };

        return{
            createAccount: createAccount,
            login: login,
            makePick: makePick,
            joinClicked: joinClicked,
            pageViewed: pageViewed,
            accountVerified: accountVerified,
            getPremiumClicked: getPremiumClicked
        };
    }
]);