'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider.
            state('static', {
                templateUrl: '/modules/fu/client/views/static.client.view.html',
                abstract: true
            })
            .state('static.about', {
                url:'/about',
                templateUrl: '/modules/fu/client/views/static/static.about.client.view.html',
                title: 'About Us | FansUnite',
                description: 'About FansUnite.',
                keywords: 'what is fansunite'
            })
            .state('static.betting101', {
                url:'/betting101',
                templateUrl: '/modules/fu/client/views/static/static.betting101.client.view.html',
                title: 'Betting 101 | Learn How to Bet on Sports',
                description: 'Learn the basics of how to bet on sports. You will learn how to bet the moneyline, against the spread and totals.',
                keywords: 'learn how to bet on sports, bet against the spread, bet on totals'
            })
            .state('static.glossary', {
                url: '/glossary',
                templateUrl: '/modules/fu/client/views/static/static.glossary.client.view.html',
                title: 'Betting Terms: Spread, Over/Under and Moneyline | FansUnite',
                description: 'Find the most common betting terms that every sports bettor amateur to professional needs to know.',
                keywords: 'sports betting terms, spread betting, learn how to bet, sports betting basics'
            }).
            state('static.howPicksAreGraded', {
                url: '/how-picks-are-graded',
                templateUrl: '/modules/fu/client/views/static/static.how-picks-are-graded.client.view.html',
                title: 'How Wagers are Graded | FansUnite',
                description: 'How FansUnite resolves all of its wagers.',
                keywords: 'sports betting rules, how bets are graded'
            }).
            state('static.faq', {
                url: '/faq',
                templateUrl: '/modules/fu/client/views/static/static.faq.client.view.html',
                title: 'FAQ | FansUnite',
                description: 'Find answers to frequently asked questions.',
                keywords: 'fansunite faq'
            }).
            state('static.terms', {
                url: '/terms',
                templateUrl: '/modules/fu/client/views/static/static.terms.client.view.html',
                title: 'Terms of Use | FansUnite',
                description: 'Terms of use.',
                keywords: 'terms of use'
            }).
            state('static.rules', {
                url: '/rules',
                templateUrl: '/modules/fu/client/views/static/static.rules.client.view.html',
                title: 'Rules | FansUnite',
                description: 'FansUnite rules.',
                keywords: 'fansunite rules'
            }).
            state('static.privacy', {
                url: '/privacy',
                templateUrl: '/modules/fu/client/views/static/static.privacy.client.view.html',
                title: 'Privacy Policy | FansUnite',
                description: 'Privacy policy.',
                keywords: 'privacy policy'
            }).
            state('static.contact', {
                url: '/contact',
                templateUrl: '/modules/fu/client/views/static/static.contact.client.view.html',
                title: 'Contact Us | FansUnite',
                description: 'Contact information for FansUnite.',
                keywords: 'contact fansunite'
            }).
            state('static.offer-not-available', {
                url: '/not-available',
                templateUrl: '/modules/fu/client/views/static/static.offer-not-available.client.view.html',
                title: 'Not Available | FansUnite',
                description: ''
            }).
            state('static.userguide', {
                url: '/user-guide',
                templateUrl: '/modules/fu/client/views/static/static.user-guide.client.view.html',
                title: 'User Guide | FansUnite',
                description: 'FansUnite User guide.',
                keywords: 'how fansunite works, fansunite user guide'
            }).
            state('static.sportsbooks', {
                url: '/top-10-sportsbooks',
                templateUrl: '/modules/fu/client/views/static/static.top-10-sports-books.client.view.html',
                title: 'Top 10 Sportsbooks | FansUnite',
                description: 'Top 10 Sportsbooks.',
                keywords: 'best online sportsbook, betting offers, free bets'

            }).
            state('static.sportsbookReviews', {
                url: '/sportsbook-review/:name',
                templateUrl: '/modules/fu/client/views/static/static.sportsbook-review.client.view.html'
            }).
            state('static.monthlyRevenueShare', {
                url: '/monthly-revenue-share',
                templateUrl: '/modules/fu/client/views/static/static.monthly-revenue-share.client.view.html',
                title: 'Monthly Revenue Share | FansUnite',
                description: 'About FansUnite monthly revenue share.',
                keywords: 'make money betting on sports'
            }).
            state('static.whyGoPro', {
                url: '/why-go-pro',
                templateUrl: '/modules/fu/client/views/static/static.why-go-pro.client.view.html',
                title: 'Why Go Pro | FansUnite',
                description: 'About FansUnite monthly revenue share.',
                keywords: 'make money betting on sports'
            });
    }
]);