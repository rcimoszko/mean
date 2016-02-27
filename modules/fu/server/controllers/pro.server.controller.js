'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    config = require('../../../../config/config'),
    stripe = require('stripe')(config.stripe.secretKey);


exports.newPro = function(req, res, next){
    var stripeToken = req.body.stripeToken;
    var plan = req.body.plan;

    if (!req.user) res.send(403);

    stripe.customers.create({
        card: stripeToken,
        plan: plan,
        email: req.user.email
    }, function(err, customer) {
        if (err) {
            // handle error
            return res.send(400, {
                message: 'An error occurred creating your subscription. Please email info@fansunite.com to sign up for a FansUnite Pro Account.'
            });
        } else {
            var user = req.user;
            var plan = customer.subscriptions.data[0].plan;
            switch (plan.id){
                case 'Base Subscription':
                    user.base = true;
                    break;
                case '1 Month Premium':
                case '6 Months Premium':
                    user.premium = true;
                    break;
            }
            user.stripeId = customer.id;
            user.subscriptionId = customer.subscriptions.data[0].id;
            user.subscriptionPlan = plan.id;
            user.premiumRenewDate = new Date(customer.subscriptions.data[0].current_period_end*1000);
            user.save();
            res.jsonp(user);
        }
    });
};


exports.resume = function(req, res){
    if(!req.user) res.send(403);
    stripe.customers.updateSubscription(req.user.stripeId, req.user.subscriptionId,
        function(err, subscription) {
            if (err) {
                // err handling
                return res.send(400, {
                    message: 'An error occurred when resuming your subscription. Please email info@fansunite.com to resume your subscription.'
                });

            } else {
                req.user.cancelledPremium = false;
                req.user.premiumEndDate = null;
                req.user.save();
                res.jsonp(req.user);
            }
        });

};


exports.cancel = function(req, res) {

    if (!req.user) res.send(403);
    stripe.customers.cancelSubscription(req.user.stripeId, req.user.subscriptionId, { at_period_end: true }, function(err, confirmation) {
        if (err) {
            // err handling
            return res.send(400, {
                message: 'An error occurred when cancelling your subscription. Please email info@fansunite.com to cancel your subscription.'
            });
        } else {
            req.user.cancelledPremium = true;
            req.user.premiumEndDate = new Date(confirmation.current_period_end*1000);
            req.user.save();
            res.jsonp(req.user);
        }
    });
};

exports.changeSubscription = function(req, res){

};