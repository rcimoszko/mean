'use strict';

angular.module('fu').controller('ProfileController', ['$scope', '$state', '$stateParams', 'Users', 'Authentication', '$filter', 'Loading', 'Page', '$location', 'Modal',
    function ($scope, $state, $stateParams, Users, Authentication, $filter, Loading, Page, $location, Modal) {
        $scope.username = $stateParams.username;
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.location = $location;
        if(!$scope.username) $state.go('hub');

        Page.meta.title = $scope.username + ' Picks & Verified Record | FansUnite';
        Page.meta.description = 'Get access to '+$scope.username+"'s sportsbetting picks with 100% verified and transparent results.";
        Page.meta.keywords = 'free picks, free tips, pro picks, pro tips';

        function cbGetProfile(err, profile){
            if(!profile) $state.go('not-found');
            $scope.loading.isLoading.pageLoading = false;
            if(!err) $scope.profile = profile;
            $scope.initializeTracker($scope.profile.trackerPicks);
        }
        $scope.loading.isLoading.pageLoading = true;
        Users.getProfile($scope.username, cbGetProfile);

        /**
         *
         *
         * TRACKER
         *
         */

        $scope.trackerTabs = [
            {active:false},
            {active:false},
            {active:false},
            {active:false}
        ];

        $scope.initialized = false;
        $scope.initialClick = function(){
            if(!$scope.initialized) $scope.trackerTabs[0].active = true;
            $scope.initialized = true;
        };

        $scope.initializeTracker = function(picks){
            if(picks.length>0){
                $scope.picks = $filter('filter')(picks, function(pick){
                    return pick.result !== 'Pending';
                });
                $scope.betTypeStats = getSummaryStats($scope.picks, 'betType');
                $scope.sportStats = getSummaryStats($scope.picks, 'event.sport');
                $scope.allTeamStats = getSummaryStats($scope.picks, 'contestant.ref');
                $scope.allTeamStats = $filter('limitTo')($scope.allTeamStats, 5);

                $scope.betTypeColumnChart = getColumnChart($scope.betTypeStats, 'Bet Type');
                $scope.sportColumnChart = getColumnChart($scope.sportStats, 'Sport');
                $scope.teamColumnChart = getColumnChart($scope.allTeamStats, 'Team');
                $scope.betTypeWageredPieChart = getPieChart($scope.betTypeStats, 'Bet Type', {label:'Units Wagered',field:'units'});
                $scope.profitAreaChart = getAreaChart($scope.picks, {label:'Profit',field:'profit'}, 'Day');
                $scope.sportWageredPieChart = getPieChart($scope.sportStats, 'Sport', {label:'Units Wagered',field:'units'});

                $scope.updateOverview('Day');
            }
        };


        $scope.username = $stateParams.username;
        $scope.authentication = Authentication;


        var colors ={
            'moneyline': '#134580',     //blue
            'spread': '#ed7023',        //orange
            'team totals': '#F9BF3B',   //yellow
            'total points': '#00B16A',  //green
            'sets': '#32b5bf',          //indigo

            'basketball': '#E87E04', //Orange
            'hockey': '#4183D7', // blue
            'soccer': '#26A65B', //green
            'baseball':'#F4D03F', //yellow
            'mixed martial arts': '#CF000F', //red
            'football': '#34495E', //dark orange
            'e sports': '#663399', //purple

            'tennis': '#3FC380', //green
            'aussie rules': '#D24D57', //red
            'cricket': '#F4B350', //orange
            'curling': '#81CFE0', //blue
            'golf': '#36D7B7', //green
            'rugby league': '#F5D76E', //yellow
            'rugby union': '#9B59B6', //purple
            'volleyball': '#6C7A89' //gray
        };

        var colorList = [
            '#134580', '#ed7023', '#00B16A', '#F9BF3B', '#32b5bf', '#D24D57', '#9B59B6', '#6C7A89', '#CF000F', '#26A65B', '#81CFE0'
        ];


        //set axis title
        //set legend
        var groupResult = function(category, property, value, picks, color, color2){

            //Check for category name
            if(category && typeof category === 'object' && 'name' in category){
                category = category.name;
            }

            //Filter Picks
            var properties = property.split('.');
            picks = $filter('filter')(picks, function(pick){
                var compare = pick;
                for(var i=0; i<properties.length; i++){
                    if(compare && properties[i] in compare){
                        compare = compare[properties[i]];
                    }
                }

                return compare === value;
            });

            var results = {};
            if(picks.length > 0){

                //Category, Win, Loss, Push, Total, Units Wagered, Avg. Odds, Win %, ROI, Profit
                results = {
                    category: category,
                    win: 0,
                    loss: 0,
                    push: 0,
                    cancelled: 0,
                    pending:0,
                    total: picks.length,
                    units: 0,
                    avgOdds: 0,
                    totalOdds: 0,
                    winPercentage: 0,
                    roi: 0,
                    profit:0,
                    color: color
                };

                if(color2){
                    results.color2 = color2;
                }

                for(var i= 0; i<picks.length;i++){
                    if(picks[i].result.toLowerCase() === 'half-loss'){
                        results.loss++;
                    } else if(picks[i].result.toLowerCase() === 'half-win'){
                        results.win++;
                    } else {
                        results[picks[i].result.toLowerCase()]++;
                    }

                    results.units += picks[i].units;
                    results.totalOdds += picks[i].odds;
                    results.profit += picks[i].profit;
                }

                results.avgOdds = results.totalOdds/results.total;
                results.roi = (results.profit/results.units)*100;
                results.winPercentage = (results.win/results.total)*100;
            }
            return results;
        };

        var getUnique = function(array, field){
            var unique = $filter('unique')(array, field);
            unique = $filter('map')(unique, field);
            unique = $filter('remove')(unique, undefined);
            return unique;
        };

        var getSummaryStats = function(picks, field){

            var unique = getUnique(picks, field);
            var stats = [];
            var colorIndex = 0;

            for (var i=0; i<unique.length;i++){

                var property = field;
                var value = unique[i];

                //Update property and value if name is included
                if(unique[i] && typeof unique[i] === 'object'  && 'name' in unique[i]){
                    property = property +'.name';
                    value = value.name;
                }

                //get colours for the current category
                var color;
                var color2;
                if(unique[i] && field === 'contestant.ref' && 'darkColor' in unique[i]){
                    color = unique[i].lightColor;
                    color2 = unique[i].darkColor;
                } else if(unique[i] && typeof unique[i] === 'object' && 'name' in unique[i]) {
                    if(unique[i].name.toLowerCase() in colors){
                        color = colors[unique[i].name.toLowerCase()];
                    } else {
                        color = colorList[colorIndex];
                        colorIndex++;
                    }
                } else if(value in colors){
                    color = colors[value];
                } else {
                    color = colorList[colorIndex];
                    colorIndex++;
                }

                if(colorIndex > 11){
                    colorIndex = 0;
                }

                //Get results for the current category
                var results = groupResult(unique[i], property, value, picks, color, color2);
                if(results){
                    stats.push(results);
                }
            }

            stats = $filter('orderBy')(stats, 'profit', true);
            return stats;
        };

        /**
         * Chart Defaults
         */

        var areaChartDefaults = {
            type: 'AreaChart',
            displayed: true,
            data: {
                cols: [
                    {id: 'date', label:'Date', type:'date', p:{}}
                ],
                rows: []
            },
            options: {
                curveType: 'function',
                isStacked: 'true',
                fill: 20,
                displayExactValues: true,
                legend:null,
                vAxis: {
                    title: 'Profit (Units)',
                    gridlines: {
                        count: -1,
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
                    duration: 500,
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
                colors:['#054481'],
                explorer:{
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                fontName: 'Lato'
            },
            formatters: {}

        };

        var columnChartDefaults = {
            type: 'ColumnChart',
            displayed: true,
            data: {
                cols: [],
                rows: []
            },
            options: {
                fontName: 'Lato',
                displayExactValues: true,
                bars: 'horizontal',
                vAxis: {
                    title: 'Profit (Units)',
                    gridlines: {
                        color:'transparent',
                        count:-1
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    gridlines:{
                        color:'transparent'
                    },
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12},
                    textPosition: 'none'
                },
                animation: {
                    duration: 1000,
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
                colors: []

            },
            formatters: {}
        };

        var donutChartDefaults = {
            type: 'PieChart',
            displayed: true,
            data: {
                cols: [

                ],
                rows: [

                ]
            },
            options: {
                fontName: 'Lato',
                displayExactValues: true,
                pieHole: 0.4,
                vAxis: {
                    title: 'Profit (Units)',
                    titleTextStyle: {italic: false, fontSize:12},
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                hAxis: {
                    titleTextStyle: {italic: false, fontSize:12},
                    slantedText: false,
                    baselineColor: '#dfe5e9',
                    textStyle:{ fontSize:12}
                },
                animation: {
                    duration: 1000,
                    startup:true
                },
                chartArea:{
                    bottom:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:'90%',
                    backgroundColor: {
                        stroke:'#dfe5e9',
                        strokeWidth:1
                    }
                },
                legend: 'none',
                colors: []
            },
            formatters: {}
        };

        /**
         * Initialize Charts
         */

        var getAreaChart = function(picks, category, duration){
            //Get chart defaults
            var chart = angular.copy(areaChartDefaults);
            chart.data.cols.push({id: category.field, label: category.label, type: 'number', p: {}});

            //initialize variables
            var totalValue = 0;
            var durationValue = 0;
            var lastCompareDate = new Date();
            var values = [];

            picks = $filter('orderBy')(picks, 'event.startTime');

            //Loop through each pick
            for(var i=0; i<picks.length; i++){

                //check to see how to group values based on day, week, or month
                var currentStartTime = new Date(picks[i].event.startTime);
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
                    totalValue += durationValue;
                    values.push({c:[{v:compareDate}, {v:parseFloat(totalValue.toFixed(2))}]});
                    durationValue = 0;
                    durationValue += picks[i][category.field];
                } else {
                    durationValue += picks[i][category.field];
                }
                lastCompareDate = compareDate;
            }

            //Add last value
            if(values.length){
                values[values.length - 1].c[1].v = values[values.length - 1].c[1].v + durationValue;
            }

            chart.data.rows = values;
            return chart;
        };

        var getColumnChart = function(statSummary, category){
            var chart = angular.copy(columnChartDefaults);
            chart.data.cols = [
                {id: category, label:category, type:'string'},
                {id: 'profit', label:'profit', type:'number'},
                {role: 'style', type:'string'}
            ];

            for(var i=0; i<statSummary.length; i++){
                chart.data.rows.push(
                    {c:[{v:statSummary[i].category},{v:parseFloat(statSummary[i].profit.toFixed(2))}]}
                );
                var style = '';
                if(statSummary[i].color){
                    style = 'fill-color:'+statSummary[i].color;
                    if(statSummary[i].color2){
                        style += ';stroke-color:'+statSummary[i].color2+'; stroke-width: 2; ';
                    }
                }

                chart.data.rows[i].c.push({v:style});
            }

            //if no colours than delete color field
            if(chart.options.colors.length === 0){
                delete chart.options.colors;
            }
            return chart;

        };

        var getPieChart = function(statSummary, category, value){

            //Get chart defaults
            var chart = angular.copy(donutChartDefaults);

            chart.data.cols.push({id: category, label:category, type:'string', p:{}});
            chart.data.cols.push({id: value.field, label:value.label, type:'number', p:{}});

            //Loop through each start summary
            for(var i=0; i<statSummary.length; i++){

                //add rows
                chart.data.rows.push({
                    c: [ { v: statSummary[i].category }, { v:  statSummary[i][value.field] } ]
                });

                //add colors
                if(statSummary[i].color){
                    chart.options.colors.push(statSummary[i].color);
                }
            }

            //If no colours exist than delete color field
            if(chart.options.colors.length === 0){
                delete chart.options.colors;
            }
            return chart;
        };

        /**
         * OVERVIEW TAB
         */

        $scope.overviewFilter = 'Day';

        $scope.updateOverview = function(overviewFilter){

            //Update overview filter
            $scope.overviewFilter = overviewFilter;
            $scope.overviewStats = [];
            var lastStartDate = new Date();
            var index = -1;

            //loop through picks
            for(var i=0; i<$scope.picks.length;i++) {

                //Get compare date
                var currentStartTime = new Date($scope.picks[i].event.startTime);
                var compareDate;
                switch ($scope.overviewFilter) {
                    case 'Day':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        break;
                    case 'Week':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), currentStartTime.getDate(), 0, 0, 0, 0);
                        compareDate.setDate(compareDate.getDate() - compareDate.getDay() + 1);
                        break;
                    case 'Month':
                        compareDate = new Date(currentStartTime.getFullYear(), currentStartTime.getMonth(), 1, 0, 0, 0, 0, 0);
                        break;
                }

                if (Date.UTC(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate()) < Date.UTC(lastStartDate.getFullYear(), lastStartDate.getMonth(), lastStartDate.getDate(), lastStartDate.getHours())) {
                    if (index !== -1) {
                        $scope.overviewStats[index].avgOdds = $scope.overviewStats[index].totalOdds / $scope.overviewStats[index].total;
                        $scope.overviewStats[index].roi = ($scope.overviewStats[index].profit / $scope.overviewStats[index].units) * 100;
                        $scope.overviewStats[index].winPercentage = ($scope.overviewStats[index].win / $scope.overviewStats[index].total) * 100;
                    }

                    var results = {
                        category: compareDate,
                        win: 0,
                        loss: 0,
                        push: 0,
                        cancelled: 0,
                        pending: 0,
                        total: 0,
                        units: 0,
                        avgOdds: 0,
                        totalOdds: 0,
                        winPercentage: 0,
                        roi: 0,
                        profit: 0
                    };

                    index++;
                    if (index === 10) {
                        break;
                    }
                    $scope.overviewStats.push(results);
                }

                $scope.overviewStats[index][$scope.picks[i].result.toLowerCase()]++;
                $scope.overviewStats[index].total++;
                $scope.overviewStats[index].units += $scope.picks[i].units;
                $scope.overviewStats[index].totalOdds += $scope.picks[i].odds;
                $scope.overviewStats[index].profit += $scope.picks[i].profit;

                lastStartDate = compareDate;
            }

            if(index < 10){
                $scope.overviewStats[index].avgOdds = $scope.overviewStats[index].totalOdds/$scope.overviewStats[index].total;
                $scope.overviewStats[index].roi = ($scope.overviewStats[index].profit/$scope.overviewStats[index].total)*100;
                $scope.overviewStats[index].winPercentage = ($scope.overviewStats[index].win/$scope.overviewStats[index].total)*100;
            }

        };

        $scope.updateProfitAreaChart = function(overviewFilter){
            $scope.profitAreaChart = getAreaChart($scope.picks, {label:'Units Wagered',field:'profit'}, overviewFilter);
        };

        /**
         * SPORT TAB
         */


        $scope.selectedSport = null;
        $scope.updateLeagueStats = function(sport){
            $scope.selectedSport = sport;
            var picks = $filter('filter')($scope.picks, function(pick){
                return pick.event.sport.name === sport;
            });
            $scope.showLeagueChart = false;
            $scope.leagueStats = getSummaryStats(picks, 'event.league');
            $scope.teamStats = [];

            if(sport !== 'Soccer' && sport !== 'E Sports' && sport !== 'Tennis'){
                $scope.showLeagueChart = true;
                $scope.leagueWageredPieChart = getPieChart($scope.leagueStats, 'League', {label:'Units Wagered',field:'units'});
            } else {
                $scope.showLeagueChart = false;
                $scope.leagueWageredPieChart = null;
                $scope.leagueProfitLineChart = null;
            }
        };

        $scope.selectedLeague = null;
        $scope.updateTeamStats = function(league){
            $scope.selectedLeague = league;
            var picks = $filter('filter')($scope.picks, function(pick){
                return pick.event.league.name === league;
            });
            $scope.teamStats = getSummaryStats(picks, 'contestant.name');
        };


        /**
         * General
         */

        $scope.showFollowingModal = function(){
            Modal.showModal(
                'modules/fu/client/views/profile/modal/modal-profile-following.client.view.html',
                'ModalProfileFollowingController',
                {
                    userId: function () {
                        return $scope.profile.user._id;
                    }
                },
                'lg'
            );
        };

        $scope.showFollowerModal = function(){
            Modal.showModal(
                'modules/fu/client/views/profile/modal/modal-profile-followers.client.view.html',
                'ModalProfileFollowersController',
                {
                    userId: function () {
                        return $scope.profile.user._id;
                    }
                },
                'lg'
            );
        };


    }
]);
