'use strict';

angular.module('fu').filter('gameName', ['$sce', function($sce){
    return function(pick, hasScores){
        var teamNames;
        var homeContestant;
        var awayContestant;
        var event = pick.event;
        var separator = '@';
        var selected;
        if(event.neutral) separator = 'VS ';

        switch(pick.betType){
            case 'moneyline':
            case 'spread':
            case 'team totals':
            case 'sets':
                if(pick.contestant){
                    if(pick.contestant.ref === event.contestant1.ref){
                        selected = 'home';
                    } else if(pick.contestant.ref === event.contestant2.ref){
                        selected = 'away';
                    }
                }
                break;
        }

        if(selected === 'home'){
            homeContestant = '<span class="selected">'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span>'+event.contestant2.name+'</span>';
        } else if (selected === 'away'){
            homeContestant = '<span>'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span class="selected">'+event.contestant2.name+'</span>';
        } else{
            homeContestant = '<span>'+separator+event.contestant1.name+'</span>';
            awayContestant = '<span>'+event.contestant2.name+'</span>';
        }

        if(hasScores){
            homeContestant = '<span class="score score-1">'+pick.contestant1Score+'</span>' + homeContestant;
            awayContestant = '<span class="score score-2">'+pick.contestant2Score+'</span>' + awayContestant;
        }
        teamNames = '<div>'+awayContestant+'</div><div>'+homeContestant+'</div>';

        return $sce.trustAsHtml(teamNames);
    };
}]);