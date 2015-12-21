'use strict';

var http = require('http');

function apiRequest(path, callback){

    var options = {
        hostname: '45.55.150.174',
        path: path,
        method: 'GET',
        headers:{
            'Accept': 'application/json'
        }
    };

    var request = http.request(options, function(response) {

        var data = '';

        response.on('data', function(d) {
            data = data + d;
        });

        response.on('end', function(){
            callback(null, JSON.parse(data));
        });

    });

    request.end();

    request.on('error', function(err) {
        callback(err);
    });
}

exports.apiRequest = apiRequest;