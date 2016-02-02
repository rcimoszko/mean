'use strict';

angular.module('fu').factory('Charts', [
    function() {
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
                colors:['#21759B'],
                explorer:{
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                fontName: 'Lato'
            },
            formatters: {}

        };


        var createChart = function(type, data){
            switch(type){
                case 'area':
                    var chart = angular.copy(areaChartDefaults);
                    chart.data.cols = data.cols;
                    for(var i=0; i < data.rows.length; i++){
                        data.rows[i].c[0].v = new Date(data.rows[i].c[0].v);
                    }
                    chart.data.rows = data.rows;
                    return chart;
            }
        };

        return {
            createChart: createChart
        };
    }
]);