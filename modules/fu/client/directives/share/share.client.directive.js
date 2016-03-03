'use strict';

angular.module('fu').directive('share', function(){
    return {
        restrict: 'E',
        scope: {
            type: '=',
            pick: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/share/share.client.template.html',
        controller: ['$scope','$filter', 'Authentication', '$http', function($scope, $filter, Authentication, $http){

            $scope.twitterHandle = '@FansUnite';
            $scope.shareLoading = false;

            $scope.getPickText = function(pick){

                var odds = $filter('formatOdds')(pick.odds);
                var betText;
                var result = pick.result;


                switch(pick.betType){
                    case 'spread':
                        betText = pick.contestant.name + ' ' +$filter('formatSpread')(pick.spread)+' spread';
                        break;
                    case 'moneyline':
                        betText = pick.contestant.name + ' moneyline';
                        break;
                    case 'team totals':
                        betText = pick.contestant.name + ' '+pick.overUnder+' '+$filter('formatPoints')(pick.points);
                        break;
                    case 'total points':
                        betText = pick.overUnder+' '+$filter('formatPoints')(pick.points)+' '+$scope.event.contestant1.name+'/'+$scope.event.contestant2.name;
                        break;
                    case 'sets':
                        betText = pick.contestant.name + ' '+pick.overUnder+' '+$filter('formatPoints')(pick.points)+' sets';
                        break;
                }

                var betDurationText;
                var betDurations = ['1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter'];
                if(betDurations.indexOf(pick.betDuration) !== -1){
                    betDurationText = '('+betDurations[betDurations.indexOf(pick.betDuration)]+')';
                }

                var unitText = 'unit';
                var text;

                if(result === 'Pending'){
                    if(pick.units > 1){
                        unitText = unitText+'s';
                    }
                    text = pick.units +' '+unitText+' on '+betText;
                } else if(result.indexOf('Win') !== -1){
                    if(pick.profit !== 1){
                        unitText = unitText+'s';
                    }
                    text = 'Won '+pick.profit.toFixed(2) +' '+unitText+' on '+betText;

                } else if(result.indexOf('Loss') !== -1){
                    if(pick.profit !== 1){
                        unitText = unitText+'s';
                    }
                    text = 'Loss '+Math.abs(parseInt(pick.profit)) +' '+unitText+' on '+betText;

                } else if(result === 'Push'){
                    text = 'Push on '+betText;

                } else if(result === 'Cancelled'){
                    text = 'Cancelled on '+betText;
                }

                if(betDurationText){
                    text = text +' '+betDurationText;
                }

                var url = 'https://fansunite.com/profile/'+Authentication.user.username;
                text = text +' '+ $scope.twitterHandle +' '+url;

                return text;

            };


            switch($scope.type){
                case 'pick':
                    $scope.shareText = $scope.getPickText($scope.pick);
                    break;
            }




            $scope.isAuthenticated = function(provider){
                var authenticated = false;
                if('additionalProvidersData' in Authentication.user){
                    if(provider in Authentication.user.additionalProvidersData){
                        authenticated = true;
                    }
                }
                if(Authentication.user.provider === provider){
                    authenticated = true;
                }
                return authenticated;
            };
            $scope.authentication = Authentication;

            $scope.facebookShare = false;
            $scope.twitterShare = false;
            $scope.share = function(){
                $scope.shareLoading = true;
                $scope.success = null;
                $scope.error = null;
                $http.post('/api/user/share', {
                    facebookShare: $scope.facebookShare,
                    twitterShare: $scope.twitterShare,
                    shareText: $scope.shareText,
                    imgUrl: $scope.imageUrl
                }).
                    success(function(data, status, headers, config) {
                        $scope.success = 'Shared';
                        $scope.shareLoading = false;
                    }).
                    error(function(data, status, headers, config) {
                        $scope.error = 'Unable to share';
                        $scope.shareLoading = false;
                    });
            };
        }]
    };
});


