'use strict';

angular.module('fu').controller('MakePicksMenuController', ['$scope', '$stateParams', '$filter', 'Authentication', 'MakePicks',
    function ($scope, $stateParams, $filter, Authentication, MakePicks) {
        $scope.authentication = Authentication;

        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;


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
            }
        };

        $scope.updateSub2 = function(sub2){
            $scope.activeSub2 = sub2;
        };

        $scope.setActiveMenu = function(){
            var activeSport = $filter('filter')($scope.menu, {slug:$scope.sportSlug});
            if(activeSport.length){
                $scope.activeSport = activeSport[0];
                for(var i=0; i<$scope.activeSport.main.length; i++){
                    var sub1 = $scope.activeSport.main[i];
                    if('main' in sub1){
                        for(var j=0; j<sub1.main.length;j++){
                            var sub2 = sub1.main[j];
                            if(sub2.slug === $scope.leagueSlug){
                                $scope.activeSub1 = sub1;
                                $scope.activeSub2 = sub2;
                                break;
                            }
                        }
                    }
                    if(sub1.slug === $scope.leagueSlug){
                        $scope.activeSub1 = sub1;
                        break;
                    }
                }
            }
        };


        function cbGetMenu(err, menu){

            if(!err){
                MakePicks.menu = menu;
                $scope.menu = menu;
                $scope.setActiveMenu();
            }
        }
        MakePicks.getMenu(cbGetMenu);



    }
]);
