'use strict';

angular.module('users').directive('trackerSummary', function() {
    return {
        restrict: 'E',
        scope:{
            stats: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/summary-table.html',
        controller: ['$scope', function($scope) {


        }]
    };
});


angular.module('users').directive('overviewCategorySummary', function() {
    return {
        restrict: 'E',
        scope:{
            stats: '=',
            title: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/overview-category-summary.html',
        controller: ['$scope', function($scope) {


        }]
    };
});

angular.module('users').directive('trackerHistory', function(){
    return {
        restrict: 'E',
        scope:{
            picks: '=',
            username: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/tracker-history.html',
        controller: ['$scope', '$filter', 'Authentication', function($scope, $filter, Authentication) {

            $scope.authentication = Authentication;

            var getUnique = function(array, field){
                var unique = $filter('unique')(array, field);
                unique = $filter('map')(unique, field);
                unique = $filter('remove')(unique, undefined);
                return unique;
            };

            $scope.filters = {
                sport: [{name:'All Sports', id:'all'}],
                league: [{name:'All Leagues', id:'all'}],
                team: [{name:'All Teams', id: 'all'}],
                homeAway: ['Home/Away', 'Home', 'Away'],
                betDuration: ['All Periods'],
                betType: ['All Bet Types'],
                unitSize: [{name:'All Unit Sizes', id:'all'}, {name:'1 Unit', id:1}, {name:'2 Units', id:2}, {name:'3 Units', id:3}, {name:'4 Units', id:4}, {name:'5 Units', id:5}],
                date: [{name: 'All Time', date:'all'}]
            };

            $scope.filter = {
                sport: $scope.filters.sport[0],
                league: $scope.filters.league[0],
                team: $scope.filters.team[0],
                homeAway: $scope.filters.homeAway[0],
                betDuration: $scope.filters.betDuration[0],
                betType: $scope.filters.betType[0],
                unitSize: $scope.filters.unitSize[0],
                date: $scope.filters.date[0]
            };

            $scope.initializeFilters = function(){

                //Sports
                var sports = getUnique($scope.picks, 'event.sport');
                $scope.filters.sport = $scope.filters.sport.concat(sports);

                //Bet Types
                var betTypes = getUnique($scope.picks, 'betType');
                $scope.filters.betType = $scope.filters.betType.concat(betTypes);

                $scope.updateFilterBetDurations();
                $scope.initializeDateFilters();
            };

            $scope.initializeDateFilters = function(){
                var date = new Date();
                var today = date;
                var endDate = new Date();
                $scope.filters.date = [{name: 'All Time', startDate:'all', endDate: endDate,  primary:true}];
                $scope.filters.date.push({name:'Last 7 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 30 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 60 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60, today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filters.date.push({name:'Last 90 Days', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90, today.getHours(), today.getMinutes()), endDate: endDate,  primary:true});
                $scope.filters.date.push({name:'Last 6 Months', startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate(), today.getHours(), today.getMinutes()), endDate: endDate, primary:true});
                $scope.filter.date = $scope.filters.date[0];

            };

            $scope.historyFilter = function(pick){
                if($scope.filter.sport.id === 'all' || $scope.filter.sport.ref === pick.event.sport.ref){
                    if($scope.filter.league.id === 'all' || $scope.filter.league.ref._id === pick.event.league.ref._id){
                        if($scope.filter.team.id === 'all' || ('contestant' in pick && $scope.filter.team.name === pick.contestant.name)){
                            if($scope.filter.betType === 'All Bet Types' || $scope.filter.betType === pick.betType){
                                if($scope.filter.homeAway === 'Home/Away' || ('contestant' in pick && $scope.filter.homeAway.toLowerCase() === pick.contestant.homeAway)){
                                    if($scope.filter.betDuration === 'All Periods' || $scope.filter.betDuration === pick.betDuration){
                                        if($scope.filter.unitSize.id === 'all' || $scope.filter.unitSize.id === pick.units){
                                            if($scope.filter.date.startDate === 'all' || (new Date(pick.eventStartTime) >= $scope.filter.date.startDate && new Date(pick.eventStartTime) <= $scope.filter.date.endDate)){
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            };

            $scope.updateFilterLeagues = function(){
                $scope.filters.league = [{name:'All Leagues', id:'all'}];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return pick.event.sport.ref === $scope.filter.sport.ref;
                });
                var leagues = getUnique(picks, 'event.league');
                $scope.filters.league = $scope.filters.league.concat(leagues);
                $scope.filter.league = $scope.filters.league[0];
            };

            $scope.updateFilterTeams = function(){
                $scope.filters.team = [{name:'All Teams', id:'all'}];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return pick.event.league.ref._id === $scope.filter.league.ref._id;
                });
                var teams = getUnique(picks, 'contestant.ref');
                $scope.filters.team = $scope.filters.team.concat(teams);
                $scope.filter.team = $scope.filters.team[0];
            };

            $scope.updateFilterBetDurations = function(){
                $scope.filters.betDuration = ['All Periods'];
                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                var betDurations = getUnique(picks, 'betDuration');
                $scope.filters.betDuration = $scope.filters.betDuration.concat(betDurations);
                $scope.filter.betDuration = $scope.filters.betDuration[0];
            };

            $scope.updateFilterDates = function(){

                $scope.initializeDateFilters();

                if($scope.filter.league.ref && $scope.filter.league.ref.seasons){
                    for(var i=0; i<$scope.filter.league.ref.seasons.length; i++){
                        $scope.filters.date.push({name:$scope.filter.league.ref.seasons[i].name, startDate: new Date($scope.filter.league.ref.seasons[i].startDate), endDate: new Date($scope.filter.league.ref.seasons[i].endDate), primary:true});

                    }
                }
            };

            $scope.updateHistoryStats = function(){

                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                picks = $filter('filter')(picks, $scope.search.text);

                $scope.historyStats = {
                    profit:0,
                    roi:0,
                    win:0,
                    loss:0,
                    push:0,
                    total:picks.length,
                    units:0,
                    totalOdds:0,
                    winPercent:0,
                    avgOdds:0,
                    avgBet:0
                };

                for(var i=0; i<picks.length; i++){
                    if(picks[i].result.toLowerCase() === 'half-loss'){
                        $scope.historyStats.loss++;
                    } else if(picks[i].result.toLowerCase() === 'half-win'){
                        $scope.historyStats.win++;
                    } else {
                        $scope.historyStats[picks[i].result.toLowerCase()]++;
                    }
                    $scope.historyStats.units += picks[i].units;
                    $scope.historyStats.totalOdds += picks[i].odds;
                    $scope.historyStats.profit += picks[i].profit;
                }

                $scope.historyStats.avgOdds = $scope.historyStats.totalOdds/$scope.historyStats.total;
                $scope.historyStats.roi = ($scope.historyStats.profit/$scope.historyStats.units)*100;
                $scope.historyStats.winPercentage = ($scope.historyStats.win/$scope.historyStats.total)*100;
                $scope.historyStats.avgBet = $scope.historyStats.units/$scope.historyStats.total;


            };

            $scope.currentPage = 1;
            $scope.pageSizes = [10, 20, 30, 40, 50];
            $scope.pageSize = {number:$scope.pageSizes[0]};
            $scope.search = {text:''};

            $scope.updatePages = function(){
                var picks = $filter('filter')($scope.picks, function(pick){
                    return $scope.historyFilter(pick);
                });
                picks = $filter('filter')(picks, $scope.search.text);
                $scope.numberOfPages = Math.ceil(picks.length / $scope.pageSize.number);

                $scope.pages = function() {
                    var pages = [];
                    for (var i = 1; i <= $scope.numberOfPages; i++) {
                        pages.push(i);
                    }
                    return pages;
                };

                $scope.currentPage = 1;
            };

            $scope.nextPage = function() {
                if ($scope.currentPage !== $scope.numberOfPages) {
                    $scope.currentPage++;
                }
            };

            $scope.prevPage = function() {
                if ($scope.currentPage !== 1) {
                    $scope.currentPage--;
                }
            };



            $scope.getExportHeader = function(){
                return ['result', 'date', 'sport', 'league', 'home team', 'away team', 'bet', 'bet type', 'bet duration', 'odds', 'units', 'roi', 'profit'];
            };

            $scope.getExportData = function() {
                var exportData = [];

                for (var i = 0; i < $scope.picks.length; i++) {
                    exportData.push({
                        result: $scope.picks[i].result,
                        date: new Date($scope.picks[i].event.startTime),
                        sport: $scope.picks[i].event.sport.name,
                        league: $scope.picks[i].event.league.name,
                        home: $scope.picks[i].event.contestant1.name,
                        away: $scope.picks[i].event.contestant2.name,
                        bet: $filter('betName')($scope.picks[i], $scope.picks[i].event),
                        betType: $scope.picks[i].betType,
                        period: $scope.picks[i].betDuration,
                        odds: $filter('formatOdds')($scope.picks[i].odds),
                        units: $scope.picks[i].units,
                        roi: $scope.picks[i].roi,
                        profit: $scope.picks[i].profit
                    });
                    /*
                     if('contestantWinner' in $scope.picks[i].event){
                     exportData[i].contestantWinner = $scope.picks[i].event.contestantWinner.name;
                     } else if ($scope.picks[i].event.draw){
                     exportData[i].contestantWinner = 'draw';
                     }
                     */
                }

                return exportData;
            };


            $scope.initializeFilters();
            $scope.updateHistoryStats();
            $scope.updatePages();

        }]
    };
});

angular.module('users').directive('trackerLineChart', function(){
    return {
        restrict: 'E',
        scope:{
            picks: '=',
            statSummary: '=',
            field: '=',
            includeZoom: '=',
            title: '='
        },
        templateUrl: 'modules/fu/client/templates/tracker/tracker-line-chart.html',
        controller: ['$scope', '$filter', 'Modal', function($scope, $filter, Modal) {

            var lineChartDefaults = {
                type: 'LineChart',
                displayed: true,
                data: {
                    cols: [
                        {id: 'date', label:'Date', type:'date', p:{}}
                    ],
                    rows: []
                },
                options: {
                    curveType: 'function',
                    fill: 20,
                    displayExactValues: true,
                    legend:null,
                    vAxis: {
                        title: 'Profit (Units)',
                        gridlines: {
                            count:-1,
                            color:'transparent'
                        },
                        titleTextStyle: {italic: false, fontSize:12},
                        baselineColor: '#dfe5e9',
                        textStyle:{ fontSize:12}
                    },
                    hAxis: {
                        gridlines:{
                            count:-1,
                            color:'transparent'
                        },
                        titleTextStyle: {italic: false, fontSize:12},
                        slantedText: false,
                        baselineColor: '#dfe5e9',
                        format:'MMM d, y',
                        textStyle:{ fontSize:12}
                    },
                    animation: {
                        duration: 300,
                        startup:true
                    },
                    chartArea:{
                        left:50,
                        top:10,
                        height:'80%',
                        width:'100%',
                        backgroundColor: {
                            stroke:'#dfe5e9',
                            strokeWidth:1
                        }
                    },
                    explorer:{
                        actions: ['dragToZoom', 'rightClickToReset'],
                        axis: 'horizontal'
                    },
                    fontName: 'Lato',
                    colors: []
                },

                formatters: {}
            };

            var getLineChart = function(statSummary, picks, field, duration){
                var chart = angular.copy(lineChartDefaults);

                if(!$scope.includeZoom){
                    chart.options.vAxis.gridlines.color ='#fafafa';
                    chart.options.legend = {position: 'top', textStyle: { color: 'gray', fontName: 'Lato', fontSize: 14}};
                    chart.options.chartArea.top = 'auto';
                }

                var totalValue = {};
                var durationValue = {};
                var lastCompareDate = new Date();
                var values =[];
                var total = {};

                //Initialize the columns and colors
                for(var i=0; i<statSummary.length; i++) {

                    //Initialize columns
                    chart.data.cols.push({id: statSummary[i].category, label: statSummary[i].category, type: 'number', p: {}});
                    totalValue[statSummary[i].category] = 0;
                    durationValue[statSummary[i].category] = 0;
                    total[statSummary[i].category] = 0;

                    //Initialize colors
                    if(statSummary[i].color){
                        chart.options.colors.push(statSummary[i].color);
                    }
                }

                //Order Picks
                picks = $filter('orderBy')(picks, 'event.startTime');


                //Loop through each pick
                for(var j=0; j<picks.length; j++){
                    var currentCategory;

                    //Get the current category name
                    if(field.indexOf('.') !== -1){
                        var properties = field.split('.');
                        currentCategory =  picks[j];
                        for(var k=0; k<properties.length; k++){
                            currentCategory =  currentCategory[properties[k]];
                        }
                        currentCategory = currentCategory.name;
                    } else {
                        currentCategory = picks[j][field];
                    }

                    //check to see how to group values based on day, week, or month
                    var currentStartTime = new Date(picks[j].event.startTime);
                    var compareDate;

                    switch (duration){
                        case 'Day':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                            break;
                        case 'Week':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                            compareDate.setDate(compareDate.getDate() - compareDate.getDay()+1);
                            break;
                        case 'Month':
                            compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), 1, 0, 0, 0, 0, 0);
                            break;
                    }

                    if(compareDate.toString() !== lastCompareDate.toString()){
                        var row = {c: [{v:compareDate}]};
                        for(var l=0; l<statSummary.length; l++){
                            totalValue[statSummary[l].category] += durationValue[statSummary[l].category];
                            row.c.push({v:parseFloat(totalValue[statSummary[l].category].toFixed(2))});
                            durationValue[statSummary[l].category] = 0;
                        }
                        values.push(row);
                        durationValue[currentCategory] += picks[j].profit;
                    } else {
                        durationValue[currentCategory] += picks[j].profit;
                    }
                    lastCompareDate = compareDate;

                }

                for(var m=0; m<statSummary.length; m++){
                    values[values.length - 1].c[m+1].v = values[values.length - 1].c[m+1].v + durationValue[statSummary[m].category];
                    values[values.length - 1].c[m+1].v = parseFloat(values[values.length - 1].c[m+1].v.toFixed(2));
                }


                //If not colours were added, than remove color option
                if(chart.options.colors.length === 0){
                    delete chart.options.colors;
                }
                chart.data.rows = values;
                return chart;
            };


            $scope.filter = 'Day';
            $scope.updateChart = function(filter){
                $scope.filter = filter;
                $scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, filter);
            };

            $scope.showModal = function(){
                Modal.showModal('modules/fu/client/templates/tracker/chart-modal.html', 'ChartModalController', {
                    picks: function () {
                        return $scope.picks;
                    },
                    statSummary: function () {
                        return $scope.statSummary;
                    },
                    field: function(){
                        return $scope.field;
                    },
                    title: function(){
                        return $scope.title;
                    }
                }, 'lg');
            };

            //$scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, 'Day');

            $scope.$watch('statSummary', function () {
                $scope.chart = getLineChart($scope.statSummary, $scope.picks,  $scope.field, $scope.filter);
            });


        }]
    };
});
