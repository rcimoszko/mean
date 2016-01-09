'use strict';

angular.module('fu').filter('formatOdds',['Authentication', function(Authentication) {
    return function(odds) {
        var oddsFormat = 'Decimal';
        if(Authentication.user){
            oddsFormat = Authentication.user.oddsFormat;
        }
        if(typeof odds !== 'undefined' && odds !== null){
            switch(oddsFormat){
                case 'Decimal':
                    return odds.toFixed(2);
                case 'American':
                    var americanOdds;
                    if(odds === 1){
                        americanOdds = 'Even';
                    }
                    else if (odds<2){
                        americanOdds = parseInt(-100/(odds - 1));
                    } else {
                        americanOdds = 100*(odds-1);
                        americanOdds = '+'+parseInt(americanOdds);
                    }
                    return americanOdds;
                /*
                case 'Fractional':
                    var fractionalOdds = new Fraction(odds.toFixed(3));
                    return fractionalOdds.n+'/'+fractionalOdds.d;
                    */
            }
        }
    };
}]);
