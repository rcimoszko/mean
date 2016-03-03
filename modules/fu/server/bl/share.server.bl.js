'use strict';

var Twitter = require('twitter'),
    config = require('../../../../config/config'),
    oauth = require('oauth');

function loadBase64Image(url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,',
                image = body.toString('base64');
            if (typeof callback === 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
}

function twitterUploadImage(providerData, data, callback){
    var client = new oauth.OAuth('https://twitter.com/oauth/request_token',
        'https://twitter.com/oauth/access_token',
        config.twitter.clientID,
        config.twitter.clientSecret,
        '1.0',
        config.twitter.callbackURL,
        'HMAC-SHA1');


    loadBase64Image(data.imgUrl, function(image, base64prefix){
        client.post('https://upload.twitter.com/1.1/media/upload.json', providerData.token,  providerData.tokenSecret, {media: image} ,'' , function (e, data, res){
            if (e) {
                console.error(e);
            }else {
                try{
                    data = JSON.parse(data);
                }catch (e){
                    console.error('Error Json : ' + e);
                }
                callback(data.media_id_string);
            }
        });
    });
}



function share(user, data, callback){

    if(data.twitterShare){
        var providerData;
        if(user.provider === 'twitter'){
            providerData = user.providerData;
        } else if ('additionalProvidersData' in user){
            providerData = user.additionalProvidersData.twitter;
        }

        var client = new Twitter({
            consumer_key: config.twitter.clientID,
            consumer_secret: config.twitter.clientSecret,
            access_token_key: providerData.token,
            access_token_secret: providerData.tokenSecret
        });

        if(data.imgUrl){
            twitterUploadImage(providerData, data, function(mediaId){
                client.post('statuses/update', {status: data.shareText, media_ids:[mediaId]},  function(err, params, response){
                    if(err){
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            });
        } else {
            client.post('statuses/update', {status: data.shareText},  function(err, params, response){
                if(err){
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    }
    /*
    if(data.facebookShare){

        FB.setAccessToken(user.additionalProvidersData.facebook.accessToken);

        var body = 'test';

        FB.api('me/feed', 'post', { message: body}, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            console.log('Post Id: ' + res.id);
        });
    }
    */

}

exports.share = share;
