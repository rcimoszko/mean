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
                title: 'About FansUnite | Sports Betting Social Network',
                description: 'FansUnite is a Sports betting Social Network. Collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
                keywords: 'sports betting, social network, community'
            })
            .state('static.betting101', {
                url:'/betting101',
                templateUrl: '/modules/fu/client/views/static/static.betting101.client.view.html',
                title: 'Learn the Basics of Sports Betting | FansUnite',
                description: 'Learn how to bet moneylines, point spreads, total points and team totals. Understand the different odds formats and bet types.',
                keywords: 'moneyline, spreads, totals, team totals'
            })
            .state('static.glossary', {
                url: '/glossary',
                templateUrl: '/modules/fu/client/views/static/static.glossary.client.view.html',
                title: 'Betting Glossary | FansUnite',
                description: 'Find the most common betting terms that every sports bettor amateur to professional needs to know.',
                keywords: 'glossary, learn sports betting, teach sports betting'
            }).
            state('static.howPicksAreGraded', {
                url: '/how-picks-are-graded',
                templateUrl: '/modules/fu/client/views/static/static.how-picks-are-graded.client.view.html',
                title: 'Learn How Picks are Graded at FansUnite | Sports Betting Social Network',
                description: 'Track your bets on FansUnite and have our platform automatically grade each wager. Learn more about how each bet is graded.',
                keywords: 'bet tracking, pick tracker'
            }).
            state('static.faq', {
                url: '/faq',
                templateUrl: '/modules/fu/client/views/static/static.faq.client.view.html',
                title: 'FAQ at FansUnite | Sports Betting Social Network',
                description: 'FansUnite is a unique Sports Betting platform where you can collaborate with the community and have access to thousands of sports bettors to follow, track and copy their predictions.',
                keywords: 'faq, sports betting, social network, community'
            }).
            state('static.terms', {
                url: '/terms',
                templateUrl: '/modules/fu/client/views/static/static.terms.client.view.html',
                title: 'FansUnite Terms | Sports Betting Social Network',
                description: '',
                keywords: ''
            }).
            state('static.rules', {
                url: '/rules',
                templateUrl: '/modules/fu/client/views/static/static.rules.client.view.html',
                title: 'FansUnite Rules | Sports Betting Social Network',
                description: '',
                keywords: ''
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
                title: 'Contact FansUnite | Sports Betting Social Network',
                description: 'FansUnite is always open to feedback. Contact us with any questions, comments and suggestions.',
                keywords: 'contact us, feedback, suggestions'
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
                title: 'FansUnite User Guide | Sports Betting Social Network',
                description: 'Learn how to use FansUnite, a social sports betting platform. Follow the top handicappers and become more profitable.',
                keywords: 'user guide, profitable, sports betting'
            }).
            state('static.sportsbooks', {
                url: '/top-10-sportsbooks',
                templateUrl: '/modules/fu/client/views/static/static.top-10-sports-books.client.view.html',
                title: 'Top 10 Sportsbooks | Unbiased Reviews | FansUnite',
                description: 'Unbiased sportsbook reviews from FansUnite. Find the best online sportsbook.',
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
                description: "FansUnite rewards it's top handicappers with a monthly revenue share. Eligible members receive a portion of our revenue each month.",
                keywords: 'revenue share, top handicappers, rewards'
            }).
            state('static.press', {
                url: '/press',
                templateUrl: '/modules/fu/client/views/static/static.press.client.view.html',
                title: 'FansUnite Press | Sports Betting Social Network',
                description: 'News and press about FansUnite, the sports betting social network.',
                keywords: 'press release, fansunite news, fansunite articles'
            }).
            state('whyGoPro', {
                url: '/why-go-pro',
                templateUrl: '/modules/fu/client/views/static/static.why-go-pro.client.view.html',
                title: 'FansUnite Pro Membership | Sports Betting Social Network',
                description: 'Join FansUnite Pro subscription to get access to our pro picks, email notifications and weekly betting progress reports.',
                keywords: 'pro picks, email notifications, progress reports'
            });
    }
]);