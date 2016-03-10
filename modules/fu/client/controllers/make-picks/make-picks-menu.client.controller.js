'use strict';

angular.module('fu').controller('MakePicksMenuController', ['$scope', '$stateParams', '$filter', 'Authentication', 'MakePicks', '$rootScope', 'Page',
    function ($scope, $stateParams, $filter, Authentication, MakePicks, $rootScope, Page) {
        $scope.authentication = Authentication;
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;

        function updateMeta(){
            Page.meta.title = $scope.activeSport.name+ ' - ' + MakePicks.active.league.name + ' Betting Odds | Free Online Sports Betting';
            Page.meta.description = 'Latest '+$scope.activeSport.name+ ' - ' + MakePicks.active.league.name + ' betting odds. Track your bets with our free online sportsbook.';
            Page.meta.keywords = $scope.activeSport.name+ ' odds, ' + MakePicks.active.league.name + ' odds, free online sportsbook, free sports betting';
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
