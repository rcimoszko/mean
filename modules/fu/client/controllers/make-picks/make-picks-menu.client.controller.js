'use strict';

angular.module('fu').controller('MakePicksMenuController', ['$scope', '$stateParams', '$filter', 'Authentication', 'MakePicks', '$rootScope', 'Page', 'deviceDetector',
    function ($scope, $stateParams, $filter, Authentication, MakePicks, $rootScope, Page, deviceDetector) {
        $scope.authentication = Authentication;
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;
        $scope.deviceDetector = deviceDetector;

        function updateMeta(){
            Page.meta.title = 'Free '+$scope.activeSport.name+ ' - '+MakePicks.active.league.name+' Online Sports Book | FansUnite';
            Page.meta.description = 'Track your bets on our free online sports book with up-to-date '+MakePicks.active.league.name+' odds.';
            Page.meta.keywords = 'free '+MakePicks.active.league.name+' online sports book, free online '+MakePicks.active.league.name+' betting, latest odds';
        }

        $scope.updateSport = function(sport){
            $scope.activeSub1 = null;
            if(sport === $scope.activeSport){
                $scope.activeSport = null;
            } else {
                $scope.activeSport = sport;
            }
        };


        $scope.updateSub1 = function(sub1, abstract){
            if(sub1 === $scope.activeSub1 && abstract){
                $scope.activeSub1 = null;
            } else {
                $scope.activeSub1 = sub1;
                $scope.activeSub2 = null;
                MakePicks.active.league = $scope.activeSub1;
                updateMeta();
            }
        };

        $scope.updateSub2 = function(sub2){
            $scope.activeSub2 = sub2;
            MakePicks.active.league = $scope.activeSub2;
            updateMeta();
        };

        $scope.setActiveMenu = function(){
            var activeSport = $filter('filter')($scope.menu, {slug:$scope.sportSlug});
            if(activeSport.length === 1){
                $scope.activeSport = activeSport[0];
                for(var i=0; i<$scope.activeSport.main.length; i++){
                    var sub1 = $scope.activeSport.main[i];
                    if('main' in sub1){
                        for(var j=0; j<sub1.main.length;j++){
                            var sub2 = sub1.main[j];
                            if(sub2.slug === $scope.leagueSlug){
                                $scope.activeSub1 = sub1;
                                $scope.activeSub2 = sub2;
                                MakePicks.active.league = $scope.activeSub2;
                                updateMeta();
                                break;
                            }
                        }
                    }
                    if(sub1.slug === $scope.leagueSlug){
                        $scope.activeSub1 = sub1;
                        MakePicks.active.league = $scope.activeSub1;
                        updateMeta();
                        break;
                    }
                }
            }
            $rootScope.$broadcast('menuSet');
            if($scope.authentication.user && !$scope.authentication.user.picksWalkthrough && $scope.deviceDetector.isDesktop()) $scope.startPicksWalkthrough();
        };


        function cbGetMenu(err, menu){

            if(!err){
                MakePicks.menu = menu;
                $scope.menu = menu;
                $scope.setActiveMenu();
            }
        }
        MakePicks.getMenu(cbGetMenu);

        $scope.showMenu = false;



    }
]);
