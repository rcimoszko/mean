'use strict';

angular.module('fu').factory('Location', ['$resource', '$state',  function($resource, $state){
    var location = $resource('/api/location');
    var restrictedCountries = ['CA', 'US'];
    var currentLocation;

    var getCountry = function(callback){
        if(currentLocation){
            callback(currentLocation.country);
        } else {
            currentLocation = location.get(function(location){
                if(location){
                    callback(location.country);
                } else {
                    callback(null);
                }
            });
        }
    };

    var isRestricted = function(){
        var isRestricted;
        getCountry(function(country){
            if(country){
                isRestricted = restrictedCountries.indexOf(country) !== -1;
            } else {
                isRestricted =  false;
            }
        });
        return isRestricted;
    };

    var redirect = function(affiliateUrl){
        getCountry(function(country){
            if(country){
                if(restrictedCountries.indexOf(country) !== -1){
                    $state.go('static.offer-not-available');
                } else {
                    window.open(affiliateUrl, '_blank');
                }
            } else {
                window.open(affiliateUrl, '_blank');
            }
        });
    };

    return {
        isRestricted: isRestricted,
        redirect: redirect,
        getCountry: getCountry
    };
}]);